/**
 * @fileoverview This file contains...
 */

/**
 * @namespace
 */
var interp = {};

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

/**
 * To prevent user specified loops from taking to long the maximum
 * number of points is capped at this value.
 * @const {int}
 */
interp.MAX_POINTS = 100;

//------------------------------------------------------------------------------
// Private Variables
//------------------------------------------------------------------------------

/**
 * Names and values of all of the variables in memory when executing code.
 * @type {'<variable_name>': {integer}...}
 * @private
 */
interp.memory_ = {};

/**
 * Error text produced when executing and expression.
 * @type {string}
 * @private
 */
interp.error_ = {};

//------------------------------------------------------------------------------
// Private Functions
//------------------------------------------------------------------------------

/**
 * Determine whether input text represents an integer.
 * @param {string} text
 * @return {bool}
 */
interp.isInt_ = function(text) {
    if (text.length == 0) {
        return false;
    }
    if (text.charAt(0) == '-') {
        text = text.substring(1);
    }
    if (text.length == 0) {
        return false;
    }
    var zeroCode = '0'.charCodeAt(0);
    var nineCode = '9'.charCodeAt(0);
    for (var index = 0; index < text.length; index++) {
        var code = text.charCodeAt(index);
        if (code < zeroCode || code > nineCode) {
            return false;
        }
    }
    return true;
}

/**
 * Determine whether input text represents a floating point number.
 * @param {string} text
 * @return {bool}
 */
interp.isFloat_ = function(text) {
    if (text.length == 0) {
        return false;
    }
    if (text.charAt(0) == '-') {
        text = text.substring(1);
    }
    if (text.length == 0) {
        return false;
    }
    var pointIndex = text.indexOf('.');
    if (pointIndex == -1) {
        return false;
    }
    var integerSide = text.substring(0, pointIndex);
    var fractionalSide = text.substring(pointIndex + 1);
    if (integerSide.length == 0) {
        integerSide = '0';
    }
    if (fractionalSide.length == 0) {
        fractionalSide = '0';
    }
    if (integerSide.includes('-') || fractionalSide.includes('-')) {
        return false;
    }
    return interp.isInt_(integerSide) && interp.isInt_(fractionalSide);
}

/**
 * Determine whether input text represents a varialbe, assuming variables
 * can only contain alphabetic characters.
 * @param {string} text
 * @return {bool}
 */
interp.isVariable_ = function(text) {
    if (text.length == 0) {
        return false;
    }
    var aCode = 'a'.charCodeAt(0);
    var zCode = 'z'.charCodeAt(0);
    var ACode = 'A'.charCodeAt(0);
    var ZCode = 'Z'.charCodeAt(0);
    for (var index = 0; index < text.length; index++) {
        var code = text.charCodeAt(index);
        if ((code < aCode || code > zCode) && (code < ACode || code > ZCode)) {
            return false;
        }
    }
    return true;
}

/**
 * Determine whether character is a whitespace character.
 * @param {string} character A string of length 1.
 * @return {bool}
 */
interp.isWhitespace_ = function(character) {
    return character == ' ' || character == '\t' || character == '\n';
}

/**
 * Returns whether character is an operator (+, -, *, /, (, ))
 * @param {string} character A string of length 1.
 * @return {bool}
 */
interp.isOperator_ = function(character) {
    return character == '+' || character == '-' ||
           character == '*' || character == '/' ||
           character == '(' || character == ')';
}

/**
 * Determine the index of the first non-whitespace character from a given index.
 * If there are none, it returns the length of the string.
 * @param {string} text
 * @param {int} startIndex
 * @return {int}
 */
interp.consumeWhitespace_ = function(text, startIndex) {
    var index = startIndex;
    while (index < text.length &&
           interp.isWhitespace_(text.charAt(index)) ) {
        index++;
    }
    return index;
}

/**
 * Determine the index of the first character that is whitespace or
 * an operator from a given index.  If there are none, it
 * returns the length of the string.
 * @param {string} text
 * @param {int} startIndex
 * @return {int}
 */
interp.consumeAlphaNumeric_ = function(text, startIndex) {
    var index = startIndex;
    while (index < text.length &&
           !interp.isWhitespace_(text.charAt(index)) &&
           !interp.isOperator_(text.charAt(index))) {
        index++;
    }
    return index;
}

/**
 * Create an array of strings split by whitespace and operators.
 * The whitespace is removed, the operators are kept.
 * @param {string} expression
 * @return {Array.<string>}
 */
