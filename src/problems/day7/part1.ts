import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const lines = inputText.split("\n");
const directories: Record<string, any> = {};
let currentDir = "/";
let isListingDirectoryContent = false;

type SupportedCommand = "cd" | "ls";

const getFullPath = (currentDir: string, path: string) => {
  return currentDir === "/"
          ? `/${path}`
          : `${currentDir}/${path}`;
}
const executeCommand = (
  command: SupportedCommand,
  argument: string
) => {
  if (command === "cd") {
    if (argument.startsWith("/")) {
      currentDir = argument;
    } else if (argument === "..") {
      const parts = currentDir.split("/");
      parts.pop();
      currentDir = parts.join("/");
    } else {
      currentDir = getFullPath(currentDir, argument);
    }
  }

  if (command === "ls") {
    isListingDirectoryContent = true;
  }
};

const updateDirectory = (
  fullPath: string,
  size?: number
) => {
  let currentDir = directories;
  const parts = fullPath.split("/").filter(Boolean);

  while (parts.length > 0) {
    const key = parts.shift() as string;
    const isLeaf = parts.length === 0;

    if (!currentDir[key]) {
      currentDir[key] = isLeaf && size ? size : {};
    }

    currentDir = currentDir[key];
  }

  return currentDir;
};

lines.forEach((line) => {
  if (line.startsWith("$ ")) {
    isListingDirectoryContent = false;
    const fullCommand = line.substring(2);
    const [command, argument] = fullCommand.split(" ");

    executeCommand(command as SupportedCommand, argument);
  } else if (isListingDirectoryContent) {
    const [typeOrSize, name] = line.split(" ");
    const fullPath = getFullPath(currentDir, name);

    if (typeOrSize === "dir") {
      // it's a directory, add it to our directories object
      updateDirectory(fullPath);
    } else {
      // it's a file, add the size to our directories
      updateDirectory(fullPath, Number(typeOrSize));
    }
  } else {
    // unknown behavior
  }
});

type WalkCallback = (
  fullPath: string,
  size: number,
  directory?: Record<string, any>
) => void;

const walk = (
  directory: Record<string, any>,
  callback: WalkCallback,
  currentDir: string
) => {
  Object.keys(directory).forEach(key => {
    const fullPath = getFullPath(currentDir, key)
    const isDirectory = typeof directory[key] === 'object'
    callback(fullPath, isDirectory ? 0 : directory[key], directory[key])

    if (isDirectory) {
      walk(directory[key], callback, fullPath)
    }
  })
};

let sum = 0

walk(directories, (fullPath, size, directory) => {
  if (directory) {
    let directorySize = 0;
    
    walk(directory, (_, size) => {
      directorySize += size
    }, fullPath)

    if (directorySize <= 100000) {
      sum += directorySize
    }
  }
}, '/')

console.log({ sum });
