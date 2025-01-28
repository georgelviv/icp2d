import { fileURLToPath } from 'url';
import { dirname, join } from 'node:path';
import { readCsvPoints, saveCsvPoints } from './utils';
import { icp } from '../src';

type Task = [input: string, target: string, output: string];

const tests: Task[] = [
  ['test1a', 'test1b', 'test1'],
  ['test2a', 'test2b', 'test2'],
  ['test3a', 'test3b', 'test3'],
  ['test4a', 'test4b', 'test4'],
  ['test5a', 'test5b', 'test5'],
  ['test6a', 'test6b', 'test6']
];

init(tests);

async function init(tasks: Task[]): Promise<void> {
  for (let i = 0; i < tasks.length; i++) {
    const [input, target, output] = tasks[i];
    console.log(`Task ${i + 1}/${tasks.length} running`);
    await writeResults(input, target, output);
    console.log(`Task ${i + 1}/${tasks.length} completed`);
  }
}

async function writeResults(inputPath: string, targetPath: string, output: string): Promise<void> {
  const basePointsPath = getPath(`data/${inputPath}.csv`);
  const transomedPointsPath = getPath(`data/${targetPath}.csv`);
  const basePoints = await readCsvPoints(basePointsPath);
  const transomedPoints = await readCsvPoints(transomedPointsPath);

  const { sourceTransformed } = icp(basePoints, transomedPoints, {verbose: true});

  saveCsvPoints(sourceTransformed, getPath(`results/${output}.csv`));
}


function getPath(relativePath: string): string {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return join(__dirname, relativePath);
}