interp.tokenize_ = function(expression) {
    var tokens = [];
    var index = interp.consumeWhitespace_(expression, 0);
    while (index < expression.length) {
        var character = expression.charAt(index);
        if (interp.isOperator_(character)) {
            tokens.push(character);
            index++;
        } else {
            var endIndex = interp.consumeAlphaNumeric_(expression, index);
            var token = expression.substring(index, endIndex);
            tokens.push(token);
            index = endIndex;
        }
        index = interp.consumeWhitespace_(expression, index);
    }
    return tokens;
}

interp.evalLow_ = function(tokens) {
    var value = interp.evalMedium_(tokens);
    var token = tokens[0];
    while (tokens.length > 1 && (token == "+" || token == "-")) {
        tokens.shift();
        if (token == "+") {
            value += interp.evalMedium_(tokens);
        } else {
            value -= interp.evalMedium_(tokens);
        }
        token = tokens[0];
    }
    return value;
}

interp.evalMedium_ = function(tokens) {
    var value = interp.evalHigh_(tokens);
    var token = tokens[0];
    while (tokens.length > 1 && (token == "*" || token == "/")) {
        tokens.shift();
        if (tokens.length == 0) {
            interp.error_ = 'no right hand side';
            return NaN;
        }
        if (token == "*") {
            value *= interp.evalHigh_(tokens);
        } else {
            value /= interp.evalHigh_(tokens);
        }
        token = tokens[0];
    }
    return value;
}

interp.evalHigh_ = function(tokens) {
    if (tokens.length == 0) {
        interp.error_ = 'empty expression';
        return NaN;
    }
    var token = tokens.shift();
    if (token in interp.memory_) {
        interp.error_ = null;
        return interp.memory_[token];
    }
    if (interp.isInt_(token)) {
        interp.error_ = null;
        return parseInt(token);
    }
    if (token == "(") {
        if (tokens.length < 2) {
            interp.error_ = 'unbalanced parentheses';
            return NaN;
        }
        value = interp.evalLow_(tokens);
        var token = tokens.shift();
        if (token != ")") {
            interp.error_ = 'unbalanced parentheses';
            return NaN;
        }
        interp.error_ = null;
        return value;
    }
    if (token == "-") {
        interp.error_ = null;
        return -interp.evalMedium_(tokens);
    }
    if (interp.isFloat_(token)) {
        interp.error_ = 'non-integer number';
        return NaN;
    }
    if (interp.isVariable_(token)) {
        interp.error_ = 'unknown variable';
        return NaN;
    }
    interp.error_ = 'unknown error';
    return NaN;
}

//------------------------------------------------------------------------------
// Public Functions
//------------------------------------------------------------------------------

interp.evaluate = function(expression, variables) {
    interp.error_ = null;
    interp.memory_ = variables;
    var tokens = interp.tokenize_(expression);
    var value =  interp.evalLow_(tokens);
    if (tokens.length > 0) {
        interp.error_ = 'no right hand side';
        value = NaN;
    }
    if (isNaN(value)) {
        return interp.error_;
    }
    return value;
}

interp.evalLoop = function(start, stop, step, maxPoints) {
    if (start.length == 0) {
        return 'start is empty';
    }
    if (stop.length == 0) {
        return 'stop is empty';
    }
    if (step.length == 0) {
        return 'step is empty';
    }
    if (!interp.isInt_(start)) {
        return 'loop start is not an integer';
    }
    if (!interp.isInt_(stop)) {
        return 'loop stop is not an integer';
    }
    if (!interp.isInt_(step)) {
        return 'loop step is not an integer';
    }
    var start = parseInt(start);
    var stop = parseInt(stop);
    var step = parseInt(step);
    var x = 0;
    var yValues = [];
    var xValues = [];
    var endCondition = function(i, start, stop) {
        if (start < stop) {
            return i < stop;
        } else {
            return i > stop;
        }
    }
    for (var y = start; endCondition(y, start, stop); y = y + step) {
        yValues.push(y);
        xValues.push(x);
        if (yValues.length >= maxPoints) {
            break;
        }
        x += 1;
    }
    return {xValues: xValues, yValues: yValues};
}

