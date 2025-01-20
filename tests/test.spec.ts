import fs from 'node:fs';
import path from 'node:path';
import { expect, describe, it, beforeAll } from '@jest/globals';

import { Point, icp, nearestNeighbors } from '../src';
import { rotationMatrixToAngle } from '../src/utils';

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
    expect(res[0][0]).toBeCloseTo(-2.50919762);
    expect(res[0][1]).toBeCloseTo(9.01428613);

    expect(res[1][0]).toBeCloseTo(4.59212357);
    expect(res[1][1]).toBeCloseTo(2.75114943);

    expect(res[2][0]).toBeCloseTo(-6.36350066);
    expect(res[2][1]).toBeCloseTo(-6.3319098);
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

describe('icp', () => {
  it('should calculate nearest neighbors properly', async () => {
    const {translation, rotation} = icp(basePoints, transomedPoints);
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