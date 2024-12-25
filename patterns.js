function filledLine(times, char) {
  if (times < 1) {
    return "";
  }

  return char.repeat(times);
}

function encloseWith(char, string) {
  return char + string + char;
}

function reverse(array) {
  const reversedArray = [];

  for (const element of array) {
    reversedArray.unshift(element);
  }

  return reversedArray;
}

function isNegative(number) {
  return number < 0;
}

function getRange(from, to, step) {
  const numbers = [];

  for (let number = from; number < to; number += step) {
    numbers.push(number);
  }

  return numbers;
}

function range(from, to, step) {
  if (step === 0 || from > to) {
    return [];
  }

  const numbers = getRange(from, to, Math.abs(step));

  return isNegative(step) ? reverse(numbers) : numbers;
}

function hollowLine(width, char) {
  if (width < 1) {
    return "";
  }

  if (width === 1) {
    return char;
  }

  return encloseWith(char, filledLine(width - 2, " "));
}

function middlePartOfRectangle(width, height, styleType, chars) {
  const rectangle = [];

  for (const row of range(1, height - 1, 1)) {
    const charIndex = row % chars.length;
    rectangle.push(styleType(width, chars[charIndex]));
  }

  return rectangle;
}

function rectangle(width, height, styleType, chars) {
  if (height === 1) {
    return [filledLine(width, chars[0])];
  }

  const rectangleShape = middlePartOfRectangle(width, height, styleType, chars);
  const lastIndex = (height - 1) % chars.length;

  const top = filledLine(width, chars[0]);
  const bottom = filledLine(width, chars[lastIndex]);

  rectangleShape.unshift(top);
  rectangleShape.push(bottom);

  return rectangleShape;
}

const filledRectangle = function ([width, height]) {
  return rectangle(width, height, filledLine, ["*"]);
};

const hollowRectangle = function ([width, height]) {
  return rectangle(width, height, hollowLine, ["*"]);
};

const alternatingRectangle = function ([width, height]) {
  const characters = ["*", "-"];

  return rectangle(width, height, filledLine, characters);
};

const spacedAlternatingRectangle = function ([width, height]) {
  const characters = ["*", "-", " "];

  return rectangle(width, height, filledLine, characters);
};

function getTriangle(height, styleType, padLength) {
  const triangle = [];

  for (const width of range(1, height, 1)) {
    const line = styleType(width, "*");
    triangle.push(line.padStart(padLength));
  }

  triangle.push(filledLine(height, "*"));

  return triangle;
}

const triangle = function ([height]) {
  return getTriangle(height, filledLine, 0);
};

const rightAlignedTriangle = function ([height]) {
  return getTriangle(height, filledLine, height);
};

const hollowTriangle = function ([height]) {
  return getTriangle(height, hollowLine, 0);
};

const rightAlignedHollowTriangle = function ([height]) {
  return getTriangle(height, hollowLine, height);
};

function makeDiamond(height, char, getLineFunction) {
  const diamond = [];
  const middleLine = getLineFunction(height, char);
  diamond.push(middleLine);

  for (const width of reverse(range(1, height - 1, 2))) {
    const line = getLineFunction(width, char).padStart((height + width) / 2);
    diamond.push(line);
    diamond.unshift(line);
  }

  return diamond;
}

function nearestOdd(number) {
  return number + ((number & 1) - 1);
}

function diamond([height]) {
  return makeDiamond(nearestOdd(height), "*", filledLine);
}

function hollowDiamond([height]) {
  return makeDiamond(nearestOdd(height), "*", hollowLine);
}

function areDimensionsValid(dimensions) {
  for (const dimension of dimensions) {
    if (dimension < 1) {
      return false;
    }
  }
  return true;
}

function getPattern(style, dimensions) {
  const patterns = [
    ["filled-rectangle", filledRectangle],
    ["hollow-rectangle", hollowRectangle],
    ["alternating-rectangle", alternatingRectangle],
    ["spaced-alternating-rectangle", spacedAlternatingRectangle],
    ["triangle", triangle],
    ["right-aligned-triangle", rightAlignedTriangle],
    ["diamond", diamond],
    ["hollow-diamond", hollowDiamond],
  ];

  const [_, functionReference] = patterns.find(
    ([styleName]) => styleName === style
  );

  return functionReference(dimensions);
}

function removeAll(array, culprit) {
  const undroppedElements = [];

  for (const element of array) {
    if (element !== culprit) {
      undroppedElements.push(element);
    }
  }

  return undroppedElements;
}

function arrayCopy(array) {
  const copiedArray = [];

  for (const element of array) {
    copiedArray.push(element);
  }

  return copiedArray;
}

