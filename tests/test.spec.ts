import fs from 'node:fs';
import path from 'node:path';
import { expect, describe, it, beforeAll, xit } from '@jest/globals';

import { Point, icp, nearestNeighbors } from '../src';
import { dot, getCentroid, rotationMatrixToAngle, translate, transpose } from '../src/utils';
import { calculateU, eigh, qrDecomposition } from '../src/eigh';
import { Matrix2d } from '../src/models';

const basePointsPath = path.join(__dirname, './data/base-points.csv');
const transomedPointsPath = path.join(__dirname, './data/transformed-points.csv');

let basePoints: Point[];
let transomedPoints: Point[];

beforeAll(async () => {
  basePoints = await readCsvPoints(basePointsPath);
  transomedPoints = await readCsvPoints(transomedPointsPath);
});

describe('nearestNeighbors', () => {
  it('should calculate nearest neighbors properly', async () => {
    const {res} = nearestNeighbors(basePoints, transomedPoints);
    expect(res[0][0]).toBeCloseTo(-2.28529617);
    expect(res[0][1]).toBeCloseTo(9.76129307);

    expect(res[1][0]).toBeCloseTo(6.08904046);
    expect(res[1][1]).toBeCloseTo(2.67545868);

    expect(res[2][0]).toBeCloseTo(-6.66889496);
    expect(res[2][1]).toBeCloseTo(-5.77451004);
  });
});

describe('rotationMatrixToAngle', () => {
  it('should convert rotation radians to angle', () => {
    const rotation = [
      [ 0.99998827,  0.00484389],
      [-0.00484389,  0.99998827]
    ];
    expect(rotationMatrixToAngle(rotation)).toBe(-0.2775355382751544);
  });
});

describe('translate', () => {
  it('should translate points', () => {
    const translated = translate(basePoints, [-1.18566445, -0.00710582]);
    expect(translated[0]).toEqual([-1.3235331730527502, 9.021391948198323]);
  });
});

describe('getCentroid', () => {
  it('should get centroid', () => {
    expect(getCentroid(basePoints)).toEqual([-1.1856644480680034, -0.007105816803623544]);
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
    expect(dot(transpose(basePoints), transomedPoints)).toEqual([
      [1795.575663756467, -43.15474993218908],
      [-292.7725745336766, 1671.4799537575948]
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
  const {eigenvalues, eigenvectors} = eigh(m);

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
  it('should calculate nearest neighbors properly', async () => {
    const {translation, rotation} = await icp(basePoints, transomedPoints);
    expect(translation).toEqual([1.0043732178847706, 0.7916555966686276]);
    expect(rotation).toBe(-5.002987763422438);
  });
});

async function readCsvPoints(filePath: string) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const result = lines.slice(1).map((line) => {
      const values: Point = line.split(',').map((value) => value.trim()).map(Number) as Point;
      return values;
    });

    return result;
  } catch (error) {
    console.error('Error reading CSV:', error);
    throw error;
  }
}

function roundNumber(n: number): number {
  return Math.round((n + Number.EPSILON) * 10000) / 10000;
}