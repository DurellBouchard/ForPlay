// TODO: add message about the prgress bar and the star system after completing
//       an easy puzzle

/**
 * @fileoverview This file contains...
 */

/**
 * @namespace
 */
var display = {};

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

display.GAME_TITLE = 'For Play';
// display.GAME_TITLE = 'The Loop Game';
// display.GAME_TITLE = 'Looped Out';
// display.GAME_TITLE = 'One Fell Loop';
// display.GAME_TITLE = 'Loop\'s On';
// display.GAME_TITLE = 'From Loop to Nuts';
// display.GAME_TITLE = 'Loop it Up';
// display.GAME_TITLE = 'Duck Loop';
display.LANGUAGE = 'Python'; // 'Python' or anything else for Java/C++
display.SVG_DIMENSIONS = {width: 100, height: 57.5};
display.PLOT_BOUNDING_BOX = {left: 10, right: 95, top: 5, bottom: 47.5};
display.PRIMARY_COLOR = {r:85, g:85, b:85};
display.SECONDARY_COLOR = {r:204, g:204, b:204};
display.HIGHLIGHT_COLOR = {r:152, g:218, b:252};
display.BACKGROUND_COLOR = {r:255, g:255, b:255};
display.BODY_TEXT_SIZE = '24px';
display.HEADER_TEXT_SIZE = '64px';
display.NUMBER_OF_X_LABELS = 9;
display.NUMBER_OF_Y_LABELS = 5;
display.AXIS_LINE_WIDTH = 0.3;
display.LABEL_SIZE = 3;
display.POINT_SIZE = 3;
display.SVG_NS = "http://www.w3.org/2000/svg";
// TODO: put this and some other vars in a settings js file?
display.MAX_SELECTABLE_LEVEL = 3; // change to allow player's to select any
                                  // level up to the specified number
//------------------------------------------------------------------------------
// Private Variables
//------------------------------------------------------------------------------

display.nbspText_ = String.fromCharCode(160);
display.tabText_ = display.nbspText_ + display.nbspText_ +
                   display.nbspText_ + display.nbspText_;
display.svgID = 'loog-game-svg';
display.inputParagraphIds = ['loop-game-loop-input',
                             'loop-game-variable-loop-input',
                             'loop-game-accumulator-loop-input',
                             'loop-game-variable-accumulator-loop-input',
                             'loop-game-nested-loop-input'];
display.inputIds = [['loop-game-loop-start-input',
                     'loop-game-loop-stop-input',
                     'loop-game-loop-step-input'],
                    ['loop-game-variable-loop-assign-y-input'],
                    ['loop-game-accumulator-loop-init-y-input',
                     'loop-game-accumulator-loop-assign-y-input'],
                    ['loop-game-variable-accumulator-loop-init-y-input',
                     'loop-game-variable-accumulator-loop-assign-y-input'],
                    ['loop-game-nested-loop-x-start-input',
                     'loop-game-nested-loop-x-stop-input',
                     'loop-game-nested-loop-x-step-input',
                     'loop-game-nested-loop-y-start-input',
                     'loop-game-nested-loop-y-stop-input',
                     'loop-game-nested-loop-y-step-input']];
display.messageBoxId = 'loop-game-message-box';
display.actualPlotId = 'loop-game-actual-plot';
display.desiredPlotId = 'loop-game-desried-plot';
display.scoreBoxId = 'loop-game-score-box';
display.progressBarId = 'loop-game-progress-bar';
display.progressTextId = 'loop-game-progress-text';
display.stopSpanClass = 'loop-game-stop-span';
display.stopComparisonSpanClass = 'loop-game-stop-comparison-span';
display.frownString = String.fromCharCode(9785);
display.smileString = String.fromCharCode(9786);
display.levelNames = ['Loop Header Parameters',
                      'Loop Control Variables',
                      'Loop Accumulator Variables',
                      'Nested Loops'];

//------------------------------------------------------------------------------
// Private Functions
//------------------------------------------------------------------------------

display.stringifyColor = function(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}

display.addTitle = function(container) {
    var header = document.createElement('h1');
    header.style.color = display.stringifyColor(display.PRIMARY_COLOR);
    header.style.fontSize = display.HEADER_TEXT_SIZE;
    header.style.textAlign = 'center';
    header.textContent = display.GAME_TITLE;
    container.appendChild(header);
}

display.addParagraph = function(container, id) {
    var paragraph = document.createElement('p');
    paragraph.setAttribute('id', id);
    paragraph.style.margin = '0';
    container.appendChild(paragraph);
    return paragraph;
}

display.addText = function(container, text, numberOfTabs) {
    for (var i = 0; i < numberOfTabs; i++) {
        text = display.tabText_ + text;
    }
    var textNode = document.createTextNode(text);
    container.appendChild(textNode);
}

display.addLoopText = function(container, iteratorName) {
    if (display.LANGUAGE === 'Python') {
	var loopText = 'for ' + iteratorName + ' in range(0, ';
    } else {
	var loopText = 'for (int ' + iteratorName + ' = 0; ' + iteratorName
	    + ' < ';
    }
    display.addText(container, loopText, 0);
    var span = document.createElement('span');
    span.setAttribute('class', display.stopSpanClass);
    display.addText(span, display.NUMBER_OF_X_LABELS + '');
    container.appendChild(span);
    if (display.LANGUAGE === 'Python') {
	display.addText(container, ', 1):', 0);
    } else {
	display.addText(container, '; ' + iteratorName + '++) {', 0);
    }
}

