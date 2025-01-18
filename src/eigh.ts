import { Matrix2d, Vector } from './models';
import { dot, transpose } from './utils';

function selectColumns(matrix: Matrix2d, columns: Vector): Matrix2d {
  return matrix.map(row => columns.map(col => row[col]));
}

function qrDecomposition(a: Matrix2d): {
  q: Matrix2d, r: Matrix2d
} {
  const m: number = a.length;
  const n: number = a[0].length;

  const q: Matrix2d = Array.from({ length: m }, () => Array(n).fill(0));
  const r: Matrix2d = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    const v: Vector = Array.from({ length: m }, (_, j) => a[j][i]);

    for (let j = 0; j < i; j++) {
      r[j][i] = q.reduce((sum, _, k) => sum + q[k][j] * v[k], 0);
      for (let k = 0; k < m; k++) {
        v[k] -= r[j][i] * q[k][j];
      }
    }
  
    r[i][i] = Math.sqrt(v.reduce((sum, vk) => sum + vk ** 2, 0));
    for (let k = 0; k < m; k++) {
      q[k][i] = r[i][i] !== 0 ? v[k] / r[i][i] : 0;
    }
  }

  return { q, r };
}

function eigh(matrix: Matrix2d, tol = 1e-10, maxIterations = 1000): {
  eigenvalues: Vector, eigenvectors: Matrix2d
} {
  const n: number = matrix.length;
  
  let a: Matrix2d = matrix.map(row => row.slice());
  
  let eigenvectors: Matrix2d = Array.from({ length: n }, (_, i) => 
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );

  for (let iter = 0; iter < maxIterations; iter++) {
    const { q, r } = qrDecomposition(a);

    a = dot(r, q);
    eigenvectors = dot(eigenvectors, q);

    // Check for convergence
    let offDiagonalSum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        offDiagonalSum += a[i][j] ** 2;
      }
    }
    if (offDiagonalSum < tol) break;
  }

  const eigenvalues: Vector = a.map((row, i) => row[i]);
  return { eigenvalues, eigenvectors };
}

export function calculateU(m: Matrix2d): Matrix2d {
  const b = dot(m, transpose(m));
      
  const {eigenvalues, eigenvectors} = eigh(b);
  const nCols: Vector = Array.from(eigenvalues)
    .map((value, index) => [index, value])
    .sort((a, b) => b[1] - a[1])
    .map(([index]) => index);

  return selectColumns(eigenvectors, nCols)
}

export function calculateVt(m: Matrix2d): Matrix2d {
  const mT = transpose(m);
  const b = dot(mT, m);

  const { eigenvalues, eigenvectors } = eigh(b);

  const nCols: Vector = Array.from(eigenvalues)
    .map((value, index) => [index, value])
    .sort((a, b) => b[1] - a[1])
    .map(([index]) => index);

  return transpose(selectColumns(eigenvectors, nCols));
}