function combineTwoPatterns(pattern1, pattern2, width) {
  if (pattern1.length !== pattern2.length) {
    return [];
  }

  const combinedPattern = [];

  for (const index of range(0, pattern1.length, 1)) {
    const line1 = pattern1[index].padEnd(width + 1);
    const line2 = pattern2[index];

    combinedPattern.push(line1.concat(line2));
  }

  return combinedPattern;
}

function combinePatterns(patterns, width) {
  if (patterns.length === 0) {
    return [];
  }

  if (patterns.length === 1) {
    return patterns[0];
  }

  return combineTwoPatterns(patterns[0], patterns[1], width);
}

function generatePattern(style1, dimensions, style2) {
  if (!areDimensionsValid(dimensions)) {
    return "";
  }

  return getPattern(style1, dimensions).join("\n");

  // const patterns = [];
  // patterns.push(getPattern(style1, dimensions));
  // patterns.push(getPattern(style2, dimensions));

  // return combinePatterns(removeAll(patterns, undefined), dimensions[0]).join(
  //   "\n"
  // );
}

// ------------------ Testing Fragment ---------------------

const areEqual = function (element1, element2) {
  return element1 === element2;
};

const areArraysEqual = function (element1, element2) {
  if (!Array.isArray(element1)) {
    return areEqual(element1, element2);
  }

  if (!areEqual(element1.length, element2.length)) {
    return false;
  }

  for (const index in element1) {
    if (!areArraysEqual(element1[index], element2[index])) {
      return false;
    }
  }

  return true;
};

const getTestResult = function ([functionName, params, expected]) {
  const actual = functionName(...params);

  return [functionName, params, expected, actual];
};

const isTestFailed = function ([functionName, params, expected, actual]) {
  return !areArraysEqual(actual, expected);
};

const complement = function (functionRef) {
  return function (...args) {
    return !functionRef(...args);
  };
};

const isTestPassed = function (testResult) {
  return complement(isTestFailed)(testResult);
};

const displayTestResult = function (failed) {
  if (failed.length === 0) {
    console.log("All tests passed!");
    return;
  }

  console.table(failed);
};

const displayPassedTests = function (passed) {
  if (confirm("Do you want to see passed tests?")) {
    console.table(passed);
  }
};

const testExecuter = function (testCases) {
  const testResult = testCases.map(getTestResult);
  const failed = testResult.filter(isTestFailed);
  const passed = testResult.filter(isTestPassed);

  displayTestResult(failed);
  displayPassedTests(passed);
};

const add = function (a, b) {
  return a + b;
};

const testsForAdd = [
  [add, [5, 4], 9],
  [add, [5, 5], 10],
  [add, [4, 2], 5],
];

const testsForFilledRectangle = [
  [generatePattern, ["filled-rectangle", [1, 0]], ""],
  [generatePattern, ["filled-rectangle", [2, 0]], ""],
  [generatePattern, ["filled-rectangle", [3, 0]], ""],
  [generatePattern, ["filled-rectangle", [0, 1]], ""],
  [generatePattern, ["filled-rectangle", [0, 2]], ""],
  [generatePattern, ["filled-rectangle", [0, 3]], ""],
  [generatePattern, ["filled-rectangle", [0, 0]], ""],
  [generatePattern, ["filled-rectangle", [1, 1]], "*"],
  [generatePattern, ["filled-rectangle", [2, 1]], "**"],
  [generatePattern, ["filled-rectangle", [2, 2]], "**\n**"],
  [generatePattern, ["filled-rectangle", [3, 2]], "***\n***"],
  [generatePattern, ["filled-rectangle", [4, 3]], "****\n****\n****"],
];

testExecuter(testsForFilledRectangle);

// const testsForHollowRectangle = [
//   ["hollow-rectangle", [0, 0], ""],
//   ["hollow-rectangle", [1, 0], ""],
//   ["hollow-rectangle", [2, 0], ""],
//   ["hollow-rectangle", [3, 0], ""],
//   ["hollow-rectangle", [0, 1], ""],
//   ["hollow-rectangle", [0, 2], ""],
//   ["hollow-rectangle", [0, 3], ""],
//   ["hollow-rectangle", [1, 1], "*"],
//   ["hollow-rectangle", [1, 2], "*\n*"],
//   ["hollow-rectangle", [1, 3], "*\n*\n*"],
//   ["hollow-rectangle", [2, 1], "**"],
//   ["hollow-rectangle", [2, 2], "**\n**"],
//   ["hollow-rectangle", [2, 3], "**\n**\n**"],
//   ["hollow-rectangle", [4, 3], "****\n*  *\n****"]
// ];

