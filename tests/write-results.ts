import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import fs from 'node:fs';
import { readCsvPoints, saveCsvPoints } from './utils';
import { FilterOutliersOptions, icp, Options, OutliersFilteringStrategy, Point, Result } from '../src';

init([1, 2, 3, 4, 5, 6, 7], true, true);

async function init(tasks: number[], includeMaxDistance = false, includeStd = false): Promise<void> {
  for (let i = 0; i < tasks.length; i++) {
    const taskNumber = tasks[i];
  
    console.log(`Task ${i + 1}/${tasks.length} running`);
    await writeResults(taskNumber, includeMaxDistance, includeStd);
    console.log(`Task ${i + 1}/${tasks.length} completed`);
  }
}

async function writeResults(task: number, includeMaxDistance = false, includeStd = false): Promise<void> {
  const basePointsPath = getPath(`data/test${task}a.csv`);
  const transomedPointsPath = getPath(`data/test${task}b.csv`);
  const basePoints: Point[] = await readCsvPoints(basePointsPath);
  const transomedPoints: Point[] = await readCsvPoints(transomedPointsPath);

  const noneOptions: Partial<Options> = {
    verbose: true, filterOutliers: {
      strategy: OutliersFilteringStrategy.none
    }
  };

  await writeResult(basePoints, transomedPoints, noneOptions, 'results/none', task);

  if (includeMaxDistance) {
    const maxDistanceOptions: Partial<Options> = {
      verbose: true, filterOutliers: {
        strategy: OutliersFilteringStrategy.maxDistance
      }
    };

    await writeResult(basePoints, transomedPoints, maxDistanceOptions, 'results/max-distance', task);
  }

  if (includeStd) {
    const stdOptions: Partial<Options> = {
      verbose: true, filterOutliers: {
        strategy: OutliersFilteringStrategy.std
      }
    }

    await writeResult(basePoints, transomedPoints, stdOptions, 'results/std', task);
  }
}

async function writeResult(
  basePoints: Point[], transomedPoints: Point[],
  options: Partial<Options>, dir: string, task: number): Promise<void> {
  const res = icp(basePoints, transomedPoints, options);

  await saveCsvPoints(res.sourceTransformed, getPath(`${dir}/test${task}.csv`));
  await saveResults(res, options, getPath(`${dir}/results${task}.json`));
}

function getPath(relativePath: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, relativePath);
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