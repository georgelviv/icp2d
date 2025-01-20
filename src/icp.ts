import { calculateU, calculateVt } from './eigh';
import { Matrix2d, Options, Point, Result, Vector } from './models';
import { nearestNeighbors } from './nearest-neighbors';
import { addTranslation, dot, getCentroid, getMean, matrixVectorMultiply, rotationMatrixToAngle, translate, transpose, vectorSubtract } from './utils';

const defaultOptions: Options = {
  tolerance: 1e-6,
  maxIterations: 500,
  verbose: false
};

export function icp(source: Point[], target: Point[], options: Partial<Options> = {}): Result {
  const opts = {
    ...defaultOptions,
    ...options
  };

  let prevError: number = Infinity;
  let t: Point;
  let r: Matrix2d;
  let sourceTransformed: Point[] = source;

  for (let i = 0; i < opts.maxIterations; i++) {
    const {res: matched, resDistance: matchedDistance} = nearestNeighbors(sourceTransformed, target);
    const sourceCentroid: Point = getCentroid(source);
    const targetCentroid: Point = getCentroid(matched);

    const sourceCentered: Point[] = translate(source, sourceCentroid);
    const targetCentered: Point[] = translate(matched, targetCentroid);

    const sourceCenteredTransposed: Matrix2d = transpose(sourceCentered);

    const h: Matrix2d = dot(sourceCenteredTransposed, targetCentered);

    const u: Matrix2d = calculateU(h);
    const vT: Matrix2d = calculateVt(h);

    r = dot(u, vT);
    const transformedSource: Vector = matrixVectorMultiply(r, sourceCentroid);
    t = vectorSubtract(targetCentroid, transformedSource) as Point;
    sourceTransformed = addTranslation(dot(source, r), t) as Point[];
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
    translation: t!,
    rotation: rotationMatrixToAngle(r!)
  };
}