// const testsForAlternatingRectangle = [
//   ["alternating-rectangle", [0, 0], ""],
//   ["alternating-rectangle", [1, 0], ""],
//   ["alternating-rectangle", [2, 0], ""],
//   ["alternating-rectangle", [3, 0], ""],
//   ["alternating-rectangle", [0, 1], ""],
//   ["alternating-rectangle", [0, 2], ""],
//   ["alternating-rectangle", [0, 3], ""],
//   ["alternating-rectangle", [1, 1], "*"],
//   ["alternating-rectangle", [1, 2], "*\n-"],
//   ["alternating-rectangle", [2, 3], "**\n--\n**"]
// ];

// const testsForTraingle = [
//   ["triangle", [0], ""],
//   ["triangle", [1], "*"],
//   ["triangle", [2], "*\n**"],
//   ["triangle", [3], "*\n**\n***"]
// ];

// const testsForRightAlignedTraingle = [
//   ["right-aligned-triangle", [0], ""],
//   ["right-aligned-triangle", [1], "*"],
//   ["right-aligned-triangle", [2], " *\n**"],
//   ["right-aligned-triangle", [3], "  *\n **\n***"]
// ];

// const testsForSpacedAlternatingRectangle = [
//   ["spaced-alternating-rectangle", [0, 0], ""],
//   ["spaced-alternating-rectangle", [0, 1], ""],
//   ["spaced-alternating-rectangle", [0, 2], ""],
//   ["spaced-alternating-rectangle", [1, 0], ""],
//   ["spaced-alternating-rectangle", [2, 0], ""],
//   ["spaced-alternating-rectangle", [1, 1], "*"],
//   ["spaced-alternating-rectangle", [3, 2], "***\n---"],
//   ["spaced-alternating-rectangle", [3, 3], "***\n---\n   "],
//   ["spaced-alternating-rectangle", [3, 4], "***\n---\n   \n***"]
// ];

// const testsForDiamond = [
//   ["diamond", [0], ""],
//   ["diamond", [1], "*"],
//   ["diamond", [2], "*"],
//   ["diamond", [3], " *\n***\n *"],
//   ["diamond", [4], " *\n***\n *"],
//   ["diamond", [5], "  *\n ***\n*****\n ***\n  *"]
// ];

// const testsForHollowDiamond = [
//   ["hollow-diamond", [0], "",],
//   ["hollow-diamond", [1], "*",],
//   ["hollow-diamond", [2], "*",],
//   ["hollow-diamond", [3], " *\n* *\n *",],
//   ["hollow-diamond", [4], " *\n* *\n *",],
//   ["hollow-diamond", [5], "  *\n * *\n*   *\n * *\n  *",]
// ];

// const testsForFilledAndHollowRectangle = [
//   ["filled-rectangle", [0, 0], "", , "hollow-rectangle"],
//   ["filled-rectangle", [0, 1], "", , "hollow-rectangle"],
//   ["filled-rectangle", [1, 0], "", , "hollow-rectangle"],
//   ["filled-rectangle", [1, 1], "* *", "hollow-rectangle"],
//   ["filled-rectangle", [5, 1], "***** *****", "hollow-rectangle"],
//   ["filled-rectangle", [1, 5], "* *\n* *\n* *\n* *\n* *", "hollow-rectangle"],
//   ["filled-rectangle", [2, 3], "** **\n** **\n** **", "hollow-rectangle"],
//   ["filled-rectangle", [3, 3], "*** ***\n*** * *\n*** ***", "hollow-rectangle"]
// ];

// const testsForHollowAndFilledRectangle = [
//   ["hollow-rectangle", [0, 0], "", "filled-rectangle"],
//   ["hollow-rectangle", [0, 1], "", "filled-rectangle"],
//   ["hollow-rectangle", [1, 0], "", "filled-rectangle"],
//   ["hollow-rectangle", [1, 1], "* *", "filled-rectangle"],
//   ["hollow-rectangle", [5, 1], "***** *****", , "filled-rectangle"],
//   ["hollow-rectangle", [1, 5], "* *\n* *\n* *\n* *\n* *", , "filled-rectangle"],
//   ["hollow-rectangle", [2, 3], "** **\n** **\n** **", , "filled-rectangle"],
//   ["hollow-rectangle", [3, 3], "*** ***\n*** * *\n*** ***", "filled-rectangle"]
// ];

// ["triangle", [0], "", , "right-aligned-triangle"],
//   ["triangle", [1], "* *", , "right-aligned-triangle"],
//   ["triangle", [2], "*   *\n** **", "right-aligned-triangle"],
//   ["triangle", [3], "*     *\n**   **\n*** ***", "right-aligned-triangle"],
//   ("triangle", [4], "*       *\n**     **\n***   ***\n**** ****", "right-aligned-triangle");

// function testsForTwoPatterns() {
//   testFillAndHollRec();
//   testsForTriangleAndRightAlignedTriangle();
// }

