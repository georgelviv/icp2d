import { calculateU, calculateVt } from './eigh';
import { Matrix2d, Matrix2x2, Options, Point, Result, Vector } from './models';
import { nearestNeighbors } from './nearest-neighbors';
import { filterNoise } from './noise';
import { getOutliersIndices } from './outliers';
import {
  addTranslation, deleteByIndices, dot, getCentroid, getMean, matrixVectorMultiply,
  rotationMatrixToAngle, translateNegative, translatePoint, transpose, vectorSubtract
} from './utils';

const defaultOptions: Options = {
  tolerance: 1e-6,
  maxIterations: 500,
  verbose: false,
  filterNoise: {
    strategy: 'dbscan',
    dbscanEpsilon: 100,
    dbscanMinPoints: 4
  },
  filterOutliers: {
    strategy: 'std',
    stdThreshold: 2,
    maxDistance: 500,
    trimPercent: 5
  }
};

export function icp(source: Point[], target: Point[], options: Partial<Options> = {}): Result {
  const opts: Options = {
    ...defaultOptions,
    ...options,
    filterNoise: {
      ...defaultOptions.filterNoise,
      ...options.filterNoise
    },
    filterOutliers: {
      ...defaultOptions.filterOutliers,
      ...options.filterOutliers
    }
  };

  let prevError: number = Infinity;
  let tFinal: Point = [0, 0];
  let rFinal: Matrix2x2 = [[1, 0], [0, 1]];
  let sourceTransformed: Point[] = filterNoise(opts.filterNoise, source);
  const filteredTarget: Point[] = filterNoise(opts.filterNoise, target);

  for (let i = 0; i < opts.maxIterations; i++) {
    const {res: matched, resDistance: matchedDistance} = nearestNeighbors(sourceTransformed, filteredTarget);
    const sourceCentroid: Point = getCentroid(sourceTransformed);
    const targetCentroid: Point = getCentroid(matched);

    const outliersIndices = getOutliersIndices(opts.filterOutliers, matchedDistance);

    sourceTransformed = deleteByIndices(sourceTransformed, outliersIndices);
    const filteredMatched: Point[] = deleteByIndices(matched, outliersIndices);

    if (!filteredMatched.length) {
      throw Error('Choose other filter strategy, as current removed all points');
    }

    const sourceCentered: Point[] = translateNegative(sourceTransformed, sourceCentroid);
    const targetCentered: Point[] = translateNegative(filteredMatched, targetCentroid);

    const sourceCenteredTransposed: Matrix2d = transpose(sourceCentered);

    const h: Matrix2d = dot(sourceCenteredTransposed, targetCentered);

    const u: Matrix2d = calculateU(h);
    const vT: Matrix2d = calculateVt(h);

    const r = dot(transpose(vT), transpose(u)); // rotation matrix
    const transformedSource: Vector = matrixVectorMultiply(r, sourceCentroid);
    const t = vectorSubtract(targetCentroid, transformedSource) as Point; // translation vector

    rFinal = dot(r, rFinal) as Matrix2x2;
    tFinal = translatePoint(matrixVectorMultiply(r, tFinal) as Point, t);

    sourceTransformed = addTranslation(dot(sourceTransformed, transpose(r)), t) as Point[];
  
    const meanError = getMean(matchedDistance);
    if (Math.abs(prevError - meanError) < opts.tolerance) {
      if (opts.verbose) {
        console.log(`Converged at iteration ${i + 1} with error ${meanError} with strategy: ${opts.filterOutliers.strategy}`);
      }
      break;
    }

    prevError = meanError;
  }

  return {
    err: prevError,
    sourceTransformed, 
    translation: tFinal,
    rotationMatrix: rFinal,
    rotation: rotationMatrixToAngle(rFinal)
  };
}