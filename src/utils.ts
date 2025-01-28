import { Matrix2d, Point, Vector } from './models';

export function getCentroid(points: Point[]): Point {
  const x =  points.reduce((acc, next) => {
    return acc + next[0];
  }, 0) / points.length;
  const y =  points.reduce((acc, next) => {
    return acc + next[1];
  }, 0) / points.length;

  return [x, y];
}

export function translateNegative(points: Point[], translation: Point): Point[] {
  return points.map((point) => {
    return [
      point[0] - translation[0],
      point[1] - translation[1]
    ];
  });
}

export function transpose(matrix: Matrix2d): Matrix2d {
  const transposed = [];

  for (let i = 0; i < matrix[0].length; i ++) {
    const transposedRow = matrix.map((row) => {
      return row[i];
    });      
    transposed.push(transposedRow);
  }
  
  return transposed;
}

export function dot(a: Matrix2d, b: Matrix2d): Matrix2d {
  const rowsA = a.length;
  const colsA = a[0].length;
  const rowsB = b.length;
  const colsB = b[0].length;

  if (colsA !== rowsB) {
    throw Error('Cols A should == Rows B');
  }
  
  const c = Array.from({ length: rowsA }, () => Array(colsB).fill(0));

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsB; j++) {
      for (let k = 0; k < colsA; k++) {
        c[i][j] += a[i][k] * b[k][j];
      }
    }
  }

  return c;
}

export function matrixVectorMultiply(matrix: Matrix2d, vector: Vector): Vector {
  return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
}

export function vectorSubtract(v1: Vector, v2: Vector): Vector {
  return v1.map((value, i) => value - v2[i]);
}

export function addTranslation(points: Matrix2d, t: Vector): Matrix2d {
  return points.map(point => point.map((value, i) => value + t[i]));
}

export function translatePoint(v: Point, t: Point): Point {
  return [v[0] + t[0], v[1] + t[1]];
}

export function getMean(n: number[]): number {
  const sum = n.reduce((acc, value) => acc + value, 0);
  return sum / n.length;
}

export function rotationMatrixToAngle(r: Matrix2d): number {
  const angle = Math.atan2(r[1][0], r[0][0]);
  const angleInDegrees = angle * (180 / Math.PI);
  return angleInDegrees;
}

export function deleteByIndices<T>(arr: T[], indices: number[]): T[] {
  const indicesSet = new Set(indices);
  return arr.filter((_, index) => !indicesSet.has(index));
}