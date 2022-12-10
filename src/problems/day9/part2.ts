import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

type Direction = "D" | "U" | "L" | "R";
type Position = `${number},${number}`;
const nonHKnots = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
type Knot = "H" | typeof nonHKnots[number];

// Assume all knots start at 0, 0
const knotPositions: Record<Knot, Position> = {
  H: "0,0",
  "1": "0,0",
  "2": "0,0",
  "3": "0,0",
  "4": "0,0",
  "5": "0,0",
  "6": "0,0",
  "7": "0,0",
  "8": "0,0",
  "9": "0,0",
};

let visitedBy9: Record<Position, boolean> = {
  "0,0": true,
};

const moves = inputText.split("\n");

const moveKnot1Step = (
  knot: Knot,
  direction: Direction
) => {
  const positionToUse = knotPositions[knot];
  let [x, y] = positionToUse.split(",").map(Number);

  if (direction === "D") {
    y -= 1;
  } else if (direction === "U") {
    y += 1;
  } else if (direction === "R") {
    x += 1;
  } else {
    x -= 1;
  }

  const newPosition: Position = `${x},${y}`;

  knotPositions[knot] = newPosition;
};

const checkIfIsTouchingNextKnot = (
  knot: Exclude<Knot, "H">
) => {
  // In this case, we'd treat the knot as T
  // and the knot in front of it, as the H
  const knotToCheckAgainst =
    knot === "1" ? "H" : (String(Number(knot) - 1) as Knot);

  const [hX, hY] = knotPositions[knotToCheckAgainst]
    .split(",")
    .map(Number);
  const [tX, tY] = knotPositions[knot]
    .split(",")
    .map(Number);

  if (hX === tX && hY === tY) {
    return true;
  }

  if (hX === tX && Math.abs(hY - tY) === 1) {
    return true;
  }

  if (hY === tY && Math.abs(hX - tX) === 1) {
    return true;
  }

  if (Math.abs(hX - tX) === 1 && Math.abs(hY - tY) === 1) {
    // H and T are diagonally touching
    return true;
  }

  return false;
};

const moveKnotToFollowNextKnot = (
  knot: Exclude<Knot, "H">
) => {
  const knotToCheckAgainst =
    knot === "1" ? "H" : (String(Number(knot) - 1) as Knot);

  const [hX, hY] = knotPositions[knotToCheckAgainst]
    .split(",")
    .map(Number);
  const [tX, tY] = knotPositions[knot]
    .split(",")
    .map(Number);

  if (hX === tX) {
    if (hY > tY) {
      moveKnot1Step(knot, "U");
    } else {
      moveKnot1Step(knot, "D");
    }
  } else if (hY === tY) {
    if (hX > tX) {
      moveKnot1Step(knot, "R");
    } else {
      moveKnot1Step(knot, "L");
    }
  } else {
    const xDifference = hX - tX;
    const yDifference = hY - tY;

    if (yDifference > 0) {
      moveKnot1Step(knot, "U");
    } else {
      moveKnot1Step(knot, "D");
    }

    if (xDifference > 0) {
      moveKnot1Step(knot, "R");
    } else {
      moveKnot1Step(knot, "L");
    }
  }

  if (knot === '9') {
    visitedBy9[knotPositions[knot]] = true;
  }
};

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

    nonHKnots.forEach(knot => {
      if (!checkIfIsTouchingNextKnot(knot)) {
        moveKnotToFollowNextKnot(knot);
      }
    });
  }
});

console.log(Object.keys(visitedBy9).length);
