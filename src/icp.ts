import { calculateU, calculateVt } from './eigh';
import { Matrix2d, Options, Point, Result, Vector } from './models';
import { nearestNeighbors } from './nearest-neighbors';
import {
  addTranslation, deleteByIndices, dot, getCentroid, getMean, matrixVectorMultiply,
  rotationMatrixToAngle, translateNegative, translatePoint, transpose, vectorSubtract
} from './utils';

const defaultOptions: Options = {
  tolerance: 1e-6,
  maxIterations: 500,
  verbose: false,
  maxDistance: 1000
};

export function icp(source: Point[], target: Point[], options: Partial<Options> = {}): Result {
  const opts = {
    ...defaultOptions,
    ...options
  };

  let prevError: number = Infinity;
  let tFinal: Point = [0, 0];
  let rFinal: Matrix2d = [[1, 0], [0, 1]];
  let sourceTransformed: Point[] = source;

  for (let i = 0; i < opts.maxIterations; i++) {
    let {res: matched, resDistance: matchedDistance} = nearestNeighbors(sourceTransformed, target);
    const sourceCentroid: Point = getCentroid(sourceTransformed);
    const targetCentroid: Point = getCentroid(matched);

    const outliersIndices = matchedDistance.reduce((acc: number[], next: number, i: number) => {
      if (next > opts.maxDistance) {
        acc.push(i);
      }
      return acc;
    }, []);

    sourceTransformed = deleteByIndices(sourceTransformed, outliersIndices);
    matched = deleteByIndices(matched, outliersIndices);

    const sourceCentered: Point[] = translateNegative(sourceTransformed, sourceCentroid);
    const targetCentered: Point[] = translateNegative(matched, targetCentroid);

    const sourceCenteredTransposed: Matrix2d = transpose(sourceCentered);

    const h: Matrix2d = dot(sourceCenteredTransposed, targetCentered);

    const u: Matrix2d = calculateU(h);
    const vT: Matrix2d = calculateVt(h);

    const r = dot(transpose(vT), transpose(u)); // rotation matrix
    const transformedSource: Vector = matrixVectorMultiply(r, sourceCentroid);
    const t = vectorSubtract(targetCentroid, transformedSource) as Point; // translation vector

    rFinal = dot(r, rFinal);
    tFinal = translatePoint(matrixVectorMultiply(r, tFinal) as Point, t);

    sourceTransformed = addTranslation(dot(sourceTransformed, transpose(r)), t) as Point[];
  
    const meanError = getMean(matchedDistance);
    if (Math.abs(prevError - meanError) < opts.tolerance) {
      if (opts.verbose) {
        console.log(`Converged at iteration ${i + 1}`);
      }
      break;
    }

    prevError = meanError;
  }

  return {
    sourceTransformed, 
    translation: tFinal,
    rotationMatrix: rFinal,
    rotation: rotationMatrixToAngle(rFinal)
  };
}