import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
import { readCsvPoints, saveCsvPoints } from './utils';
import { icp, Matrix2d, Point } from '../src';


init([1, 2, 3, 4, 5, 6]);

async function init(tasks: number[]): Promise<void> {
  for (let i = 0; i < tasks.length; i++) {
    const taskNumber = tasks[i];
  
    console.log(`Task ${i + 1}/${tasks.length} running`);
    await writeResults(taskNumber);
    console.log(`Task ${i + 1}/${tasks.length} completed`);
  }
}

async function writeResults(task: number): Promise<void> {
  const basePointsPath = getPath(`data/test${task}a.csv`);
  const transomedPointsPath = getPath(`data/test${task}b.csv`);
  const basePoints = await readCsvPoints(basePointsPath);
  const transomedPoints = await readCsvPoints(transomedPointsPath);

  const { sourceTransformed, translation, rotationMatrix } = icp(basePoints, transomedPoints, {verbose: true});

  saveCsvPoints(sourceTransformed, getPath(`results/test${task}.csv`));
  saveTransformations(translation, rotationMatrix, getPath(`results/transformations${task}.json`));
}

function getPath(relativePath: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, relativePath);
}

export async function saveTransformations(translation: Point, rotationMatrix: Matrix2d, filePath: string) {
  try {
    const data = {
      translation, rotationMatrix
    };
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
}