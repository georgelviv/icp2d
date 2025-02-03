export type Point = [x: number, y: number];
export interface Options {
  tolerance: number;
  maxIterations: number;
  verbose: boolean;
  filterNoise: FilterNoiseOptions;
  filterOutliers: FilterOutliersOptions;
};

export interface FilterNoiseOptions {
  dbscanEpsilon?: number;
  dbscanMinPoints?: number;
  strategy: NoiseFilteringStrategy;
}

export interface FilterOutliersOptions {
  strategy: OutliersFilteringStrategy;
  maxDistance?: number;
  stdThreshold?: number;
  trimPercent?: number;
  dbscanEpsilon?: number;
  dbscanMinPoints?: number;
}

export type NoiseFilteringStrategy = 'none' | 'dbscan';
export type OutliersFilteringStrategy = 'none' | 'maxDistance' | 'std' | 'trim';

export type Matrix2d = number[][];
export type Vector = number[];
export type Matrix2x2 = [Point, Point];

export interface Result {
  sourceTransformed: Point[];
  translation: Point;
  rotation: number;
  err: number;
  rotationMatrix: Matrix2x2;
}