import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const commands = inputText.split("\n");

type SupportedCommand = 'noop' | `addx ${number}`

let cycleCount = 1;
let x = 1;
let sum = 0;
const interestingSignalCycles = [20, 60, 100, 140, 180, 220]

const checkIfNeedToCollectX = () => {
  if (interestingSignalCycles.includes(cycleCount)) {
    sum += cycleCount * x;
  }
}
const executeCommand = (command: SupportedCommand) => {
  if (command === 'noop') {
    cycleCount += 1;
    return;
  }

  if (command.startsWith('addx')) {
    const [_, V] = command.split(' ');
    
    cycleCount += 1;
    checkIfNeedToCollectX();
    cycleCount += 1;
    x += Number(V);
  }
}

commands.forEach(command => {
  executeCommand(command as SupportedCommand);
  checkIfNeedToCollectX();
})

console.log({ sum })