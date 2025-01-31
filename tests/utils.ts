import fs from 'node:fs';
import { Point } from '../src';

export async function readCsvPoints(filePath: string) {
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

export async function saveCsvPoints(points: Point[], filePath: string) {
  try {
    const rows = points.map((p) => `${p[0]},${p[1]}`).join('\n');
    const data = `x,y\n${rows}`;
    await fs.promises.writeFile(filePath, data);
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
}

export function roundNumber(n: number): number {
  return Math.round((n + Number.EPSILON) * 10000) / 10000;
}

export function camelCaseToKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}