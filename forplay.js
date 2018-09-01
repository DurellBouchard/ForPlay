// TODO: add level select
// TODO: add progress??
// TODO: add star system
// TODO: add tutorial
// TODO: add story
// BUG: click on level select while it is animating will break it!!!
// BUG: inital y value error when there is an initial y value specified

/**
 * @fileoverview This file contains...
 */

/**
 * @namespace
 */
var loopgame = {};

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

loopgame.EQUAL_EPSILON = 0.0001;
// TODO: remove this variable, it also exists in state
loopgame.COOKIE_EXPIRATION_DAYS = 30;

//------------------------------------------------------------------------------
// Private Variables
//------------------------------------------------------------------------------

// loopgame.puzzles = [[{xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 8},
//                  par: 0},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, 3, 5, 7, 9, 11, 13, 15, 17],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 0},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [0, 2, 4, 6, 8, 10, 12, 14, 16],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 0},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [17, 15, 13, 11, 9, 7, 5, 3, 1],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 1}],
//                [{xValues: [0, 1, 2, 3, 4, 5, 6, 7],
//                  yValues: [1, 2, 3, 4, 5, 6, 7, 8],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 8},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, 3, 5, 7, 9, 11, 13, 15, 17],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 2},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7],
//                  yValues: [-1, -2, -3, -4, -5, -6, -7, -8],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: -8, end: 0},
//                  par: 3},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7],
//                  yValues: [15, 13, 11, 9, 7, 5, 3, 1],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 2},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [0, 1, 4, 9, 16, 25, 36, 49, 64],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 64},
//                  par: 1}],
//                [{xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 8},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, 3, 5, 7, 9, 11, 13, 15, 17],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7],
//                  yValues: [15, 13, 11, 9, 7, 5, 3, 1],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 16},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [2, 4, 8, 16, 32, 64, 128, 256, 512],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 512},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [-1, -2, -4, -8, -16, -32, -64, -128, -256],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: -256, end: 0},
//                  par: 2},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [256, 128, 64, 32, 16, 8, 4, 2, 1],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: 0, end: 256},
//                  par: 1},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [4, -4, 4, -4, 4, -4, 4, -4, 4],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: -4, end: 4},
//                  par: 2},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7],
//                  yValues: [-1, 2, -4, 8, -16, 32, -64, 128],
//                  xRange: {start:0, end: 8},
//                  yRange: {start: -128, end: 128},
//                  par: 3}],
//                [{xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, 2, 4, 7, 11, 16, 22, 29, 37],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 64},
//                  par: 2},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, -1, 2, 0, 3, 1, 4, 2, 5],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4},
//                  par: 3}],
//                [{xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  yValues: [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4},
//                  par: 0},
//                 {xValues: [4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5],
//                  yValues: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 8},
//                  par: 0},
//                 {xValues: [3, 3, 3, 3, 3, 3, 3, 3, 3],
//                  yValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 8}},
//                 {xValues: [0, 0, 1, 0, 1, 2, 0, 1, 2, 3, 0, 1, 2, 3, 4],
//                  yValues: [0, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4}},
//                 {xValues: [0, 1, 2, 3, 4, 0, 1, 2, 3, 0, 1, 2, 0, 1, 0],
//                  yValues: [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4}},
//                 {xValues: [0, 2, 4, 6, 8, 2, 4, 6, 8, 4, 6, 8, 6, 8, 8],
//                  yValues: [4, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 1, 1, 0],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4}},
//                 {xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 2, 3, 4, 5, 6, 3, 4, 5, 4],
//                  yValues: [4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 1, 1, 1, 0],
//                  xRange: {start: 0, end: 8},
//                  yRange: {start: 0, end: 4}}]];

// loopgame.currentPuzzle = undefined;
// loopgame.currentLevel = undefined;
// loopgame.scores = undefined;
// loopgame.answers = undefined;

// 9-(4-y)

//------------------------------------------------------------------------------
// Private Functions
//------------------------------------------------------------------------------