// function displayTestResult() {
//   if (.length === 0) {
//     console.log("All tests passed!");
//     return;
//   }

//   console.table();
// }

// function areEqual(array1, array2) {
//   if (array1.length !== array2.length) {
//     return false;
//   }

//   for (const index of range(0, array1.length, 1)) {
//     if (array1[index] !== array2[index]) {
//       return false;
//     }
//   }

//   return true;
// }

// function testRange(start, end, step, expected, ) {
//   const actual = range(start, end, step);
//   if (!areEqual(actual, expected)) {
//     .push([start, end, step, actual, expected]);
//   }
// }

// function testsForRange() {
//   const  = [];

//   testRange(0, 0, 0, [], );
//   testRange(0, 1, 0, [], );
//   testRange(1, 1, 1, [], );
//   testRange(0, 1, 1, [0], );
//   testRange(0, 2, 1, [0, 1], );
//   testRange(0, 2, 2, [0], );
//   testRange(0, 5, 2, [0, 2, 4], );
//   testRange(1, 5, 2, [1, 3], );
//   testRange(5, 5, 2, [], );

//   console.log("-------------- Range() -----------");
//   displayTestResult();;
// }

// function testFilledLine(width, char, expected) {
//   const actual = filledLine(width, char);
//   if (actual !== expected) {
//     .push([width, char, actual, expected]);
//   }
// }

// function testsForFilledLine() {
//   const  = [];

//   testFilledLine(-1, "*", "");
//   testFilledLine(0, "*", "");
//   testFilledLine(1, "*", "*");
//   testFilledLine(2, "*", "**");
//   testFilledLine(3, "*", "***");

//   console.log("--------------- filledLine() --------------");
//   displayTestResult();
// }

// function testNearestOdd(number, expected, ) {
//   const actual = nearestOdd(number);
//   if (actual !== expected) {
//     .push([number, actual, expected]);
//   }
// }

// function testsForNearestOdd() {
//   const  = [];

//   testNearestOdd(0, -1, );
//   testNearestOdd(1, 1, );
//   testNearestOdd(2, 1, );
//   testNearestOdd(3, 3, );
//   testNearestOdd(4, 3, );
//   testNearestOdd(5, 5, );

//   console.log("--------------- nearestOdd() --------------");
//   displayTestResult();
// }

// function testNearestMultiple(number, multiplicand, expected, ) {
//   const actual = nearestMultiple(number, multiplicand);
//   if (actual !== expected) {
//     .push([number, multiplicand, actual, expected]);
//   }
// }

// // function testsForNearestMultiple() {
// //   const  = [];

// //   testNearestMultiple(0, 0, 0, );
// //   testNearestMultiple(0, 1, 0, );
// //   testNearestMultiple(1, 1, 1, );
// //   testNearestMultiple(2, 1, 2, );
// //   testNearestMultiple(1, 2, 0, );
// //   testNearestMultiple(2, 2, 2, );
// //   testNearestMultiple(3, 2, 2, );
// //   testNearestMultiple(5, 10, 0, );
// //   testNearestMultiple(11, 10, 10, );

// //   console.log("--------------- nearestMultiple() --------------");
// //   displayTestResult();
// // }

// function testRemoveAll(array, culprit, expected, ) {
//   const actual = removeAll(array, culprit);
//   if (!areEqual(actual, expected)) {
//     .push([array, culprit, actual, expected]);
//   }
// }

// function testsForRemoveAll() {
//   const  = [];

//   testRemoveAll([], 0, [], );
//   testRemoveAll([1, 2], 0, [1, 2], );
//   testRemoveAll([1, 2], 1, [2], );
//   testRemoveAll([1, 2, 2, 1], 2, [1, 1], );

//   console.log("--------------- RemoveAll() --------------");
//   displayTestResult();
// }

// function testMinorFunctions() {
//   testsForRange();
//   testsForFilledLine();
//   testsForNearestOdd();
//   // testsForNearestMultiple();
//   testsForRemoveAll();
// }

// function testMainFunction() {
//   const  = [];

//   testsForFilledRectangle();
//   testsForHollowRectangle();
//   testsForAlternatingRectangle();
//   testsForTraingle();
//   testsForRightAlignedTraingle();
//   testsForSpacedAlternatingRectangle();
//   testsForDiamond();
//   testsForHollowDiamond();
//   testsForTwoPatterns();

//   console.log("------------- generatePattern() -----------");
//   displayTestResult();
// }

// function testAll() {
//   testMinorFunctions();
//   testMainFunction();
// }

// testAll();

// const allTests = [];

// [expected, functionName, ...params];

// const test = function (expected, , functionName, ...params) {
//   const actual = functionName(...params);
//   if (actual !== expected) {
//     .push([expected, actual, ...params]);
//   }
// }
