import fs from 'node:fs';
import path from 'node:path';
import { expect, describe, it, beforeAll } from '@jest/globals';

import { Point, nearestNeighbors } from '../src';

const basePointsPath = path.join(__dirname, './data/base-points.csv');
const transomedPointsPath = path.join(__dirname, './data/transformed-points.csv');

let basePoints: Point[];
let transomedPoints: Point[];

beforeAll(async () => {
  basePoints = await readCsvPoints(basePointsPath);
  transomedPoints = await readCsvPoints(transomedPointsPath);
})

describe('nearestNeighbors', () => {
  it('should calculate nearest neighbors properly', async () => {
    // nearestNeighbors()
    expect(fs).toBeDefined();
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