loopgame.getInputOperatorCount = function() {
  var operatorCount = 0;
  // var userInput = display.getInput(loopgame.currentLevel);
  var userInput = display.getInput(state.currentLevel);
  for (var i = 0; i < userInput.length; i++) {
    operatorCount += (userInput[i].match(/\+|-|\*|\//g) || []).length;
  }
  return operatorCount;
}

loopgame.getActual = function() {
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    var numberOfPoints = desired.yValues.length;
    // var userInput = display.getInput(loopgame.currentLevel);
    var userInput = display.getInput(state.currentLevel);
    // loopgame.answers[loopgame.currentLevel][loopgame.currentPuzzle] = userInput;
    state.answers[state.currentLevel][state.currentPuzzle] = userInput;
    // loopgame.writeCookie('loopGameAnswers', JSON.stringify(loopgame.answers));
    loopgame.writeCookie('loopGameAnswers', JSON.stringify(state.answers));
    // if (loopgame.currentLevel == 0) {
    if (state.currentLevel == 0) {
        return interp.evalLoop(userInput[0], userInput[1], userInput[2], 10);
    // } else if (loopgame.currentLevel == 1) {
    } else if (state.currentLevel == 1) {
        return interp.evalVariableLoop(userInput[0], 0, numberOfPoints, 1);
    // } else if (loopgame.currentLevel == 2) {
    } else if (state.currentLevel == 2) {
        return interp.evalAccumulatorLoop(userInput[0], userInput[1],
                                          numberOfPoints);
    // } else if (loopgame.currentLevel == 3) {
    } else if (state.currentLevel == 3) {
        return interp.evalVariableAccumulatorLoop(userInput[0], userInput[1],
                                                     0, 9, 1);
    // } else if (loopgame.currentLevel == 4) {
    } else if (state.currentLevel == 4) {
        return interp.evalNestedLoop(userInput[0], userInput[1], userInput[2],
                                     userInput[3], userInput[4], userInput[5],
                                     desired.yValues.length + 1);
    }
}

loopgame.isEqual = function(value1, value2) {
    return value1 < value2 + loopgame.EQUAL_EPSILON &&
        value1 > value2 - loopgame.EQUAL_EPSILON;
}

loopgame.isInDesired = function(x, y) {
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    var isIn = false;
    for (var i = 0; i < desired.xValues.length; i++) {
        if (loopgame.isEqual(desired.xValues[i], x) &&
            loopgame.isEqual(desired.yValues[i], y)) {
            isIn = true;
            break;
        }
    }
    return isIn;
}

loopgame.countNumberCorrect = function(xValues, yValues) {
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    var desiredLength = desired.yValues.length;
    if (yValues.length < desiredLength) {
        return 'too few ' + desiredLength;
    } else if (yValues.length > desiredLength) {
        return 'too many ' + desiredLength;
    }
    numberCorrect = 0;
    for (var i = 0; i < yValues.length; i++) {
        if (loopgame.isInDesired(xValues[i], yValues[i])) {
            numberCorrect += 1;
        }
    }
    return numberCorrect;
}

// TODO: remove this function, it is also defined in state
loopgame.writeCookie = function(cookieName, cookieValue) {
  var date = new Date();
  var cookieExpirationMS = loopgame.COOKIE_EXPIRATION_DAYS * 86400000;
  date.setTime(date.getTime() + cookieExpirationMS);
  var expirationString = date.toGMTString();
  document.cookie = cookieName + '=' + cookieValue +
                    '; expires=' + expirationString;
  // console.log(cookieName + '=' + cookieValue +
  //                   '; expires=' + expirationString);
}

loopgame.findNextPuzzleFrom = function(currentLevel, currentPuzzle) {
  console.log('findnextfrom');
  console.log(typeof currentLevel);
  while (currentLevel < state.puzzles.length) {
    console.log(typeof currentLevel);
    while (currentPuzzle < state.puzzles[currentLevel].length) {
      console.log(typeof currentLevel);
      if (state.scores[currentLevel][currentPuzzle] == -1) {
        console.log(typeof currentLevel);
        return {level: currentLevel, puzzle: currentPuzzle};
      }
      currentPuzzle++;
    }
    currentLevel++;
    currentPuzzle = 0;
  }
  return undefined;
}

loopgame.findNextPuzzle = function() {
  var next = loopgame.findNextPuzzleFrom(state.currentLevel, state.currentPuzzle);
  if (typeof next != 'undefined') {
    return next;
  }
  return findNextPuzzleFrom(0, 0);
}

// TODO: a lot of this code is duplicated in display.loadPuzzle create one function that does this
// TODO: when loading a level, it may already be completed, need to continue to search until an
//       uncompleted one is found (whatever uncompleted means)
loopgame.loadNextPuzzle = function() {
    if (animate.startTime != null) {
        setTimeout(loopgame.loadNextPuzzle, 100);
        return;
    }
    display.setMessage('next puzzle');
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    display.plotActual(desired, {xValues: [], yValues: []});
    // loopgame.currentPuzzle += 1
    // state.currentPuzzle += 1
    // // if (loopgame.currentPuzzle >= loopgame.puzzles[loopgame.currentLevel].length) {
    // if (state.currentPuzzle >= state.puzzles[state.currentLevel].length) {
    //   // display.setMessage('next level ' + (loopgame.currentLevel + 1));
    //     display.setMessage('next level ' + (state.currentLevel + 1));
    //     // loopgame.currentPuzzle = 0;
    //     state.currentPuzzle = 0;
    //     // loopgame.currentLevel += 1;
    //     state.currentLevel += 1;
    // }
    // // if (loopgame.currentLevel >= loopgame.puzzles.length) {
    // if (state.currentLevel >= state.puzzles.length) {
    //     display.setMessage('all done');
    //     // loopgame.currentPuzzle = 0;
    //     state.currentPuzzle = 0;
    //     // loopgame.currentLevel = 0;
    //     state.currentLevel = 0;
    // }
    var next = loopgame.findNextPuzzle();
    console.log('next:');
    console.log(next);
    if (typeof next != 'undefined') {
      state.currentLevel = next.level;
      state.currentPuzzle = next.puzzle;
    } else {
      display.setMessage('all done');
    }

    // loopgame.writeCookie('loopGameCurrentLevel', loopgame.currentLevel);
    loopgame.writeCookie('loopGameCurrentLevel', state.currentLevel);
    // loopgame.writeCookie('loopGameCurrentPuzzle', loopgame.currentPuzzle);
    loopgame.writeCookie('loopGameCurrentPuzzle', state.currentPuzzle);
    // display.clearInput(loopgame.currentLevel);
    display.clearInput(state.currentLevel);
    // display.plotDesired(loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle]);
    display.setInput(state.currentLevel, state.answers[state.currentLevel][state.currentPuzzle]);
    display.plotDesired(state.puzzles[state.currentLevel][state.currentPuzzle]);
}

loopgame.updateProgress = function() {
  var puzzleCount = 0;
  var completeCount = 0;
  var scores = [];
  // for (var i = 0; i < loopgame.scores.length; i++) {
  for (var i = 0; i < state.scores.length; i++) {
    var levelScores = [];
    // for (var j = 0; j < loopgame.scores[i].length; j++) {
    for (var j = 0; j < state.scores[i].length; j++) {
      // if (loopgame.scores[i][j] == -1) {
      if (state.scores[i][j] == -1) {
        levelScores.push(0);
      // } else if (loopgame.scores[i][j] > loopgame.puzzles[i][j].par) {
      } else if (state.scores[i][j] > state.puzzles[i][j].par) {
        levelScores.push(1);
        completeCount++;
      } else {
        levelScores.push(2);
        completeCount++;
      }
      puzzleCount++;
    }
    scores.push(levelScores);
  }
  // console.log('upateProgress');
  var percentComplete = completeCount / puzzleCount * 100;
  // console.log(completeCount + ' / ' + puzzleCount + ' = ' + percentComplete);
  display.setProgress(percentComplete);
  // console.log(scores);
  display.setScore(scores);
  // loopgame.writeCookie('loopGameScores', JSON.stringify(loopgame.scores));
  loopgame.writeCookie('loopGameScores', JSON.stringify(state.scores));
}

loopgame.checkSuccess = function() {
    // TODO: make order matter for correctness (but allow reverse order)
    if (animate.startTime != null) {
        setTimeout(loopgame.checkSuccess, 100);
        return;
    }
    var actual = loopgame.getActual();
    var numberCorrect = loopgame.countNumberCorrect(actual.xValues,
                                                    actual.yValues);
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    if (numberCorrect == desired.yValues.length) {
        // var currentScore = loopgame.scores[loopgame.currentLevel][loopgame.currentPuzzle];
        var currentScore = state.scores[state.currentLevel][state.currentPuzzle];
        var newScore = loopgame.getInputOperatorCount();
        if (currentScore == -1 || newScore < currentScore) {
          // loopgame.scores[loopgame.currentLevel][loopgame.currentPuzzle] = newScore;
          state.scores[state.currentLevel][state.currentPuzzle] = newScore;
          loopgame.updateProgress();
          display.blowUpActual();
          setTimeout(loopgame.loadNextPuzzle, 100);
        }
    } if (typeof numberCorrect == 'string') {
        display.setMessage(numberCorrect);
    } else if (numberCorrect < desired.yValues.length) {
        display.setMessage('correct ' + numberCorrect + '/' +
                           desired.yValues.length);
    }
}

// loopgame.saveAnswer = function() {
//   var inputs = display.getInput();
//   loopgame.writeCookie('loopGameAnswers', JSON.stringify(inputs));
// }

loopgame.update = function() {
    // display.saveInput();
    // var desired = loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle];
    var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
    var actual = loopgame.getActual();
    if (typeof actual == 'string') { // error evaluating user input
        display.plotActual(desired, {xValues: [], yValues: []});
        // display.setMessage(actual + ' ' + loopgame.currentLevel);
        display.setMessage(actual + ' ' + state.currentLevel);
        return;
    }
    display.plotActual(desired, actual);
    setTimeout(loopgame.checkSuccess, 100);
}

loopgame.keyReleased = function(event) {
    if (event.keyCode == 13) { // enter key pressed
        loopgame.update();
    }
    if (event.keyCode == 17 || event.keyCode == 18) { // ctl or alt released
        display.showActual();
    }
}

loopgame.keyPressed = function(event) {
    if (event.keyCode == 17 || event.keyCode == 18) { // ctl or alt pressed
        display.hideActual();
    }
}

loopgame.getCookieValue = function(cookieName) {
  var cookieRegularExpression = new RegExp('(?:(?:^|.*;\\s*)' + cookieName +
                                           '\\s*\\=\\s*([^;]*).*$)|^.*$');
  return document.cookie.replace(cookieRegularExpression, '$1');
}

loopgame.initialize = function() {
  var currentLevel = loopgame.getCookieValue('loopGameCurrentLevel');
  // loopgame.currentLevel = (currentLevel) ? parseInt(currentLevel) : 0;
  state.currentLevel = (currentLevel) ? parseInt(currentLevel) : 0;
  var currentPuzzle = loopgame.getCookieValue('loopGameCurrentPuzzle');
  // loopgame.currentPuzzle = (currentPuzzle) ? parseInt(currentPuzzle) : 0;
  state.currentPuzzle = (currentPuzzle) ? parseInt(currentPuzzle) : 0;
  var scores = loopgame.getCookieValue('loopGameScores');
  if (scores) {
    // loopgame.scores = JSON.parse(scores);
    state.scores = JSON.parse(scores);
  } else {
    // loopgame.scores = [];
    state.scores = [];
    // for (var i = 0; i < loopgame.puzzles.length; i++) {
    for (var i = 0; i < state.puzzles.length; i++) {
      var level = [];
      // for (var j = 0; j < loopgame.puzzles[i].length; j++) {
      for (var j = 0; j < state.puzzles[i].length; j++) {
        level.push(-1);
      }
      // loopgame.scores.push(level);
      state.scores.push(level);
    }
  }
  var answers = loopgame.getCookieValue('loopGameAnswers');
  if (answers) {
    // loopgame.answers = JSON.parse(answers);
    state.answers = JSON.parse(answers);
  } else {
    // loopgame.answers = [];
    state.answers = [];
    // for (var i = 0; i < loopgame.puzzles.length; i++) {
    for (var i = 0; i < state.puzzles.length; i++) {
      var level = [];
      // for (var j = 0; j < loopgame.puzzles[i].length; j++) {
      for (var j = 0; j < state.puzzles[i].length; j++) {
        level.push([]);
      }
      // loopgame.answers.push(level);
      state.answers.push(level);
    }
  }
}

//------------------------------------------------------------------------------
// Public Functions
//------------------------------------------------------------------------------

loopgame.startGame = function(gameContainerID) {
    loopgame.initialize();
    display.initialize(gameContainerID);
    loopgame.updateProgress();
    display.setMessage('welcome');
    // display.clearInput(loopgame.currentLevel);
    display.clearInput(state.currentLevel);
    // display.setInput(loopgame.currentLevel, loopgame.answers[loopgame.currentLevel][loopgame.currentPuzzle]);
    // console.log(state.currentLevel + ' ' + state.currentPuzzle);
    display.setInput(state.currentLevel, state.answers[state.currentLevel][state.currentPuzzle]);
    // display.plotDesired(loopgame.puzzles[loopgame.currentLevel][loopgame.currentPuzzle]);
    display.plotDesired(state.puzzles[state.currentLevel][state.currentPuzzle]);
    document.onkeydown = loopgame.keyPressed;
    document.onkeyup = loopgame.keyReleased;
}
