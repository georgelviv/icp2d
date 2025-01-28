import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { readCsvPoints, saveCsvPoints } from './utils';
import { icp } from '../src';

async function writeResults(inputPath: string, targetPath: string, output: string): Promise<void> {
  const basePointsPath = getPath(`data/${inputPath}.csv`);
  const transomedPointsPath = getPath(`data/${targetPath}.csv`);
  const basePoints = await readCsvPoints(basePointsPath);
  const transomedPoints = await readCsvPoints(transomedPointsPath);

  const { sourceTransformed } = icp(basePoints, transomedPoints);

  saveCsvPoints(sourceTransformed, getPath(`results/${output}.csv`));
}

writeResults('test1a', 'test1b', 'test1');

function getPath(relativePath: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, relativePath);
}