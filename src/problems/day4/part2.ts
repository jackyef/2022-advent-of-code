import fs from "fs";
import path from "path";

const inputText = fs.readFileSync(
  path.join(__dirname, "./input.txt"),
  "utf-8"
);

const pairs = inputText.split("\n");
let totalPartiallyOverlappingAssignmentCount = 0;

pairs.forEach((pair) => {
  const [firstRange, secondRange] = pair.split(",");
  const [firstStart, firstEnd] = firstRange
    .split("-")
    .map(Number);
  const [secondStart, secondEnd] = secondRange
    .split("-")
    .map(Number);

  const firstRangeStartsEarlier = firstStart <= secondStart;
  const firstRangeEndsLater = firstEnd >= secondEnd;
  const secondRangeStartsEarlier =
    secondStart <= firstStart;
  const secondRangeEndsLater = secondEnd >= firstEnd;

  const firstRangeCoverage = firstEnd - firstStart;
  const secondRangeCoverage = secondEnd - secondStart;
  const startingPointDifference = Math.abs(
    firstStart - secondStart
  );

  const isFullyOverlapping = (() => {
    if (firstRangeStartsEarlier && firstRangeEndsLater) {
      return (
        firstRangeCoverage >=
        startingPointDifference + secondRangeCoverage
      );
    }

    if (secondRangeStartsEarlier && secondRangeEndsLater) {
      return (
        secondRangeCoverage >=
        startingPointDifference + firstRangeCoverage
      );
    }

    return false;
  })();

  const isPartiallyOverlapping = (() => {
    // 5-10, 7-12
    if (firstRangeStartsEarlier && firstEnd >= secondStart) {
      return true
    }
    
    // 7-12, 5-10
    if (secondRangeStartsEarlier && secondEnd >= firstStart) {
      return true
    }

    return false;
  })();

  // console.log({
  //   firstRange,
  //   secondRange,
  //   firstRangeCoverage,
  //   secondRangeCoverage,
  //   startingPointDifference,
  //   firstRangeStartsEarlier,
  //   firstRangeEndsLater,
  //   isPartiallyOverlapping,
  //   isFullyOverlapping
  // });

  // process.exit(0);

  if (isFullyOverlapping || isPartiallyOverlapping) {
    totalPartiallyOverlappingAssignmentCount += 1;
  }
});

console.log({ totalPartiallyOverlappingAssignmentCount });
