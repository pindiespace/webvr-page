/**
 * Util.js - adapted from webvr-boilerplate
 * @link https://github.com/borismus/webvr-boilerplate
 *
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Util = {};

// Get a unique, incrementing Id value for any object on the page.
Util.getUniqueId = (function(prefix) {
  var i = Math.floor(Math.random() * 999) + 100;
  var pfx = prefix || '';
  function inc(pfx) {
    if (!pfx) {
      pfx = '';
    } else {
      pfx += '-';
    }
    return pfx + i++;
  }
  return inc;
})();

/**
 * Add recommended fullscreen stles.
 * https://wiki.mozilla.org/Gecko%3aFullScreenAPI#onfullscreenchange_attribute
 */
Util.fullScreenClass = (function(fullscreenClass) {
  var head = document.querySelector('head');
  var s = document.createElement('style');
  s.type = 'text/css';
  s.id = 'fullscreen';
  var rules =
    '.' + fullscreenClass + ' {\n' +
     /* override mapped width and height attributes */
    '	position: fixed !important;\n' +
    '	box-sizing: border-box !important;\n' +
    '	width: 100% !important;\n' +
    '	height: 100% !important;\n' +
    '	margin: 0 !important;\n' +
    '	left: 0 !important;\n' +
    '	top: 0 !important;\n' +
    ' right:0 !important;\n' +
    ' bottom:0 !important;\n' +
    '	z-index: 2147483647 !important;\n' +
    ' background:black;\n' +
    '}\n';
  if (s.styleSheet) {
    s.styleSheet.cssText = rules;
  } else {
    var ruleNode = document.createTextNode(rules);
    s.appendChild(ruleNode);
  }
  head.appendChild(s);
  return fullscreenClass;
})('polyfill-full-screen');

// Check if program is in fullscreen mode (polyfilled below).
Util.isFullScreen = function() {
  if(document.fullscreenElement === null) {
    return false;
  }
  return true;
};

/**
 * normalize fullscreen API.
 * Adapted from:
 * @link https://github.com/ethanius/fullscreen-api
 */
Util.setFullscreen = (function() {
  var hasStyles = false;

  // Polyfill the escape handler
  var escHandler = function(e) {
		if (e.keyCode == 27) {
			e.stopImmediatePropagation();
			document.exitFullscreen();
		}
  };

  // Check for presence of fullscreenElement.
  if (!('fullscreenElement' in document)) {
    Object.defineProperty(document, 'fullscreenElement', {
      get: function() {
        return document.mozFullScreenElement ||
               document.msFullscreenElement ||
               document.webkitFullscreenElement ||
               null;
      }
    });
  }

  // Set the fullscreen enabled flag.
  if (!('fullscreenEnabled' in document)) {
    Object.defineProperty(document, 'fullscreenEnabled', {
      get: function() {
        return document.msFullscreenEnabled ||
              document.mozFullScreenEnabled ||
              document.webkitFullscreenEnabled ||
              false;
      }
    });
  }

  // Polyfill requestFullscreen method.
  // Edge goes fullscreen, regardless of element's CSS.
  // Webkit leaves CSS styles IN PLACE
  // Firefox goes fullscreen, regardless of element's CSS.
  if (document.fullscreenEnabled) {
    Element.prototype.requestFullscreen = Element.prototype.requestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.mozRequestFullScreen ||
    Element.prototype.msRequestFullscreen ||
    function(elem) {
      console.log('in requestFullscreen polyfill fn');
      // IFRAME needs 'allowfullscreen' attribute set for fullscreen
      if (elem.nodeName === 'IFRAME' && !elem.allowfullscreen) {
        document.fullscreenElement = null;
        return;
      }
      // Assign fullscreen element.
      if(document.fullscreenElement === null) {
        document.fullscreenElement = this;
      }
      // Assign listen for escape key pressed.
      document.addEventListener('keydown', escHandler, false);
      // Add the fullscreen class to the element.
      this.classList.add(Util.fullscreenClass);
      // Create and send a (custom fullscreenchange) event.
      var event = new CustomEvent('fullscreenchange');
      // Handle bound onfullscreenchange function.
      if (typeof document.onfullscreenchange == 'function') {
        document.onfullscreenchange(event);
      } else {
        document.dispatchEvent(event);
      }
    };

    // Polyfill fullscreenchange event routing.
    var screenChange = function(e) {
      e.stopImmediatePropagation();
      if(e.type !== 'fullscreenchange') {
        console.log('dispatching fullscreenchange')
        var event = new CustomEvent('fullscreenchange');
        document.dispatchEvent(event);
      }
    }
    document.addEventListener('webkitfullscreenchange', screenChange);
    document.addEventListener('mozfullscreenchange', screenChange);
    document.addEventListener('MSFullscreenChange', screenChange); // Does not exist in edge

    // Polyfill exitFullscreen event.
    // FF nightly doesn't reset the background of the page.
    // Edge exits correctly.
    // Chrome, opera exit correctly.
    document.exitFullscreen = document.exitFullscreen ||
    document.msExitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    function(e) {
      console.log("in exitfullscreen polyfill fn");
      if (document.fullscreenEnabled != null) {
        document.removeEventListener('keydown', escHandler, false);
        if (document.fullscreenElement) {
          document.fullscreenElement.classList.remove(Util.fullscreenClass);
          document.fullscreenElement = null;
        }
      }
      var event = new CustomEvent('fullscreenchange');
      if (typeof document.onfullscreenchange == 'function') {
        document.onfullscreenchange(event);
      } else {
        document.dispatchEvent(event);
      }
    };
  } // End of fullscreenEnabled test.
  return function() {
    return document.fullscreenEnabled
  };
})();

module.exports = Util;
