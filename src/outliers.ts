import { FilterOutliersOptions } from './models';
import { getMean } from './utils';

export function getOutliersIndices(opts: FilterOutliersOptions, matchedDistance: number[]): number[] {
  if (opts.strategy === 'maxDistance') {
    return getOutliersMaxDistance(opts.maxDistance!, matchedDistance);
  };
  if (opts.strategy === 'std') {
    return getOutliersSTD(opts.threshold!, matchedDistance);
  }

  if (opts.strategy === 'trim') {
    return getOutliersTrim(opts.trimPercent!, matchedDistance);
  }
  return [];
}

function calculateStandardDeviation(arr: number[]): number {
  const n = arr.length;
  const mean = arr.reduce((acc, val) => acc + val, 0) / n;
  const squaredDifferences = arr.map(val => Math.pow(val - mean, 2));
  const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / n;
  return Math.sqrt(variance);
}

function getOutliersSTD(threshold: number, distances: number[]): number[] {
  const deviation = calculateStandardDeviation(distances);
  const mean = getMean(distances);

  const predicate = (v: number) => v > (mean + threshold * deviation);
  return getOutliers(predicate, distances);
}

function getOutliersMaxDistance(maxDistance: number, distances: number[]): number[] {
  const predicate = (v: number) => v > maxDistance;
  return getOutliers(predicate, distances);
}


function getOutliersTrim(trimPercent: number, distances: number[]): number[] {
  const sortedDist = distances.slice().sort((a, b) => b - a);
  const numberToRemove = Math.floor(sortedDist.length * (trimPercent / 100));
  const threshold = sortedDist[numberToRemove];

  return getOutliers((v) => {
    return v > threshold;
  }, distances);
}


function getOutliers(predicate: (v: number) => boolean, distances: number[]): number[] {
  return distances.reduce((acc: number[], next: number, i: number) => {
    if (predicate(next)) {
      acc.push(i);
    }
    return acc;
  }, []);
}