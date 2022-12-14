import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const commands = inputText.split("\n");

type SupportedCommand = 'noop' | `addx ${number}`

let cycleCount = 0;
let x = 1;
let output = '';

const isSpriteTouchingSpot = (cycleCount: number) => {
  const moddedCycle = cycleCount % 40
  return moddedCycle === x || moddedCycle === x + 1 || moddedCycle === x - 1
}

const checkIfNeedToDrawPixel = () => {
  if (cycleCount % 40 === 0) {
    output += '\n'
  }

  if (isSpriteTouchingSpot(cycleCount)) {
    output += '#';
  } else {
    output += '.';
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
    checkIfNeedToDrawPixel();
    cycleCount += 1;
    x += Number(V);
  }
}

commands.forEach(command => {
  checkIfNeedToDrawPixel();
  executeCommand(command as SupportedCommand);
})

// Run this, and look at the formed capital letters
console.log(output)