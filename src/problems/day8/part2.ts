import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const grid = inputText
  .split("\n")
  .map((line) => line.split(""));
const width = grid[0].length;
const height = grid.length;

let maxScenicScore = 0;

const directions = [
  "top",
  "right",
  "bottom",
  "left",
] as const;
type Direction = typeof directions[number];

for (let y = 1; y < height - 1; y += 1) {
  for (let x = 1; x < width - 1; x += 1) {
    const treeHeight = grid[x][y];
    let currentTreeX = x;
    let currentTreeY = y;
    let checkedTree: string;

    const resetCurrentTree = () => {
      currentTreeX = x;
      currentTreeY = y;
    };

    const getNextCheckedTree = (direction: Direction) => {
      if (direction === "top") {
        currentTreeY -= 1;
      } else if (direction === "bottom") {
        currentTreeY += 1;
      } else if (direction === "left") {
        currentTreeX -= 1;
      } else if (direction === "right") {
        currentTreeX += 1;
      }

      return grid?.[currentTreeX]?.[currentTreeY];
    };

    const treeInDirections: Record<Direction, number> = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };

    for (let i = 0; i < directions.length; i += 1) {
      const direction = directions[i];

      resetCurrentTree();
      checkedTree = getNextCheckedTree(direction);

      while (checkedTree) {
        treeInDirections[direction] += 1;

        if (checkedTree < treeHeight) {
          checkedTree = getNextCheckedTree(direction);
          continue;
        } else {
          break;
        }
      }
    }

    const scenicScore = Object.keys(
      treeInDirections
    ).reduce((acc, direction) => {
      return acc * Number(treeInDirections[direction as Direction]); 
    }, 1);

    if (scenicScore > maxScenicScore) {
      maxScenicScore = scenicScore;
    }
  }
}

console.log({ maxScenicScore });
