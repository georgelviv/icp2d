export type Point = [x: number, y: number];
export interface Options {
  tolerance: number;
  maxIterations: number;
  verbose: boolean;
  filterOutliers: FilterOutliersOptions;
};

export interface FilterOutliersOptions {
  strategy: OutliersFilteringStrategy;
  maxDistance?: number;
  threshold?: number;
  trimPercent?: number;
}

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