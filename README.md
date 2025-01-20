# ICP 2D Points Library

A simple TypeScript library for performing Iterative Closest Point (ICP) algorithm on 2D point clouds. This library works both in the browser and in Node.js, and is compatible with both JavaScript and TypeScript. Verified with tests, results compared with [scikit-learn](https://scikit-learn.org/stable/)

## Usage
To use the ICP (Iterative Closest Point) algorithm for aligning 2D point clouds, you can call the icp function, which calculates the transformation between two sets of 2D points (`source` and `target`).

```typescript
import { icp, Point } from 'icp2d';

// Define your source and target point clouds (arrays of 2D Cartesian coordinates)
const source: Point[] = [
  [0, 0],
  [1, 0],
  [0, 1]
];

const target: Point[] = [
  [1, 1],
  [2, 1],
  [1, 2]
];

// Perform the ICP algorithm to align the source point cloud to the target
icp(sourceCartesian, targetCartesian);
```