# Iterative Closest Point (ICP) for 2D Points Library

A simple TypeScript library for performing the [Iterative Closest Point](https://en.wikipedia.org/wiki/Iterative_closest_point) (ICP) algorithm on 2D point clouds, with zero dependencies. This library works both in the browser and in Node.js and is compatible with JavaScript and TypeScript. This library uses [KDTree](https://en.wikipedia.org/wiki/K-d_tree) structure to perform faster nearest neighbors search.

## Table of Contents

- [Iterative Closest Point (ICP) for 2D Points Library](#iterative-closest-point-icp-for-2d-points-library)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Output](#output)
    - [Available options](#available-options)
      - [Improving Results by Filtering Noise](#improving-results-by-filtering-noise)
  - [Examples](#examples)
  - [Ideas](#ideas)

## Installation

```bash
npm install icp2d
```

## Usage
To use the ICP algorithm for aligning 2D point clouds, you can call the icp function, which calculates the transformation between two sets of 2D points (`source` and `target`).

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
const res = icp(source, target);
console.log(res.sourceTransformed);
console.log(res.translation);
console.log(res.rotationMatrix)
```

###  Output 
The output includes the rotation matrix (`R`), translation vector (`t`), transformed points, and the rotation in degrees. Example:

```typescript
import { Result } from 'icp2d';

const res: Result = {
  sourceTransformed: Point[]; // Transformed points
  translation: Point; // t - Translation vector
  rotation: number; // Rotation in degrees
  rotationMatrix: Matrix2x2; // R - Rotation matrix
  err: number; // Error calculated using RMS
};
``` 

###  Available options
```typescript
import { Options } from 'icp2d';

const options: Options = {
  tolerance: 10e6, // Convergence tolerance
  maxIterations: 500, // Maximum number of iterations
  verbose: true, // Outputs additional logs
  filterOutliers: {
    strategy: 'none' | 'maxDistance' | 'std' | 'trim'; // Strategy options for detecting outliers
    maxDistance: 500; // Optional, used for the max distance strategy
    threshold: 2; // Optional, used for the standard deviation strategy
  }
};
``` 

#### Improving Results by Filtering Noise
Filtering noise can significantly enhance the accuracy of the ICP algorithm. You can see its effects in different examples in [test.ipynb](./tests/test.ipynb). Here are different strategies to filter noise:

- **Max Distance Strategy**: Removes points that are further than a defined maximum distance from their closest neighbor in the target set.

```typescript
const options = {
  filterOutliers: {
    strategy: 'maxDistance',
    maxDistance: 500
  }
};
```

- **Standard Deviation Strategy**: Excludes points that deviate too much from the mean error using a threshold based on standard deviation.

```typescript
const options = {
  filterOutliers: {
    strategy: 'std',
    stdThreshold: 2
  }
};
```

- **Trim Strategy**: Uses a percentage-based trimming approach, where a fixed percentage of points with the highest errors are removed in each iteration. This is useful when there are scattered outliers rather than a clear separation by distance or deviation.

```typescript
const options = {
  filterOutliers: {
    strategy: 'trim',
    trimPercent: 5
  }
};
```

- **None**: Retains all points, without filtering.

```typescript
const options = {
  filterOutliers: {
    strategy: 'none'
  }
};
```

Using these strategies helps to remove outliers that can distort transformation calculations, leading to more stable and accurate results.


## Examples
You can find real-world test cases in [test.ipynb](./tests/test.ipynb). [verify-transforms.ipynb](./tests/verify-transforms.ipynb) verifies that the computed transformations are correct.

## Ideas
- Add DBSCAN for identifying outliers.