import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const [stackState, procedureText] = inputText.split("\n\n");

let [, ...reversedStackStateLines] = stackState
  .split("\n")
  .reverse();
const maxStackHeight = reversedStackStateLines.length;
const numberOfStacks = 9;

const stacks: Record<number, string[]> = {};

// initialize stacks
Array.from({ length: numberOfStacks }).forEach((_, index) => {
  stacks[index + 1] = [];
});

reversedStackStateLines = reversedStackStateLines.map((v) =>
  v.replace(/    /g, "[ ] ")
);

reversedStackStateLines = reversedStackStateLines.map((v) =>
  v.replace(/\]\[ \]  /g, "] [ ] ")
);

reversedStackStateLines.forEach((line) => {
  const trimmedLine = line.substring(1, line.length - 1);
  const crates = trimmedLine.split("] [");

  crates.forEach((crate, index) => {
    if (crate !== " ") {
      stacks[index + 1].push(crate);
    }
  });
});

const moveCrate = (
  amount: number,
  from: number,
  to: number
) => {
  for (let i = 0; i < amount; i++) {
    stacks[to].push(stacks[from].pop() as string);
  }
};

const procedures = procedureText.split('\n')
procedures.forEach((procedure) => {
  // move 3 from 6 to 2
  const [, amount, from, to] = procedure.match(
    /move (\d+) from (\d+) to (\d+)/
  ) as RegExpMatchArray;

  moveCrate(Number(amount), Number(from), Number(to));
});

let output = ''

for (let i = 1; i <= numberOfStacks; i += 1) {
  const stack = stacks[i]
  const topCrate = stacks[i][stack.length - 1]
  output += topCrate
}

console.log({ output })
