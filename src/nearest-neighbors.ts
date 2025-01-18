import { Point } from './models';

class TreeNode {

  public point: Point;
  public left: TreeNode | undefined;
  public right: TreeNode | undefined;

  constructor(point: Point, left?: TreeNode, right? : TreeNode) {
    this.point = point;
    this.left = left;
    this.right = right;
  }
};

function euclideanDistance(a: Point, b: Point): number {
  const [x1, y1] = a;
  const [x2, y2] = b
  
  return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2))
}

function closest(a: TreeNode | undefined, b: TreeNode | undefined, targetPoint: Point): TreeNode {
  if (!a) {
    return b as TreeNode;
  }
  if (!b) {
    return a as TreeNode;
  }
  
  const aDistance = euclideanDistance(a.point, targetPoint)
  const bDistance = euclideanDistance(b.point, targetPoint)

  return aDistance < bDistance ? a : b;
}

function buildKdtree(points: Point[], isXDimension=true) {
  const sortedPoints: Point[] = points.slice().sort((a, b) => {
    if (isXDimension) {
      return a[0] - b[0];
    } else {
      return a[1] - b[1];
    }
  });

  const medianIndex: number = Math.ceil(sortedPoints.length / 2) - 1
  const median: Point = sortedPoints[medianIndex];
  const kdtree: TreeNode = new TreeNode(median);
  const leftPoints: Point[] = sortedPoints.slice(0, medianIndex);
  const rightPoints: Point[] = sortedPoints.slice(medianIndex + 1);

  if (leftPoints.length) {
    kdtree.left = buildKdtree(leftPoints, !isXDimension);
  }

  if (rightPoints.length) {
    kdtree.right = buildKdtree(rightPoints, !isXDimension);
  }

  return kdtree;
}

function nearestNeighbor(root: TreeNode | undefined, targetPoint: Point, depth: number = 0): {
  best: TreeNode,
  bestDistance: number
} | undefined {
  if (!root) {
    return;
  }

  const targetK: number = depth % 2 === 0 ? targetPoint[0] : targetPoint[1];
  const rootK: number = depth % 2 === 0 ? root.point[0] : root.point[1];

  let nextBranch: TreeNode | undefined;
  let otherBranch: TreeNode | undefined;

  if (targetK < rootK) {
    nextBranch = root.left
    otherBranch = root.right
  } else {
    nextBranch = root.right
    otherBranch = root.left
  }
  
  const nextBranchBest = nearestNeighbor(nextBranch, targetPoint, depth + 1);
  let best: TreeNode| undefined = closest(root, nextBranchBest?.best, targetPoint);
  let bestDistance: number = euclideanDistance(best?.point, targetPoint);

  const dist = targetK - rootK;

  if (bestDistance > dist) {
    const otherBranchRes = nearestNeighbor(otherBranch, targetPoint, depth + 1);
    if (otherBranchRes) {
      best = closest(otherBranchRes.best, best, targetPoint);
    }
  }
  bestDistance = euclideanDistance(best.point, targetPoint)

  return { best, bestDistance };
}

export function nearestNeighbors(target: Point[], source: Point[]): {
  res: Point[], resDistance: number[]
} {
  const targetKdtree = buildKdtree(target);

  const res: Point[] = [];
  const resDistance: number[] = [];
  source.forEach((point: Point) => {
    const {best, bestDistance} = nearestNeighbor(targetKdtree, point)!;
    res.push(best.point)
    resDistance.push(bestDistance);
  });

  return { res, resDistance };
}