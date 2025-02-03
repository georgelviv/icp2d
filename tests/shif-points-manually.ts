import { addTranslation, Point } from '../src';
import { getPath, readCsvPoints, saveCsvPoints } from './utils';

init([1, 2, 3, 4, 5, 6, 7, 8]);

async function init(tasks: number[]): Promise<void> {
  for (let task of tasks) {
    const pointsPath  = getPath(`data/test${task}a.csv`);
    const transformedPath = getPath(`data/test${task}shifted.csv`);
    const points: Point[] = await readCsvPoints(pointsPath);

    const shiftedPoints: Point[] = addTranslation(points, [15, 0])  as Point[];
    await saveCsvPoints(shiftedPoints, transformedPath);
  }
}