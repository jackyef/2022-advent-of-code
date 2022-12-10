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

let totalVisibleTrees =
  width + height - 1 + width - 1 + height - 2;

for (let y = 1; y < height - 1; y += 1) {
  for (let x = 1; x < width - 1; x += 1) {
    const treeHeight = grid[x][y];
    let currentTreeX = x;
    let currentTreeY = y;
    let checkedTree: string;
    let confirmedIsNotVisibleFromThisSide = false;
    
    const resetCurrentTree = () => {
      currentTreeX = x;
      currentTreeY = y;
      confirmedIsNotVisibleFromThisSide = false;
    }

    const getNextCheckedTree = (direction: 'top' | 'bottom' | 'left' | 'right') => {
      if (direction === 'top') {
        currentTreeY -= 1
      } else if (direction === 'bottom') {
        currentTreeY += 1
      } else if (direction === 'left') {
        currentTreeX -= 1
      } else if (direction === 'right') {
        currentTreeX += 1
      }

      return grid?.[currentTreeX]?.[currentTreeY];
    }

    const directions = ['top', 'right', 'bottom', 'left'] as const

    for (let i = 0; i < directions.length; i += 1) {
      const direction = directions[i];

      resetCurrentTree();
      checkedTree = getNextCheckedTree(direction)
  
      while (checkedTree) {
        if (checkedTree < treeHeight) {
          checkedTree = getNextCheckedTree(direction)
          continue;
        } else {
          confirmedIsNotVisibleFromThisSide = true;
          break;
        }
      }

      if (!confirmedIsNotVisibleFromThisSide) {
        totalVisibleTrees += 1;
        break;
      }
    }
  }
}

console.log({ totalVisibleTrees });
