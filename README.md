# Iterative Closest Point (ICP) for 2D Points Library

A simple TypeScript library for performing Iterative Closest Point (ICP) algorithm on 2D point clouds with zero dependencies. This library works both in the browser and in Node.js, and is compatible with both JavaScript and TypeScript.

## Installation

```bash
npm install icp2d
```

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
const res = icp(sourceCartesian, targetCartesian);
console.log(res.sourceTransformed);
console.log(res.translation);
console.log(res.rotationMatrix)
```

###  Output 
Output has `R` rotation matrix, `t` - translation vector, transformed points, and rotation in degrees. Output 
```typescript
import { Result } from 'icp2d';

const res: Result =  {
  sourceTransformed: Point[]; // transformed points
  translation: Point; // t - translation vector
  rotation: number; // rotation in degrees
  rotationMatrix: Matrix2d; // R - rotation matrix
}
``` 

###  Available options
```typescript
import { Result } from 'icp2d';

const options: Options =  Options {
  tolerance: 10e6, // Convergence tolerance
  maxIterations: 500, // Maximum number of iterations
  verbose: true // Outputs some additional logs
  maxDistance: 1000 // Filter noise by distance in nearest neighbors
}
``` 

## Examples
You can find results performed on real cases at [test.ipynb](./tests/test.ipynb)



### Ideas
- Limit far points