display.addLineBreak = function(container) {
    var lineBreak = document.createElement('br');
    container.appendChild(lineBreak);
}

display.addInputTextField = function(container, size, id) {
    var input = document.createElement('input');
    input.setAttribute('id', id);
    input.setAttribute('style', 'font-family: inherit');
    input.setAttribute('onblur', 'display.userInputLostFocus(\'' + id + '\')');
    input.setAttribute('onfocus', 'display.userInputGotFocus(\'' + id  + '\')');
    input.setAttribute('oninput', 'display.userInputResize(\'' + id  + '\')');
    // input.style.width = (size * 12) + 'px';
    input.style.width = '24px';
    input.style.minWidth = '24px';
    input.style.fontSize = '24px';
    input.style.color = 'rgb(85,85,85)';
    input.style.outline = '0'
    input.style.paddingLeft = '6px';
    // input.style.paddingLeft = '6px';
    container.appendChild(input);
}

display.addYInput = function(container, numberOfTabs, id) {
    display.addText(container, 'y = ', numberOfTabs);
    display.addInputTextField(container, 12, id);
}

display.addForInput = function(container, iteratorName, numberOfTabs,
  startId, stopId, stepId) {
  if (display.LANGUAGE === 'Python') {
    var text = 'for ' + iteratorName + ' in range(';
  } else {
    var text = 'for (int ' + iteratorName + ' = ';
  }
  display.addText(container, text, numberOfTabs);
  display.addInputTextField(container, 8, startId);
  if (display.LANGUAGE === 'Python') {
    display.addText(container, ', ', 0);
  } else {
    display.addText(container, '; ' + iteratorName, 0);
    var span = document.createElement('span');
    span.setAttribute('class', display.stopComparisonSpanClass);
    display.addText(span, ' < ', 0);
    container.appendChild(span);
  }
  display.addInputTextField(container, 8, stopId);
  if (display.LANGUAGE == 'Python') {
    display.addText(container, ', ', 0);
  } else {
    display.addText(container, '; ' + iteratorName + ' += ', 0);
  }
  display.addInputTextField(container, 8, stepId);
  if (display.LANGUAGE == 'Python') {
    display.addText(container, '):', 0);
  } else {
    display.addText(container, ') {', 0);
  }
}

display.addLoopInput = function(container) {
    var paragraph = display.addParagraph(container,
                                         display.inputParagraphIds[0]);
    display.addForInput(paragraph, 'y', 0, display.inputIds[0][0],
                        display.inputIds[0][1], display.inputIds[0][2]);
    display.addLineBreak(paragraph);
    display.addText(paragraph, 'plot(y)', 1);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 0);
    }
}

display.addVariableLoopInput = function(container) {
    var paragraph = display.addParagraph(container,
                                         display.inputParagraphIds[1]);
    display.addLoopText(paragraph, 'x');
    display.addLineBreak(paragraph);
    display.addYInput(paragraph, 1, display.inputIds[1][0]);
    display.addLineBreak(paragraph);
    display.addText(paragraph, 'plot(x, y)', 1);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 0);
    }
}

display.addAccumulatorLoopInput = function(container) {
    paragraph = display.addParagraph(container,
                                     display.inputParagraphIds[2]);
    display.addYInput(paragraph, 0, display.inputIds[2][0]);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
    }
    display.addLineBreak(paragraph);
    display.addLoopText(paragraph, 'x');
    display.addLineBreak(paragraph);
    display.addText(paragraph, 'plot(x, y)', 1);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
    }
    display.addLineBreak(paragraph);
    display.addYInput(paragraph, 1, display.inputIds[2][1]);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 0);
    }
}

display.addVariableAccumulatorLoopInput = function(container) {
    var paragraph = display.addParagraph(container,
                                         display.inputParagraphIds[3]);
    display.addYInput(paragraph, 0, display.inputIds[3][0]);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
    }
    display.addLineBreak(paragraph);
    display.addLoopText(paragraph, 'x');
    display.addLineBreak(paragraph);
    display.addText(paragraph, 'plot(x, y)', 1);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
    }
    display.addLineBreak(paragraph);
    display.addYInput(paragraph, 1, display.inputIds[3][1]);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 0);
    }
}

display.addNestedLoopInput = function(container) {
    var paragraph = display.addParagraph(container,
                                         display.inputParagraphIds[4]);
    display.addForInput(paragraph, 'y', 0, display.inputIds[4][0],
                        display.inputIds[4][1], display.inputIds[4][2]);
    display.addLineBreak(paragraph);
    display.addForInput(paragraph, 'x', 1, display.inputIds[4][3],
                        display.inputIds[4][4], display.inputIds[4][5]);
    display.addLineBreak(paragraph);
    display.addText(paragraph, 'plot(x, y)', 2);
    if (display.LANGUAGE !== 'Python') {
	display.addText(paragraph, ';', 0);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 1);
	display.addLineBreak(paragraph);
	display.addText(paragraph, '}', 0);
    }
}

display.userInputGotFocus = function(userInputId) {
    var userInput = document.getElementById(userInputId);
    var highlightColorString = display.stringifyColor(display.HIGHLIGHT_COLOR);
    userInput.style.border = '1px solid ' + highlightColorString;
    userInput.style.boxShadow = '0 0 8px ' + highlightColorString;
}

