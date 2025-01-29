import path from 'node:path';
import { expect, describe, it, beforeAll } from '@jest/globals';

import { Point, icp, nearestNeighbors } from '../src';
import { dot, getCentroid, rotationMatrixToAngle, translateNegative, transpose } from '../src/utils';
import { calculateU, eigh, qrDecomposition } from '../src/eigh';
import { Matrix2d } from '../src/models';
import { readCsvPoints, roundNumber } from './utils';

const basePointsPath = path.join(__dirname, './data/test1a.csv');
const transomedPointsPath = path.join(__dirname, './data/test1b.csv');

let basePoints: Point[];
let transomedPoints: Point[];

beforeAll(async () => {
  basePoints = await readCsvPoints(basePointsPath);
  transomedPoints = await readCsvPoints(transomedPointsPath);
});

describe('nearestNeighbors', () => {
  it('should calculate nearest neighbors properly', async () => {
    const {res} = nearestNeighbors(basePoints, transomedPoints);
    expect(res[0][0]).toBe(2830);
    expect(res[0][1]).toBe(-398);

    expect(res[1][0]).toBe(2835);
    expect(res[1][1]).toBe(-329);

    expect(res[2][0]).toBe(2840);
    expect(res[2][1]).toBe(-268);
  });
});

describe('rotationMatrixToAngle', () => {
  it('should convert rotation radians to angle', () => {
    const rotation: Matrix2d = [
      [ 0.99998827,  0.00484389],
      [-0.00484389,  0.99998827]
    ];
    expect(rotationMatrixToAngle(rotation)).toBe(-0.2775355382751544);
  });
});

describe('translateNegative', () => {
  it('should subtract point from points', () => {
    const translated = translateNegative([[1, 1]], [2, 2]);
    expect(translated[0]).toEqual([-1, -1]);
  });
});

describe('getCentroid', () => {
  it('should get centroid', () => {
    expect(getCentroid([[10, 10], [1, 1]])).toEqual([5.5, 5.5]);
  });
});

describe('transpose', () => {
  it('should return transposed matrix', () => {
    const transposed = transpose(basePoints);
    expect(transposed.length).toBe(basePoints[0].length);
    expect(transposed[0].length).toBe(basePoints.length);
    expect(transposed[0][0]).toBe(basePoints[0][0]);
    expect(transposed[0][1]).toBe(basePoints[1][0]);
    expect(transposed[1][0]).toBe(basePoints[0][1]);
  });
});

describe('dot', () => {
  it('should return dot product of two matrices', () => {
    expect(dot([[1, 2], [3, 4]], [[4, 3], [2, 1]])).toEqual([
      [8, 5],
      [20, 13]
    ]);
  });
});

describe('qrDecomposition', () => {
  const m: Matrix2d = [
    [1795.575663756467, -43.15474993218908],
    [-292.7725745336766, 1671.4799537575948]
  ];
  const {q, r}= qrDecomposition(m);

  it('should compute the qr factorization of a matrix', () => {
    expect(q).toEqual([
      [0.9869663062270035, 0.16092703431252559],
      [-0.16092703431252559, 0.9869663062270035]
    ]);
    expect(r).toEqual([
      [1819.2877025565676, -311.5785960077698],
      [0, 1642.7496299695301]
    ]);
  });

  it('q should return identity', () => {
    const identity = dot(transpose(q), q).map((r) => r.map(roundNumber));
    expect(identity).toEqual(identity);
  });

  it('r should be equal to input', () => {
    expect(dot(q, r)).toEqual(m);
  });
});

describe('eigh', () => {
  const m: Matrix2d = [
    [1795.575663756467, -43.15474993218908],
    [-292.7725745336766, 1671.4799537575948]
  ];
  const {eigenvalues} = eigh(m);

  it('should calculate proper eigenvalues ', () => {
    expect(eigenvalues).toEqual([1861.9196540616456, 1605.1359634524163]);
  });
});

describe('calculateU', () => {
  it('should return left singular vectors in single value decomposition', () => {
    const m: Matrix2d = [
      [1795.575663756467, -43.15474993218908],
      [-292.7725745336766, 1671.4799537575948]
    ];
    expect(calculateU(m)).toEqual([
      [0.7994584129224676, 0.6007214379456496],
      [-0.6007214379456489, 0.7994584129224678]
    ]);
  });
});

describe('icp', () => {
  it('should have error less for provided points', () => {
    const {err} = icp(basePoints, transomedPoints);
    expect(err).toBeLessThan(100);
  });
});