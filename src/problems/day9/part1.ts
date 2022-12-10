import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

type Direction = "D" | "U" | "L" | "R";
type Position = `${number},${number}`;

// Assume both H and T starts at 0, 0
let currentHPosition: Position = "0,0";
let currentTPosition: Position = "0,0";
let visitedByT: Record<Position, boolean> = {
  "0,0": true,
};

const moves = inputText.split("\n");

const moveKnot1Step = (
  knot: "H" | "T",
  direction: Direction
) => {
  const positionToUse =
    knot === "H" ? currentHPosition : currentTPosition;
  let [x, y] = positionToUse.split(",").map(Number);

  if (direction === "D") {
    y -= 1
  } else if (direction === 'U') {
    y += 1
  } else if (direction === 'R') {
    x += 1
  } else {
    x -= 1
  }

  const newPosition: Position = `${x},${y}`;

  if (knot === "H") {
    currentHPosition = newPosition;
  } else {
    currentTPosition = newPosition;
  }
};

const checkIfHTAreTouching = () => {
  const [hX, hY] = currentHPosition.split(",").map(Number);
  const [tX, tY] = currentTPosition.split(",").map(Number);

  if (hX === tX && hY === tY) {
    return true
  }

  if (hX === tX && Math.abs(hY - tY) === 1) {
    return true
  }

  if (hY === tY && Math.abs(hX - tX) === 1) {
    return true
  }
  
  if (Math.abs(hX - tX) === 1 && Math.abs(hY - tY) === 1) {
    // H and T are diagonally touching
    return true
  }

  return false
}

const moveTToFollowH = () => {
  const [hX, hY] = currentHPosition.split(",").map(Number);
  const [tX, tY] = currentTPosition.split(",").map(Number);
  if (hX === tX) {
    if (hY > tY) {
      moveKnot1Step("T", "U")
    } else {
      moveKnot1Step("T", "D")
    }
  } else if (hY === tY) {
    if (hX > tX) {
      moveKnot1Step("T", "R")
    } else {
      moveKnot1Step("T", "L")
    }
  } else {
    const xDifference = hX - tX;
    const yDifference = hY - tY;

    if (yDifference > 0) {
      moveKnot1Step("T", "U")
    } else {
      moveKnot1Step("T", "D")
    }

    if (xDifference > 0) {
      moveKnot1Step("T", "R")
    } else {
      moveKnot1Step("T", "L")
    }
  }

  visitedByT[currentTPosition] = true;
}

moves.forEach((move) => {
  const [direction, stepsString] = move.split(" ") as [
    Direction,
    string
  ];
  const steps = Number(stepsString);
  let numberOfStepTaken = 0;

  while (numberOfStepTaken < steps) {
    moveKnot1Step("H", direction);
    numberOfStepTaken += 1;

    if (!checkIfHTAreTouching()) {
      moveTToFollowH();
    }
  }
});

console.log(Object.keys(visitedByT).length)