display.userInputLostFocus = function(userInputId) {
    var userInput = document.getElementById(userInputId);
    var secondaryColorString = display.stringifyColor(display.SECONDARY_COLOR);
    userInput.style.border = '1px solid ' + secondaryColorString;
    userInput.style.boxShadow = 'none';
}

display.computeRenderedTextWidth = function(text) {
  var span = document.createElement("span");
  span.setAttribute('style', 'font-family: inherit');
  span.style.fontSize = '24px';
  span.style.whiteSpace = 'pre';
  span.textContent = text;
  document.body.appendChild(span);
  var spanWidth = span.getBoundingClientRect().width;
  document.body.removeChild(span);
  return spanWidth;
}

display.toggleScore = function() {
  var scoreBox = document.getElementById(display.scoreBoxId);
  if (scoreBox.style.display === 'none') {
    scoreBox.style.display = 'block';
    animate.addToQueue(scoreBox, 'style.height', '0px', '300px', 0, 1000);
    // animate.addToQueue(scoreBox, 'style.paddingLeft', '0px', '12px', 0, 1000);
    // animate.addToQueue(scoreBox, 'style.paddingRight', '0px', '12px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.paddingTop', '0px', '6px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.paddingBottom', '0px', '6px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.marginBottom', '0px', '4px', 0, 1000);
    animate.start(null);
  } else {
    animate.addToQueue(scoreBox, 'style.height', '300px', '0px', 0, 1000);
    // animate.addToQueue(scoreBox, 'style.paddingLeft', '12px', '0px', 0, 1000);
    // animate.addToQueue(scoreBox, 'style.paddingRight', '12px', '0px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.paddingTop', '6px', '0px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.paddingBottom', '6px', '0px', 0, 1000);
    animate.addToQueue(scoreBox, 'style.marginBottom', '4px', '0px', 0, 1000);
    animate.start(function() {
      scoreBox.style.display = 'none';
    });
  }
}

display.userInputResize = function(userInputId) {
  var userInput = document.getElementById(userInputId);
  // var width = ((userInput.value.length + 1) * display.BODY_TEXT_SIZE);
  // var width = ((userInput.value.length + 0) * 14);
  var width = display.computeRenderedTextWidth(userInput.value);
  // console.log(userInput.value.length);
  // console.log(display.BODY_TEXT_SIZE);
  // console.log(width);
  // TODO: this padding should be a gloval var that is also used in text input
  //       creation
  var padding = 6;
  userInput.style.width =  width + padding + 'px';
}

display.addUserInput = function(container) {
    var userInputContainer = document.createElement('div');
    userInputContainer.style.padding = '6px 12px';
    userInputContainer.style.border = '1px solid ' +
        display.stringifyColor(display.SECONDARY_COLOR);
    userInputContainer.style.borderRadius = '4px';
    userInputContainer.style.marginBottom = '4px';
    userInputContainer.style.fontSize = display.BODY_TEXT_SIZE;
    userInputContainer.style.color =
        display.stringifyColor(display.PRIMARY_COLOR);
    container.appendChild(userInputContainer);
    display.addLoopInput(userInputContainer);
    display.addVariableLoopInput(userInputContainer);
    display.addAccumulatorLoopInput(userInputContainer);
    display.addVariableAccumulatorLoopInput(userInputContainer);
    display.addNestedLoopInput(userInputContainer);
}

display.addLine = function(container, x1, y1, x2, y2, color, width) {
    var line = document.createElementNS(display.SVG_NS, "line");
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', width);
    container.appendChild(line);
    return line;
}

display.addAxisLines = function(container) {
    var group = document.createElementNS(display.SVG_NS, "g");
    var plotHeight = display.PLOT_BOUNDING_BOX.bottom -
                     display.PLOT_BOUNDING_BOX.top;
    var lineDistance = plotHeight / (display.NUMBER_OF_Y_LABELS - 1);
    var y = display.PLOT_BOUNDING_BOX.top;
    for (var i = 0; i < display.NUMBER_OF_Y_LABELS; i++) {
        var line = document.createElementNS(display.SVG_NS, "line");
        line.setAttribute('x1', display.PLOT_BOUNDING_BOX.left);
        line.setAttribute('y1', y);
        line.setAttribute('x2', display.PLOT_BOUNDING_BOX.right);
        line.setAttribute('y2', y);
        if (i == display.NUMBER_OF_Y_LABELS - 1) {
            display.addLine(group,
                            display.PLOT_BOUNDING_BOX.left, y,
                            display.PLOT_BOUNDING_BOX.right, y,
                            display.stringifyColor(display.PRIMARY_COLOR),
                            display.AXIS_LINE_WIDTH);
        } else {
            display.addLine(group,
                            display.PLOT_BOUNDING_BOX.left, y,
                            display.PLOT_BOUNDING_BOX.right, y,
                            display.stringifyColor(display.SECONDARY_COLOR),
                            display.AXIS_LINE_WIDTH);
        }
        y += lineDistance;
    }
    container.appendChild(group);
}

