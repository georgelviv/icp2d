import fs from 'node:fs';
import { camelCaseToKebabCase, getPath, readCsvPoints, saveCsvPoints } from './utils';
import { icp, Options, OutliersFilteringStrategy, Point, Result } from '../src';

init([1, 2, 3, 4, 5, 6, 7, 8], ['none', 'maxDistance', 'std', 'trim']);

async function init(tasks: number[], strategies: OutliersFilteringStrategy[]): Promise<void> {
  for (let i = 0; i < tasks.length; i++) {
    const taskNumber = tasks[i];
  
    console.log(`Task ${i + 1}/${tasks.length} running`);
    await writeResults(taskNumber, strategies);
    console.log(`Task ${i + 1}/${tasks.length} completed`);
  }
}

async function writeResults(task: number, strategies: OutliersFilteringStrategy[]): Promise<void> {
  const basePointsPath = getPath(`data/test${task}a.csv`);
  const transomedPointsPath = getPath(`data/test${task}b.csv`);
  const basePoints: Point[] = await readCsvPoints(basePointsPath);
  const transomedPoints: Point[] = await readCsvPoints(transomedPointsPath);

  for (let strategy of strategies) {
    const opts: Partial<Options> = {
      verbose: true, filterOutliers: {
        strategy
      }
    };
    const path: string = `results/${camelCaseToKebabCase(strategy)}`;
    await writeResult(basePoints, transomedPoints, opts, path, task);
  }
}

async function writeResult(
  basePoints: Point[], transomedPoints: Point[],
  options: Partial<Options>, dir: string, task: number): Promise<void> {

  const timestamp: number = Date.now();
  const res = icp(basePoints, transomedPoints, options);
  console.log(`Execution time - ${Date.now() - timestamp}ms`)

  await saveCsvPoints(res.sourceTransformed, getPath(`${dir}/test${task}.csv`));
  await saveResults(res, options, getPath(`${dir}/results${task}.json`));
}

export async function saveResults(res: Result, options: Partial<Options>, filePath: string) {
  try {
    const data = {
      translation: res.translation, rotationMatrix: res.rotationMatrix,
      error: res.err,
      options
    };
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing CSV:', error);
    throw error;
  }
}