import { FilterNoiseOptions, Point } from './models';
import { euclideanDistance } from './utils';

export function filterNoise(opts: FilterNoiseOptions, points: Point[]): Point[] {
  if (opts.strategy === 'dbscan') {
    return filterWithDBSCAN(points, opts.dbscanEpsilon!, opts.dbscanMinPoints!);
  }
  return points;
}

function filterWithDBSCAN(points: Point[], eps: number, minPoints: number): Point[] {
  const dbscan = new DBSCAN(eps, minPoints);
  const res = dbscan.fit(points);
  return res.clusters.flat();
}


class DBSCAN {

  private epsilon: number;
  private minPoints: number;
  private visited: Set<Point> = new Set();
  private clusters: Point[][] = [];
  private noise: Point[] = [];

  constructor(epsilon: number, minPoints: number) {
    this.epsilon = epsilon;
    this.minPoints = minPoints;
  }

  public fit(points: Point[]): { clusters: Point[][], noise: Point[] } {
    for (let point of points) {
      if (this.visited.has(point)) continue;

      let cluster: Point[] = [];
      if (this.expandCluster(points, point, cluster)) {
        this.clusters.push(cluster);
      }
    }

    return { clusters: this.clusters, noise: this.noise }
  }

  private findNeighbors(points: Point[], point: Point) {
    return points.filter(p => euclideanDistance(p, point) <= this.epsilon);
  }

  private expandCluster(points: Point[], point: Point, cluster: Point[]): boolean {
    let neighbors: Point[] = this.findNeighbors(points, point);

    if (neighbors.length < this.minPoints) {
      this.noise.push(point);
      return false;
    }

    cluster.push(point);
    this.visited.add(point);

    let queue = [...neighbors];

    while (queue.length) {
      let current: Point = queue.pop()!;
      if (!this.visited.has(current)) {
        this.visited.add(current);
        let currentNeighbors = this.findNeighbors(points, current);

        if (currentNeighbors.length >= this.minPoints) {
          queue.push(...currentNeighbors);
        }
      }

      if (!cluster.includes(current)) {
        cluster.push(current);
      }
    }

    return true;
  }
}