interp.evalVariableLoop = function(expression, start, stop, step) {
    if (expression.length == 0) {
        return 'y update expression is empty';
    }
    var y = interp.evaluate(expression, {x: 0});
    if (typeof y == 'string') {
        return interp.error_;
    }
    var yValues = [];
    var xValues = [];
    var endCondition = function(x, start, stop) {
        if (start < stop) {
            return x < stop;
        } else {
            return x > stop;
        }
    }
    for (var x = start; endCondition(x, start, stop); x = x + step) {
        y = interp.evaluate(expression, {x: x});
        yValues.push(y);
        xValues.push(x);
    }
    return {xValues: xValues, yValues: yValues};
}

interp.evalAccumulatorLoop = function(initY, expression, iterations) {
    if (initY.length == 0) {
        return 'y initial value is empty';
    }
    if (expression.length == 0) {
        return 'y update expression is empty';
    }
    var y = interp.evaluate(expression, {y: 0});
    if (typeof y == 'string') {
        return interp.error_;
    }
    if (!interp.isInt_(initY)) {
        return 'y initial value is not an integer';
    }
    y = parseInt(initY);
    var yValues = [];
    var xValues = [];
    for (var x = 0; x < iterations; x++) {
        yValues.push(y);
        xValues.push(x);
        y = interp.evaluate(expression, {y: y});
    }
    return {xValues: xValues, yValues: yValues};
}

interp.evalVariableAccumulatorLoop = function(initY, expression,
                                              start, stop, step) {
    if (initY.length == 0) {
        return 'y initial value is empty';
    }
    if (expression.length == 0) {
        return 'y update expression is empty';
    }
    var y = interp.evaluate(expression, {x: 0, y: 0});
    if (typeof y == 'string') {
        return interp.error_;
    }
    if (!interp.isInt_(initY)) {
        return 'y initial value is not an integer';
    }
    y = parseInt(initY);
    var yValues = [];
    var xValues = [];
    var endCondition = function(i, start, stop) {
        if (start < stop) {
            return i < stop;
        } else {
            return i > stop;
        }
    }
    for (var x = start; endCondition(x, start, stop); x = x + step) {
        yValues.push(y);
        xValues.push(x);
        y = interp.evaluate(expression, {y: y, x: x});
    }
    return {xValues: xValues, yValues: yValues};
}

interp.evalNestedLoop = function(yStartExp, yStopExp, yStepExp,
                                 xStartExp, xStopExp, xStepExp,
                                 maxPoints) {
    if (yStartExp.length == 0) {
        return 'y loop start is empty';
    }
    if (yStopExp.length == 0) {
        return 'y loop stop is empty';
    }
    if (yStepExp.length == 0) {
        return 'y loop step is not an integer';
    }
    if (xStartExp.length == 0) {
        return 'x loop start is empty';
    }
    if (xStopExp.length == 0) {
        return 'x loop stop is empty';
    }
    if (xStepExp.length == 0) {
        return 'x loop step is not an integer';
    }
    if (!interp.isInt_(yStartExp)) {
        return 'y loop start is not an integer';
    }
    if (!interp.isInt_(yStopExp)) {
        return 'y loop stop is not an integer';
    }
    if (!interp.isInt_(yStepExp)) {
        return 'y loop step is not an integer';
    }
    var xStart = interp.evaluate(xStartExp, {y: 0});
    if (typeof xStart == 'string') {
        return 'x loop start ' + interp.error_;
    }
    var xStop = interp.evaluate(xStopExp, {y: 0});
    if (typeof xStop == 'string') {
        return 'x loop stop ' + interp.error_;
    }
    var xStep = interp.evaluate(xStepExp, {y: 0});
    if (typeof xStep == 'string') {
        return 'x loop step ' + interp.error_;
    }
    var yStart = parseInt(yStartExp);
    var yStop = parseInt(yStopExp);
    var yStep = parseInt(yStepExp);
    var xValues = [];
    var yValues = [];
    var endCondition = function(i, start, stop) {
        if (start < stop) {
            return i < stop;
        } else {
            return i > stop;
        }
    }
    for (var y = yStart; endCondition(y, yStart, yStop); y = y + yStep) {
        xStart = interp.evaluate(xStartExp, {y: y});
        xStop = interp.evaluate(xStopExp, {y: y});
        xStep = interp.evaluate(xStepExp, {y: y});
        for (var x = xStart; endCondition(x, xStart, xStop); x = x + xStep) {
            xValues.push(x);
            yValues.push(y);
            if (xValues.length >= interp.MAX_POINTS) {
                break;
            }
        }
    }
    return {xValues: xValues, yValues: yValues};
}