display.addSVG = function(container) {
    var svg = document.createElementNS(display.SVG_NS, 'svg');
    svg.setAttribute('id', display.svgID);
    svg.style.border = '1px solid ' +
        display.stringifyColor(display.SECONDARY_COLOR);
    svg.style.borderRadius = '4px';
    svg.style.width = '100%';
    svg.style.boxSizing = 'border-box';
    svg.setAttribute('viewBox', '0 0 ' + display.SVG_DIMENSIONS.width +
                     ' ' + display.SVG_DIMENSIONS.height);
    container.appendChild(svg);
    display.addAxisLines(svg);
}

display.addLabel = function(container, x, y, text, size, color, anchor) {
    var label = document.createElementNS(display.SVG_NS, "text");
    label.setAttribute('x', x);
    label.setAttribute('y', y);
    label.setAttribute('font-size', size);
    label.setAttribute('text-anchor', anchor);
    label.setAttribute('dy', size * 0.3);
    label.setAttribute('dx', 0.0);
    label.setAttribute('fill', display.stringifyColor(color));
    label.textContent = text;
    container.appendChild(label);
    return label;
}

display.removeChildren = function(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

display.removeElement = function(container, id) {
    var element = document.getElementById(id);
    if (element != null) {
        container.removeChild(element);
    }
}

display.addXAxisLabels = function(container, range) {
    var xAxisLabelsId = 'loop-game-x-axis-labels';
    display.removeElement(container, xAxisLabelsId);
    var group = document.createElementNS(display.SVG_NS, "g");
    group.setAttribute('id', xAxisLabelsId);
    var plotWidth = display.PLOT_BOUNDING_BOX.right -
                    display.PLOT_BOUNDING_BOX.left;
    var labelDistance = plotWidth / (display.NUMBER_OF_X_LABELS - 1);
    var labelDelta = (range.end - range.start) / (display.NUMBER_OF_X_LABELS - 1)
    var label = range.start;
    var y = display.PLOT_BOUNDING_BOX.bottom + display.LABEL_SIZE +
        display.POINT_SIZE / 2;
    var x = display.PLOT_BOUNDING_BOX.left;
    for (var i = 0; i < display.NUMBER_OF_X_LABELS; i++) {
        display.addLabel(group, x, y, label, display.LABEL_SIZE,
                         display.PRIMARY_COLOR, 'middle');
        x += labelDistance;
        label += labelDelta;
    }
    container.appendChild(group);
}

display.addYAxisLabels = function(container, range) {
    var yAxisLabelsId = 'loop-game-y-axis-labels';
    display.removeElement(container, yAxisLabelsId);
    var group = document.createElementNS(display.SVG_NS, "g");
    group.setAttribute('id', yAxisLabelsId);
    var plotHeight = display.PLOT_BOUNDING_BOX.bottom -
                     display.PLOT_BOUNDING_BOX.top;
    var labelDistance = plotHeight / (display.NUMBER_OF_Y_LABELS - 1);
    var labelDelta = (range.end - range.start) / (display.NUMBER_OF_Y_LABELS - 1)
    var label = range.end;
    var x = display.PLOT_BOUNDING_BOX.left - display.LABEL_SIZE;
    var y = display.PLOT_BOUNDING_BOX.top;
    for (var i = 0; i < display.NUMBER_OF_Y_LABELS; i++) {
        display.addLabel(group, x, y, label, display.LABEL_SIZE,
                         display.PRIMARY_COLOR, 'end');
        y += labelDistance;
        label -= labelDelta;
    }
    container.appendChild(group);
}

display.addStar = function(container) {
  var svg = document.createElementNS(display.SVG_NS, 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  var defs = document.createElementNS(display.SVG_NS, 'defs');
  // TODO: replace this with hollow star
  // var polygon = document.createElementNS(display.SVG_NS, 'polygon');
  // polygon.setAttribute('id', 'star');
  // polygon.setAttribute('points', '100,10 40,198 190,78 10,78 160,198');
  // polygon.style.display = 'block';
  // polygon.style.fillRule = 'nonzero';
  // defs.appendChild(polygon);
  var path = document.createElementNS(display.SVG_NS, 'path');
  path.setAttribute('id', 'star');
  path.setAttribute('d', 'M0.999,0.001L1.223,0.691L1.949,0.691L1.362,1.118L1.586,1.808L0.999,1.382L0.412,1.808L0.636,1.118L0.049,0.691L0.775,0.691L0.999,0.001Z');
  // path.style.display = 'block';
  // path.style.fillRule = 'nonzero';
  defs.appendChild(path);
  svg.appendChild(defs);
  container.appendChild(svg);
}

display.addScoreBox = function(container) {
  var scoreBox = document.createElement('div');
  scoreBox.setAttribute('id', display.scoreBoxId);
  // scoreBox.setAttribute('onclick', 'display.toggleScore()');
  // scoreBox.style.cursor = 'pointer';
  scoreBox.style.display = 'block';
  scoreBox.style.overflow = 'hidden';
  scoreBox.style.boxSizing = 'border-box';
  scoreBox.style.width = '100%';
  // scoreBox.style.minHeight = '36px';
  scoreBox.style.padding = '6px 12px';
  scoreBox.style.color = display.stringifyColor(display.PRIMARY_COLOR);
  scoreBox.style.backgroundColor =
      display.stringifyColor(display.BACKGROUND_COLOR);
  scoreBox.style.backgroundImage = 'none';
  scoreBox.style.border = '1px solid ' +
      display.stringifyColor(display.SECONDARY_COLOR);
  scoreBox.style.borderRadius = '4px';
  scoreBox.style.marginBottom = '4px';
  container.appendChild(scoreBox);
}

display.addProgress = function(container) {
    var progress = document.createElement('div');
    // progress.setAttribute('id', display.progressBarId);
    progress.setAttribute('onclick', 'display.toggleScore()');
    progress.style.cursor = 'pointer';
    progress.style.display = 'block';
    progress.style.boxSizing = 'border-box';
    progress.style.width = '100%';
    progress.style.padding = '0px';
    progress.style.fontSize = '24px';
    progress.style.color = display.stringifyColor(display.PRIMARY_COLOR);
    progress.style.backgroundColor =
        display.stringifyColor(display.BACKGROUND_COLOR);
    progress.style.backgroundImage = 'none';
    progress.style.border = '1px solid ' +
        display.stringifyColor(display.SECONDARY_COLOR);
    progress.style.borderRadius = '4px';
    progress.style.marginBottom = '4px';
    progress.textContent = '';
    var progressBar = document.createElement('div');
    progressBar.setAttribute('id', display.progressBarId);
    progressBar.style.display = 'inline-block';
    progressBar.style.verticalAlign = 'top';
    progressBar.style.width = '0%';
    // progressBar.style.width = '26%';
    progressBar.style.height = '28px';
    // progressBar.style.height = '100%';
    progressBar.style.color = display.stringifyColor(display.BACKGROUND_COLOR);
    progressBar.style.backgroundColor = display.stringifyColor(display.HIGHLIGHT_COLOR);
    progressBar.style.textAlign = 'center';
    progressBar.textContent = '';
    progress.appendChild(progressBar);
    var progressText = document.createElement('div');
    progressText.setAttribute('id', display.progressTextId);
    progressText.style.display = 'inline-block';
    progressText.style.paddingLeft = '6px';
    // progressText.style.height = '100%';
    progressText.style.height = '28px';
    progressText.style.color = display.stringifyColor(display.PRIMARY_COLOR);
    progressText.textContent = '';
    progress.appendChild(progressText);
    container.appendChild(progress);
}

display.addMessageBox = function(container) {
    messageBox = document.createElement('div');
    messageBox.setAttribute('id', display.messageBoxId);
    messageBox.style.display = 'block';
    messageBox.style.boxSizing = 'border-box';
    messageBox.style.width = '100%';
    messageBox.style.minHeight = '36px';
    messageBox.style.padding = '6px 12px';
    messageBox.style.fontSize = '24px';
    messageBox.style.color = display.stringifyColor(display.PRIMARY_COLOR);
    messageBox.style.backgroundColor =
        display.stringifyColor(display.BACKGROUND_COLOR);
    messageBox.style.backgroundImage = 'none';
    messageBox.style.border = '1px solid ' +
        display.stringifyColor(display.SECONDARY_COLOR);
    messageBox.style.borderRadius = '4px';
    messageBox.textContent = '';
    container.appendChild(messageBox);
}

display.addPoint = function(container, x, y, radius, color) {
    var point = document.createElementNS(display.SVG_NS, "circle");
    point.setAttribute('cx', x);
    point.setAttribute('cy', y);
    point.setAttribute('r', radius);
    point.setAttribute('fill', color);
    container.appendChild(point);
    return point;
}

display.map = function(value, fromRange, toRange, flip) {
    if (fromRange.start == fromRange.end) {
        return 0.0;
    }
    var fromLength = fromRange.end - fromRange.start;
    if (flip) {
        var normalizedValue = 1.0 - ((value - fromRange.start) / fromLength);
    } else {
        var normalizedValue = ((value - fromRange.start) / fromLength);
    }
    var toLength = toRange.end - toRange.start;
    var mappedValue = normalizedValue * toLength + toRange.start;
    return mappedValue;
}

display.addPlot = function(container, id, xValues, yValues,
                           xRange, yRange, color) {
    display.removeElement(container, id);
    var group = document.createElementNS(display.SVG_NS, "g");
    group.setAttribute('id', id);
    var plotYRange ={start: display.PLOT_BOUNDING_BOX.top,
                     end: display.PLOT_BOUNDING_BOX.bottom};
    var plotXRange ={start: display.PLOT_BOUNDING_BOX.right,
                     end: display.PLOT_BOUNDING_BOX.left};
    var animationDelay = 200;
    var offScreen = display.POINT_SIZE * -2;
    for (var i = yValues.length - 1; i >= 0; i--) {
        var startTime = i * animationDelay;
        var endTime = (i + 1) * animationDelay;
        var x2 = display.map(xValues[i], xRange, plotXRange, true);
        var y2 = display.map(yValues[i], yRange, plotYRange, true);
        if (i > 0) {
            var x1 = display.map(xValues[i - 1], xRange, plotXRange, true);
            var y1 = display.map(yValues[i - 1], yRange, plotYRange, true);
            var line = display.addLine(group, x1, y1, x1, y1, color, 1);
            animate.addToQueue(line, 'x2', x1, x2, startTime, endTime);
            animate.addToQueue(line, 'y2', y1, y2, startTime, endTime);

            var point = display.addPoint(group, offScreen, offScreen,
                                         display.POINT_SIZE, color);
            animate.addToQueue(point, 'cx', x1, x2, startTime, endTime);
            animate.addToQueue(point, 'cy', y1, y2, startTime, endTime);
            var label = display.addLabel(group, offScreen, offScreen,
                                         yValues[i], display.LABEL_SIZE,
                                         display.BACKGROUND_COLOR, 'middle');
            animate.addToQueue(label, 'x', x1, x2, startTime, endTime);
            animate.addToQueue(label, 'y', y1, y2, startTime, endTime);
        } else {
            var point = display.addPoint(group, x2, y2, 0, color);
            animate.addToQueue(point, 'r', 0, display.POINT_SIZE,
                               startTime, endTime);
            var label = display.addLabel(group, x2, y2, yValues[i], 0,
                                         display.BACKGROUND_COLOR, 'middle');
            animate.addToQueue(label, 'font-size', 0, display.LABEL_SIZE,
                               startTime, endTime);
            animate.addToQueue(label, 'dy', 0, display.LABEL_SIZE * 0.3,
                               startTime, endTime);
        }
    }
    container.appendChild(group);
    animate.start(null);
}

display.personifyMessage = function(message) {
    var personified = '';
    if (message.includes('welcome')) {
        personified += 'Welcome to ' + display.GAME_TITLE + '. ';
        personified += 'To play the game, fill in the text boxes to complete ';
        personified += 'program. You win by creating a program that ';
        personified += 'reproduces the given dots. ';
        personified += 'Try it, press <Enter> to see your plot.';
    } else if (message.includes('next puzzle')) {
        personified += 'Great work!  ' + display.smileString;
        personified += ' Now try this one.';
    } else if (message.includes('next level')) {
        console.log(message);
        var levelIndex = 'next level '.length;
        var level = parseInt(message.substring(levelIndex));
        console.log(levelIndex);
        console.log(level);
        personified += 'Way to go! ' + display.smileString + ' ';
        personified += 'You finished all of the puzzles on this level. ';
        if (level == 1) {
            personified += 'On this next level, you need to write equations ';
            personified += 'to compute y using the iterator variable i. ';
        } else if (level == 2) {
            personified += 'On this next level, you need to update the value ';
            personified += 'of the variable y by writing equations that use ';
            personified += 'the variable y. ';
        } else if (level == 3) {
            personified += 'On this next level, you need to write equations ';
            personified += 'to compute y using both the variables ';
            personified += 'i and y. ';
        } else if (level == 4) {
            personified += 'On this next level, you need to specify the stop, ';
            personified += 'start, and step for two loops, an outer loop, ';
            personified += 'with the iterator variable x, and an inner '
            personified += 'loop, with the iterator variable y. ';
        }
        personified += 'Good luck!';
    } else if (message.includes('all done')) {
        personified = 'You\'re amazing! ' + display.smileString;
        personified = ' You finished all of the levels.';
    } else if (message.includes('no right hand side') ||
               message.includes('unknown variable') ||
               message.includes('non-integer number') ||
               message.includes('unbalanced parentheses') ||
               message.includes('unknown error')) {
        personified += 'I\'m sorry. ' + display.frownString;
        personified += ' But I don\'t understand your equation. ';
        if (message.includes('no right hand side')) {
            personified += 'I can\'t seem to find a right operand. ';
        } else if (message.includes('unknown variable')) {
            personified += 'It looks like you entered a variable ';
            personified += 'don\'t know. ';
        } else if (message.includes('non-integer number')) {
            personified += 'It looks like you entered a number ';
            personified += 'I don\'t know. ';
        } else if (message.includes('unbalanced parentheses')) {
            personified += 'I can\'t seem to find a closing parenthesis. ';
        }
        personified += 'Try writing an equation that only uses integers, ';
        if (message.indexOf('1') != -1) {
            personified += 'the variable x, ';
        } else if (message.indexOf('2') != -1) {
            personified += 'the variable y, ';
        } else {
            personified += 'the variables x and y, ';
        }
        personified += 'and the operators +, -, *, and /.';
    } else if (message.includes('is not an integer')) {
        var variableName = message.substring(0, message.indexOf(' is not an '));
        personified = 'Uh-oh. ' + display.frownString  + ' ';
        personified += 'I don\'t understand what you entered for the ';
        personified += variableName + '. ';
        personified += 'I only understand integers values for the ';
        personified += variableName + '. Can you fix it for me?';
    } else if (message.includes('is empty')) {
        var variableName = message.substring(0, message.indexOf(' is empty '));
        personified = 'Uh-oh. ' + display.frownString  + ' ';
        personified += 'It looks like the ' + variableName;
        personified += ' text box is empty. Can you fill it in for me?';
    } else if (message.includes('correct ')) {
        var correctIndex = 'correct '.length;
        var slashIndex = message.indexOf('/');
        var numberCorrect = parseInt(message.substring(correctIndex,
                                                       slashIndex));
        var totalNumber = parseInt(message.substring(slashIndex + 1));
        personified = 'Aw man... ' + display.frownString + ' ';
        if (numberCorrect / totalNumber > 0.8) {
            personified += 'That\'s so close. ';
        } else {
            personified += 'That\'s not quite right. ';
        }
        personified += 'Why don\'t you try again? '
        personified += 'If you need to temporarily hide your plot, ';
        personified += 'hold the <ctl> key.';
    } else if (message.includes('too few ')) {
        var desiredNumber = parseInt(message.substring('too few '.length));
        personified = 'Uh-oh. ' + display.frownString + ' ';
        personified += 'It doesn\'t look like I plotted enough points. ';
        personified += 'Can you fix it so that I plot ';
        personified += desiredNumber + ' points?';
    } else if (message.includes('too many ')) {
        var desiredNumber = parseInt(message.substring('too many '.length));
        personified = 'Uh-oh. ' + display.frownString  + ' ';
        personified += 'It looks like I plotted too many points. ';
        personified += 'Can you fix it so that I plot ';
        personified += desiredNumber + ' points?';
    }
    return personified;
}

display.updateLoopText = function(desired) {
  var stopSpans = document.getElementsByClassName(display.stopSpanClass);
  var text = desired.yValues.length + '';
  for (var i = 0; i < stopSpans.length; i++) {
    stopSpans[i].childNodes[0].nodeValue = text;
  }
  stopSpans = document.getElementsByClassName(display.stopComparisonSpanClass);
  if (desired.yValues[0] < desired.yValues[desired.yValues.length - 1]) {
    text = " < ";
  } else {
    text = " > ";
  }
  for (var i = 0; i < stopSpans.length; i++) {
    stopSpans[i].childNodes[0].nodeValue = text;
  }
}
//------------------------------------------------------------------------------
// Public Functions
//------------------------------------------------------------------------------

display.setMessage = function(message) {
    var messageBox = document.getElementById(display.messageBoxId);
    messageBox.textContent = display.personifyMessage(message);
}

display.hideActual = function() {
    var actual = document.getElementById(display.actualPlotId);
    if (actual == null) {
        return;
    }
    animate.addToQueue(actual, 'opacity', 1, 0.1, 0, 200);
    animate.start(null);
}

display.showActual = function() {
    var actual = document.getElementById(display.actualPlotId);
    if (actual == null) {
        return;
    }
    animate.addToQueue(actual, 'opacity', 0.1, 1, 0, 200);
    animate.start(null);
}

display.blowUpActual = function() {
    var desired = document.getElementById(display.desiredPlotId);
    desired.style.display = 'none';
    var actual = document.getElementById(display.actualPlotId);
    if (actual == null) {
        return;
    }
    animate.addToQueue(actual, 'scale', 1, 10, 0, 1000);
    animate.addToQueue(actual, 'opacity', 1, 0, 0, 1000);
    animate.start(null);
}

display.plotActual = function(desired, actual) {
    // TODO: adjust color of correct points
    var svg = document.getElementById(display.svgID);
    display.addPlot(svg, display.actualPlotId,
                 actual.xValues, actual.yValues,
                 desired.xRange, desired.yRange,
                 display.stringifyColor(display.HIGHLIGHT_COLOR));
}

display.plotDesired = function(desired) {
    display.updateLoopText(desired);
    var svg = document.getElementById(display.svgID);
    display.addPlot(svg, display.desiredPlotId,
                 desired.xValues, desired.yValues,
                 desired.xRange, desired.yRange,
                 display.stringifyColor(display.PRIMARY_COLOR));
    display.addXAxisLabels(svg, desired.xRange);
    display.addYAxisLabels(svg, desired.yRange);
}

display.setProgress = function(progress) {
  var progressBar = document.getElementById(display.progressBarId);
  var progressText = document.getElementById(display.progressTextId);

  if (progress > 4) {
    progressBar.textContent = Math.round(progress) + '%';
    progressText.textContent = '';
    progressText.style.display = 'none';
  } else {
    progressBar.textContent = '';
    progressText.textContent = Math.round(progress) + '%';
    progressText.style.display = 'inline-block';
  }

  // console.log('width: ' + progressBar.style.width);
  // console.log('width: ' + Math.round(progress) + '%');
  animate.addToQueue(progressBar, 'style.width', progressBar.style.width,
                     Math.round(progress) + '%', 0, 1000);
  animate.start(null);
  // animate.start(function() {
  //progressBar.style.width = Math.round(progress) + '%';
  // TODO: verify offsetWidth is a number, not a string and that 48 is good number
  // console.log('offsetWidth: ' + progressBar.offsetWidth);
  // if (progressBar.offsetWidth > 48) {
  //   progressBar.textContent = Math.round(progress) + '%';
  //   progressText.textContent = '';
  //   // progressText.paddingLeft = '';
  //   progressText.style.display = 'none';
  // } else {
  //   progressBar.textContent = '';
  //   progressText.textContent = Math.round(progress) + '%';
  //   progressText.style.display = 'inline-block';
  // }
  // });
}

// TODO: also need to pull solution out of cookie and resize text boxes here
display.loadPuzzle = function(level, puzzle) {
  if (animate.startTime != null) {
      setTimeout(display.loadPuzzle, 100);
      return;
  }
  display.setMessage('need to put a message here.');
  var desired = state.puzzles[state.currentLevel][state.currentPuzzle];
  display.plotActual(desired, {xValues: [], yValues: []});

  // puzzles.currentPuzzle = puzzle;
  // puzzles.currentLevel = level;
  state.setCurrent(level, puzzle);
  // display.setMessage('need to put a message here.');
  // perhaps make a function in puzzle that also sets the cookies
  // memory.write('loopGameCurrentLevel', puzzles.currentPuzzle);
  // memory.write('loopGameCurrentPuzzle', puzzles.currentLevel);
  display.clearInput(state.currentLevel);
  display.setInput(state.currentLevel, state.answers[state.currentLevel][state.currentPuzzle]);
  display.plotDesired(state.puzzles[state.currentLevel][state.currentPuzzle]);
}

// TODO: move this to private section
display.addPuzzleScore = function(container, score, level, puzzle, selectable) {
  var puzzleScore = document.createElementNS(display.SVG_NS, 'svg');
  var id = 'star-' + level + '-' + puzzle;
  puzzleScore.setAttribute('id', id);
  puzzleScore.setAttribute('width', '42');
  puzzleScore.setAttribute('height', '42');
  // TODO: need to put levels and current level and puzzle variables into
  // a separate file (puzzles.js), then both display.js and loopgame.js can
  // modify them
  if (selectable) {
    puzzleScore.setAttribute('onclick', 'display.loadPuzzle(\'' + level + '\', \'' + puzzle  + '\')');
    puzzleScore.style.cursor = 'pointer';
  }
  var use = document.createElementNS(display.SVG_NS, 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#star');
  use.setAttribute('x', '0');
  use.setAttribute('y', '0');
  // use.setAttribute('transform', 'scale(0.2)');
  use.setAttribute('transform', 'scale(20.0)');
  use.style.strokeWidth = '0.1';
  // use.style.strokeWidth = '20';
  if (score == 2) {
    use.style.fill = display.stringifyColor(display.HIGHLIGHT_COLOR);
  } else if (score == 1) {
    use.style.fill = display.stringifyColor(display.SECONDARY_COLOR);
  } else {
    use.style.fill = display.stringifyColor(display.BACKGROUND_COLOR);
  }
  use.style.stroke = display.stringifyColor(display.PRIMARY_COLOR);
  puzzleScore.appendChild(use);
  container.appendChild(puzzleScore);
}

// TODO: move this to private section
display.addLevelScore = function(container, scores, number, name, selectable) {
  var levelScore = document.createElement('div');
  levelScore.style.display = 'inline-block';
  levelScore.style.width = '50%';
  var levelName = document.createElement('p');
  levelName.style.margin = '0';
  // levelName.style.fontSize = '36px';
  levelName.style.fontSize = '24px';
  // evelName.style.fontWeight = 'bold';
  levelName.style.color = display.stringifyColor(display.PRIMARY_COLOR);
  levelName.textContent = 'Level ' + (number + 1) + ': ' + name;
  levelScore.appendChild(levelName);
  // console.log(scores);
  for (var i = 0; i < scores.length; i++) {
    // var id = 'star-' + number + '-' + i;
    // console.log(id);
    display.addPuzzleScore(levelScore, scores[i], number, i, selectable);
  }
  container.appendChild(levelScore);
}

display.computeMaxSelectableLevel = function(scores) {
  for (var i = 0; i < scores.length; i++) {
    for (var j = 0; j < scores.length; j++) {
      if (scores[i][j] == 0) {
        return i;
      }
    }
  }
  return scores.length;
}

display.setScore = function(scores) {
  var scoreBox = document.getElementById(display.scoreBoxId);
  display.removeChildren(scoreBox);
  // console.log(scores);
  var maxSelectableLevel = Math.max(display.computeMaxSelectableLevel(scores),
                                    display.MAX_SELECTABLE_LEVEL);
  for (var i = 0; i < scores.length; i++) {
    var selectable = i <= maxSelectableLevel;
    display.addLevelScore(scoreBox, scores[i], i, display.levelNames[i], selectable);
  }
}

display.setInput = function(inputNumber, values) {
  if (display.inputIds[inputNumber].length != values.length) {
    return;
  }
  for (var i = 0; i < display.inputIds[inputNumber].length; i++) {
      var input = document.getElementById(display.inputIds[inputNumber][i]);
      input.value = values[i];
      display.userInputResize(display.inputIds[inputNumber][i]);
  }
}

display.getInput = function(inputNumber) {
    var values = [];
    for (var i = 0; i < display.inputIds[inputNumber].length; i++) {
        var input = document.getElementById(display.inputIds[inputNumber][i]);
        values.push(input.value);
    }
    return values;
}

display.clearInput = function(inputNumber) {
  // This is a hack to fix that level 3 was removed from the array of levels,
  // fix this hack or put the level back in
  if (inputNumber == 3) {
    inputNumber = 4;
  }
    for (var i = 0; i < display.inputIds.length; i++) {
        for (var j = 0; j < display.inputIds[i].length; j++) {
            var input = document.getElementById(display.inputIds[i][j]);
            input.value = '';
        }
    }
    for (var i = 0; i < display.inputParagraphIds.length; i++) {
        var paragraph = document.getElementById(display.inputParagraphIds[i]);
        paragraph.style.display = 'none';
    }
    // console.log('inputNumber: ' + inputNumber);
    var paragraph = document.getElementById(display.inputParagraphIds[inputNumber]);
    // console.log(paragraph);
    paragraph.style.display = 'block';
    var input = document.getElementById(display.inputIds[inputNumber][0]);
    window.setTimeout(function() {input.focus()}, 0);
}

display.initialize = function(gameContainerID) {
    var gameContainer = document.getElementById(gameContainerID);
    display.addStar(gameContainer);
    // display.addTitle(gameContainer);
    display.addUserInput(gameContainer);
    display.addSVG(gameContainer);
    display.addProgress(gameContainer);
    display.addScoreBox(gameContainer);
    display.addMessageBox(gameContainer);
}
