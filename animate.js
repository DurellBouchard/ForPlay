/**
 * @fileoverview This file contains...
 */

/**
 * @namespace
 */
var animate = {};

//------------------------------------------------------------------------------
// Constants
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Private Variables
//------------------------------------------------------------------------------

animate.startTime = null;
animate.queue = [];
animate.sigmoidSize = 3;

//------------------------------------------------------------------------------
// Private Functions
//------------------------------------------------------------------------------

animate.parseColorString = function(colorString) {
    var colors = colorString.split(',');
    var red = parseInt(colors[0].trim().slice(4), 10);
    var green = parseInt(colors[1].trim());
    var blue = parseInt(colors[2].trim().slice(0, -1));
    return {red: red, green: green, blue: blue};
}

animate.interpolateNumber = function(startValue, endValue, t) {
    t = Math.max(Math.min(t, 1.0), 0.0); // clamp to 0 - 1
    t = t * (animate.sigmoidSize * 2)
        - animate.sigmoidSize; // scale to sigmoid range
    t = t / Math.sqrt(1 + t * t); // apply sigmoid function
    max_t = animate.sigmoidSize /
        Math.sqrt(1 + animate.sigmoidSize * animate.sigmoidSize)
    t = (t + max_t) / (2 * max_t); // normalize to 0 - 1
    return (startValue * (1.0 - t)) + (endValue * t); // lerp
}

animate.interpolateColor = function(startColorString, endColorString, t) {
    var startColor = parseColorString(startColorString);
    var endColor = animate.parseColorString(endColorString);
    var interpRed = Math.round(interpolateNumber(startColor.red,
                                                 endColor.red, t));
    var interpGreen = Math.round(interpolateNumber(startColor.green,
                                                   endColor.green, t));
    var interpBlue = Math.round(interpolateNumber(startColor.blue,
                                                  endColor.blue, t));
    var interpColorString = 'rgb(' + interpRed + ',' +
                                     interpGreen + ',' +
                                     interpBlue + ')';
    return interpColorString;
}

animate.interpolateMatrix = function(startValue, endValue, t) {
    // TODO: use one bounding box for animate and display
    var boundingBox = {left: 10, right: 95, top: 5, bottom: 47.5};
    var width = boundingBox.right - boundingBox.left;
    var height = boundingBox.bottom - boundingBox.top;
    var centerX = boundingBox.left + (width / 2);
    var centerY = boundingBox.top + (height / 2);
    var scale = animate.interpolateNumber(startValue, endValue, t);
    var translateX = centerX - (scale * centerX);
    var translateY = centerY - (scale * centerY);
    return 'matrix(' + scale + ',0,0,' +
                       scale + ',' + translateX + ',' + translateY + ')';
}

animate.stepItem = function(item, fraction) {
    if (item.attribute.substring(0, 6) === 'style.') {
      var property = item.attribute.substring(6);
      var startLength = item.startValue.length;
      var endLength = item.endValue.length;
      var suffix = '';
      if (item.startValue.substring(startLength - 2) === 'px' &&
          item.endValue.substring(endLength - 2) === 'px') {
            suffix = 'px';
      } else if (item.startValue.substring(startLength - 1) === '%' &&
          item.endValue.substring(endLength - 1) === '%') {
            suffix = '%';
      }
      // console.log('suffix: ' + suffix);
      // console.log('suffix-length: ' + suffix.length);
      var start = item.startValue.substring(0, startLength - suffix.length);
      // console.log('start: ' + start);
      var end = item.endValue.substring(0, endLength - suffix.length);
      // console.log('end: ' + end);
      var value = animate.interpolateNumber(start, end, fraction);
      // console.log('value: ' + value);
      item.element.style[property] = value + suffix;
    } else if (item.attribute == 'text') {
        var value = animate.interpolateNumber(item.startValue, item.endValue,
                                              fraction);
        item.element.textContent = Math.round(value);
    } else if (item.attribute == 'fill' || item.attribute == 'stroke') {
        var value = animate.interpolateColor(item.startValue, item.endValue,
                                             fraction);
        item.element.setAttribute(item.attribute, value);
    } else if (item.attribute == 'scale') {
        var value = animate.interpolateMatrix(item.startValue, item.endValue,
                                              fraction);
        item.element.setAttribute('transform', value);
    } else {
        var value = animate.interpolateNumber(item.startValue, item.endValue,
                                              fraction);
        item.element.setAttribute(item.attribute, value);
    }
}

animate.stepQueue = function(currentTime) {
    if (animate.startTime == null) {
        animate.startTime = currentTime;
    }
    var elapsedTime = currentTime - animate.startTime;
    var toRemove = [];
    for (var i = 0; i < animate.queue.length; i++) {
        if (i >= animate.queue.length) {
            break;
        }
        var item = animate.queue[i];
        if (elapsedTime < item.startTime) {
            continue;
        } if (elapsedTime > item.endTime) {
            animate.stepItem(item, 1.0);
            toRemove.push(i);
        }
        var duration = item.endTime - item.startTime;
        var progress = elapsedTime - item.startTime;
        var fraction = progress / duration;
        animate.stepItem(item, fraction);
    }
    for (var i = 0; i < toRemove.length; i++) {
        animate.queue.splice(toRemove[i], 1);
    }
    if (animate.queue.length > 0) {
        window.requestAnimationFrame(animate.stepQueue);
    } else {
        animate.startTime = null;
        animate.queue = [];
    }
}

animate.runWhenDone = function(toRunWhenDone) {
    // console.log('runwhendone');
    if (animate.startTime != null) {
        // console.log('wait');
        setTimeout(function() {animate.runWhenDone(toRunWhenDone);}, 100);
    } else {
        // console.log('done');
        setTimeout(toRunWhenDone, 0);
    }
}

//------------------------------------------------------------------------------
// Public Functions
//------------------------------------------------------------------------------

animate.addToQueue = function(element, attribute, startValue,
                              endValue, startTime, endTime) {
    if (animate.startTime != null) {
        animate.finish();
    }
    animate.queue.push({element: element,
                        attribute: attribute,
                        startValue: startValue,
                        endValue: endValue,
                        startTime: startTime,
                        endTime: endTime});
}

animate.finish = function() {
    if (animate.startTime == null || animate.queue.length == 0) {
        return;
    }
    for (var i = 0; i < animate.queue.length; i++) {
        var item = animate.queue[i];
        animate.stepItem(item, 1.0);
    }
    animate.startTime = null;
    animate.queue = [];
}

animate.start = function(toRunWhenDone) {
    if (animate.startTime != null) {
        animate.finish();
    }
    var animationDuration = 0;
    for (var i = 0; i < animate.queue.length; i++) {
        if (animate.queue[i].endTime > animationDuration) {
            animationDuration = animate.queue[i].endTime;
        }
    }
    window.requestAnimationFrame(animate.stepQueue);
    if (toRunWhenDone != null) {
        setTimeout(function() {animate.runWhenDone(toRunWhenDone);},
                   animationDuration);
    }
}
