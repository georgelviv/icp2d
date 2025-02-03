export { icp } from './icp';
export type {
  Matrix2d, Options, Point, Result,
  Vector, FilterOutliersOptions, OutliersFilteringStrategy,
  FilterNoiseOptions, NoiseFilteringStrategy
} from './models';
export { nearestNeighbors } from './nearest-neighbors';
export { qrDecomposition, calculateU, calculateVt, eigh } from './eigh';