import fs from 'node:fs';
import path from 'node:path';
import { expect, describe, it } from '@jest/globals';

const basePointsPath = path.join(__dirname, './data/base-points.csv');

describe('Test Suite', () => {
  it('should check something', async () => {
    const basePoints = await readCsvPoints(basePointsPath);
    console.log(basePoints)
    expect(fs).toBeDefined();
  });
});

async function readCsvPoints(filePath: string) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',').map((header) => header.trim());
    const result = lines.slice(1).map((line) => {
      const values = line.split(',').map((value) => value.trim());
      const row: {[key: string]: number} = {};
      headers.forEach((header: string, index) => {
        row[header] = Number(values[index]) as number;
      });
      return row;
    });

    return result;
  } catch (error) {
    console.error('Error reading CSV:', error);
    throw error;
  }
}