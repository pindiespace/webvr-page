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

// Execute a prefixed command.
Util.executePrefixed = function(element, pfx, cmd) {
  if(element[cmd]) {
    console.log('executing:' + cmd);
    element[cmd]();
  } else {
    if(element[pfx + cmd]) {
      console.log('executing:' + pfx + cmd);
      element[pfx + cmd]();
    }
  }
};

Util.getPrefixed = function(element, pfx, prop) {
  if(element[prop]) {
    console.log('using property:' + prop);
    return element[prop];
  } else {
    if (element[pfx + prop]) {
      console.log('using property:' + pfx + prop);
      return element[pfx + prop];
    }
  }
  return null;
};

// See if we're running in an iframe.
Util.isIFrame = function() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
};

// Cryptography used for UUID generation.
Util.hasCrypto = (typeof(window.crypto) != 'undefined' &&
  typeof(window.crypto.getRandomValues) != 'undefined');

// Get an RFC-compliant UUID, use crypto if possible.
// http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
Util.getUUID = Util.hasCrypto ?
  function() {
    // If we have a cryptographically secure PRNG, use that.
    // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
    var buf = new Uint16Array(8);
    var crypto = (window.crypto || window.msCrypto);
    crypto.getRandomValues(buf);
    var S4 = function(num) {
      var ret = num.toString(16);
      while(ret.length < 4){
        ret = "0"+ret;
      }
    return ret;
    };
    // Assemble the GUID.
    return (S4(buf[0])+S4(buf[1])+"-"+S4(buf[2])+"-"+S4(buf[3])+"-"+S4(buf[4])+"-"+S4(buf[5])+S4(buf[6])+S4(buf[7]));
  } // End of crypto version.

  :
  // fast Math.random
  function b(a){
    console.warn('Warning - GUID not cryptographically secure');
    return a?(a^Math.random()*16>>a/4).toString(16):([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,b)
  }; // End of Math.random version.

// Get a unique, incrementing Id value with a prefix for any object on the page.
Util.getUniqueIncrementingId = (function(prefix) {
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

// Convert to base64.
Util.base64 = function(mimeType, base64) {
  return 'data:' + mimeType + ';base64,' + base64;
};

// Wrapper for checking if CSS class exists.
Util.hasClass = function(elem, className) {
  if (elem.classList) {
    return elem.classList.contains(className);
  } else if (elem.className.indexOf(className) >= 0) {
    return true;
  }
  return false;
};

// Wrapper for adding a CSS class to an element.
Util.addClass = function(elem, className) {
  if (elem.classList) {
    elem.classList.add(className);
  } else if (!this.hasClass(elem, className)) {
    if (elem.className == '') {
      elem.className = className;
    } else {
      elem.className += ' ' + className;
    }
  }
};

// Wrapper for removing CSS class.
Util.removeClass = function(elem, className) {
  if (elem.classList) {
    elem.classList.remove(className);
  } else if (this.hasClass(elem, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    elem.className = elem.className.replace(reg, ' ')
  }
};

// Get immediate children of an element by element tag name.
Util.getChildrenByTagName = function(elem, tagName) {
  var arr = [], c = elem.children, len = c.length;
  var t = tagName.toUpperCase();
  for (var i = 0; i < len; i++) {
    if (t == c[i].tagName) {
      arr.push(c[i]);
    }
  }
  return arr;
};

/**
 * Add recommended fullscreen styles.
 * https://wiki.mozilla.org/Gecko%3aFullScreenAPI#onfullscreenchange_attribute
 * https://blog.idrsolutions.com/2014/01/adding-fullscreen-using-javascript-api/
 * http://www.sitepoint.com/html5-full-screen-api/
 */
Util.fullscreenClass = (function(fullscreenClass) {
  var head = document.getElementsByTagName('head')[0];
  var s = document.createElement('style');
  s.type = 'text/css';
  s.id = 'webvr-util-fullscreen-style';
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
    ' background:black !important;\n' +
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

// Check if program is in fullscreen mode (document.fullscreenElement polyfilled below).
Util.isFullScreen = function() {
  if(document.fullscreenElement || window.navigator.standalone) {
    return true;
  }
  return false;
};

// Check if program is running in standalone mode.
Util.isAppMode = function() {
  return !!window.navigator.standalone;
};

/**
 * normalize fullscreen API.
 * This isn't a true polyfill since we alter behavior of the standard
 * Fullscreen API in webkit browsers.
 * Adapted from:
 * @link https://github.com/ethanius/fullscreen-api
 * @link http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
 */
(function() {
  var hasStyles = false;

  // Set the fullscreenElement to null (even if it exists).
  document.fullscreenElement = null;

  /*
   * Set the function checking if fullscreen is enabled.
   * Enable if we satisfy the conditions for fullscreen (all iframes
   * have allowfullscreen attribute, no plugins in window).
   */
  if (!('fullscreenEnabled' in document)) {
    Object.defineProperty(document, 'fullscreenEnabled', {
      get: function() {
        return document.msFullscreenEnabled ||
          document.mozFullScreenEnabled ||
          document.webkitFullscreenEnabled ||
          (function() {
            console.log('entering fullscreenEnabled polyfill function')
            var iframes = document.getElementsByTagName('iframe');
            // All iframe elements must have .allowfullscreen attribute set.
            for (var i = 0; i < iframes.length; i++) {
              console.log('trying iframe number:' + i)
              if (!iframes[i].allowfullscreen) {
                console.log('found an iframe');
                return false;
              }
            }
            // No windowed plugins.
            return true;
          })();
      } // end of get.
    });
  }

  /*
   * A keypress handler for browsers not implementing
   * fullscreen API. Note that IE11 will ignore keydowns if
   * the Console is visible.
  */
  var escHandler = function(e) {
    if (e.keyCode == 27) {
        e.stopImmediatePropagation();
        document.exitFullscreen();
    }
  };

  /*
   * Polyfill requestFullscreen method.
   * hmd = head-mounted device {vrDisplay: this.hmd}
   */
  Element.prototype.requestFullscreen = Element.prototype.requestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.mozRequestFullScreen ||
    Element.prototype.msRequestFullscreen ||
    function(hmd) {
      console.log('in requestFullscreen() polyfill');
      // IFRAME needs 'allowfullscreen' attribute set for fullscreen
      console.log('IN REQUESTFULLSCREEN, fullscreen element set to:'+ ('fullscreenElement' in document) + ' and typeof:' + typeof document.fullscreenElement + ' and value:' + document.fullscreenElement)

      if (this.nodeName === 'IFRAME' && !this.allowfullscreen) {
        console.Error('invalid iframe, setting fullscreenElement to NULL');
        document.fullscreenElement = null;
        return;
      }

      // Assign fullscreen element.
      if (document.fullscreenElement === null) {
        document.fullscreenElement = this;
      }

      // Assign listener for escape key pressed.
      document.addEventListener('keydown', escHandler, false);

      // Always add the fullscreen class to the element, since implementions differ.
      console.log('adding fullscreen class:' + Util.fullscreenClass);
      Util.addClass(this, Util.fullscreenClass);
      //this.classList.add(Util.fullscreenClass);

      // Create and send a (custom fullscreenchange) event.
      var event = new CustomEvent('fullscreenchange');

      // Handle bound onfullscreenchange function.
      if (typeof document.onfullscreenchange == 'function') {
        console.log('dispatching from onfullscreenchange in requestFullscreen');
      } else {
        console.log('dispatching fullscreenchange in requestFullscreen');
        document.dispatchEvent(event);
      }
    }; //end of requestFullscreen.

    /*
     * this toggle variable is necessary to update document.fullscreenElement
     * when it is triggered via pressing the escape key. Most browsers
     * automatically exit on escape keypress,  without providing
     * a handler we can use.
     */
    var toFS = 'true';

    /*
     * Polyfill fullscreenchange event.
     */
    var screenChange = function(e) {
      e.stopImmediatePropagation();
      if (toFS === 'true') { // Normal to fullscreen.
        document.fullscreenElement = e.target;
        toFS = 'false';
      } else { // Fullscreen to normal.
        toFS = 'true';
        document.fullscreenElement = null;
      }
      console.log('dispatching fullscreenchange in screenChange, toggle:' + toFS)
      var bob = document.fullscreenElement;
      //console.log('bob is a type:' + typeof bob + ' and value:' + bob)
      var event = new CustomEvent('fullscreenchange', e);
      document.dispatchEvent(event);
    };
    document.addEventListener('webkitfullscreenchange', screenChange);
    document.addEventListener('mozfullscreenchange', screenChange);
    document.addEventListener('MSFullscreenChange', screenChange); // Does not exist in edge

    /*
     * Polyfill exitFullscreen function.
    */
    document.exitFullscreen = document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen ||
      function (d) {
        if (document.fullscreenEnabled === true) {
          document.removeEventListener('keydown', escHandler, false);
          var event = new CustomEvent('fullscreenchange');
          if (typeof document.onfullscreenchange == 'function') {
            document.onfullscreenchange(event);
          } else {
            document.dispatchEvent(event);
          }
        }
      };

    /*
     * Error handling.
     */
    var screenError = function(e) {
      console.error('A fullscreen request error has occurred');
      e.stopImmediatePropagation();
      var event = new CustomEvent('fullscreenerror', e);
      document.dispatchEvent(event);
    };
    document.addEventListener('webkitfullscreenerror', screenError, false);
    document.addEventListener('mozfullscreenerror', screenError, false);
    document.addEventListener('MSFullscreenError', screenError, false);
})();

// Removes numbers from string (use for building Ids and classes)
Util.parseText = function(str) {
  return str.replace(/[0-9]/g, '');
};

// From http://goo.gl/4WX3tg
Util.getQueryParameter = function(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

// Check if we are in landscape mode
Util.isLandscapeMode = function() {
  return (window.orientation == 90 || window.orientation == -90);
};

// Get screen width, in real pixels.
Util.getScreenWidth = function() {
  return Math.max(window.screen.width, window.screen.height) *
      window.devicePixelRatio;
};

// Get screen height, in real pixels.
Util.getScreenHeight = function() {
  return Math.min(window.screen.width, window.screen.height) *
      window.devicePixelRatio;
};

// Get element width in CSS pixels, as a number.
Util.getElementWidth = function(elem) {
  var w;
  if (elem.style.clip) {
    w = elem.style.clip.width;
  } else if (elem.style.pixelWidth) {
      w = elem.style.pixelWidth;
  } else {
    w = elem.offsetWidth;
  }
  return parseFloat(w);
};

// Get element height in CSS pixels, as a number.
Util.getElementHeight = function(elem) {
  var h;
  if (elem.style.clip) {
    h = elem.style.clip.height;
  } else if (elem.style.pixelHeight) {
    h = elem.style.pixelHeight;
  } else {
    h = elem.offsetHeight;
  }
  return parseFloat(h);
};

// Math function wrapper.
Util.radToDeg = function(rads) {
  if(THREE && THREE.Math) {
      return THREE.Math.radToDeg(rads);
  }
  console.error('radToDeg not supported by your 3d library');
  return 0;
};

Util.degToRad = function(degs) {
  if(THREE && THREE.Math) {
    return THREE.Math.degToRad(degs);
  }
  console.error('degToRad not supported by your 3d library');
  return 0;
};

/**
 * Utility to convert the projection matrix to a vector accepted by the shader.
 *
 * @param {Object} opt_params A rectangle to scale this vector by.
 */
Util.projectionMatrixToVector_ = function(matrix, opt_params) {
  var params = opt_params || {};
  var xScale = params.xScale || 1;
  var yScale = params.yScale || 1;
  var xTrans = params.xTrans || 0;
  var yTrans = params.yTrans || 0;

  var elements = matrix.elements;
  var vec = new THREE.Vector4();
  vec.set(elements[4*0 + 0] * xScale,
          elements[4*1 + 1] * yScale,
          elements[4*2 + 0] - 1 - xTrans,
          elements[4*2 + 1] - 1 - yTrans).divideScalar(2);
  return vec;
};

Util.leftProjectionVectorToRight_ = function(left) {
  //projectionLeft + vec4(0.0, 0.0, 1.0, 0.0)) * vec4(1.0, 1.0, -1.0, 1.0);
  var out = new THREE.Vector4(0, 0, 1, 0);
  out.add(left); // out = left + (0, 0, 1, 0).
  out.z *= -1; // Flip z.

  return out;
};

module.exports = Util;
