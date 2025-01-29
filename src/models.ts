export type Point = [x: number, y: number];
export interface Options {
  tolerance: number;
  maxIterations: number;
  verbose: boolean;
  maxDistance: number;
};

export type Matrix2d = number[][];
export type Vector = number[];
export type Matrix2x2 = [Point, Point];

export interface Result {
  sourceTransformed: Point[];
  translation: Point;
  rotation: number;
  rotationMatrix: Matrix2x2;
}