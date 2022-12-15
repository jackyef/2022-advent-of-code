import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const width = inputText.split("\n")[0].length;
const height = inputText.split("\n").length;
const grid = new Array(width)
  .fill(0)
  .map(() => new Array(height).fill(0));
const startingPosition: [number, number] = [0, 0];
const destination: [number, number] = [0, 0];

inputText.split("\n").forEach((rows, y) => {
  rows.split("").forEach((c, x) => {
    grid[x][y] = c;

    if (c === "S") {
      startingPosition[0] = x;
      startingPosition[1] = y;
    }

    if (c === "E") {
      destination[0] = x;
      destination[1] = y;
    }
  });
});

const getElevation = (char: string) => {
  if (char === "S") return 0;
  if (char === "E") return 25;

  return char.charCodeAt(0) - 97;
};

const getNeighbors = (
  x: number,
  y: number
): [number, number][] => {
  return [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ]
    .map(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newX < width &&
        newY >= 0 &&
        newY < height &&
        getElevation(grid[newX][newY]) <=
          getElevation(grid[x][y]) + 1
      ) {
        return [newX, newY] as [number, number];
      } else {
        return null;
      }
    })
    .filter(Boolean) as [number, number][];
};

const visited = new Array(width)
  .fill(false)
  .map(() => new Array(height).fill(false));

type PositionInfo = {
  stepsTaken: number;
  position: [number, number];
};

const priorityQueue: PositionInfo[] = [
  { stepsTaken: 0, position: startingPosition },
];

const sortPriorityQueue = (pq: PositionInfo[]) => {
  // Popping out of a priority queue with minheap implementation
  // will always return the element of the smallest value
  // We are just kinda replicating it here with a sort
  // since pop in JS arrays doesn't work that way
  return pq.sort((a, b) => {
    return b.stepsTaken - a.stepsTaken;
  });
}

// Dijkstra's algorithm
// Basically:
// - We want for every possible paths from a starting point
// - For each point, we'll keep track of the stepsTaken so far up to that point,
//   and then continue looking to its neighbors.
// - Points that we want to visit should be pushed into a priority queue
//   that is sorted by the stepsTaken.
//   Meaning, popping out of the queue should return the point with the least stepsTaken
// - If we find a point that has already been visited, we'll skip it because
//   that means a shorter path has already reached that point first. So there's no need
//   to continue from the current path we're checking
// - Once we reach the destination for the first time, we can be sure that's the shortest path
//   to reach that destination 
while (true) {
  const positionToCheck = priorityQueue.pop();

  if (!positionToCheck) throw new Error("Nothing to check");

  const { stepsTaken, position } = positionToCheck;
  const [x, y] = position;

  if (visited[x][y]) {
    continue;
  }

  visited[x][y] = true;

  if (x === destination[0] && y === destination[1]) {
    console.log("stepsTaken is", stepsTaken);
    break;
  }

  const neighbors = getNeighbors(x, y);
  priorityQueue.push(
    ...neighbors.map(([x, y]) => ({
      stepsTaken: stepsTaken + 1,
      position: [x, y] as [number, number],
    }))
  );

  sortPriorityQueue(priorityQueue)
}
