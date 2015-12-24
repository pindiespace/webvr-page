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
 * This user-agent test is only for things NOT picked up in the feature-detection
 * part of the boilerplate.
 *
 * Drawn from several sources
 * https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js
 * http://detectmobilebrowsers.com/
 * https://github.com/hgoebl/mobile-detect.js/blob/master/mobile-detect.js
 * https://github.com/serbanghita/Mobile-Detect/blob/master/Mobile_Detect.php
 * https://mobiforge.com/research-analysis/webviews-and-user-agent-strings
 * http://stackoverflow.com/questions/14403766/how-to-detect-the-stock-android-browser
 * https://github.com/serbanghita/Mobile-Detect/blob/master/Mobile_Detect.php#L274
 * http://cpansearch.perl.org/src/MAMOD/HTTP-UA-Parser-0.005/lib/HTTP/UA/Parser/regexes.yaml
 * https://udger.com/resources/ua-list/device-detail?device=Smart%20TV
 */
Util.ua = (function(complete) {
  var ua = {
    browser: {},
    os: {},
    device: {}
  };
  ua.name = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

  // OS detects
  ua.os.ios = /(iphone|ipad|ipod)/i.test(ua.name);
  ua.os.crios = /(cros|crmo)/i.test(ua.name);
  ua.os.mac = ua.name.indexOf('mac os x') >= 0;
  ua.os.linux = ua.name.indexOf('linux') >= 0;
  ua.os.windows = ua.name.indexOf('windows') >= 0;
  ua.os.android = ua.name.indexOf('android') >= 0;
  ua.os.blackberry = /(blackberry|bb10|rim[0-9])/i.test(ua.name);
  ua.os.firefoxOS = /mobile.*(firefox)/i.test(ua.name);

  // General device detects.
  ua.device.mobile = ua.os.ios || ua.os.android || (/mobi|ip(hone|od|ad)|touch|blackberry|bb10|windows phone|kindle|silk|htc|(hpw|web)os|opera mini|fxios/i.test(ua.name));
  ua.device.tablet = /ipad|tablet|nexus[\s]+(7|9|10)|playbook|silk|ideapad|slate|touchpad|playbook|toshiba|xoom/i.test(ua.name);
  ua.device.console = /(nintendo|wiiu|3ds|playstation|xbox)/i.test(ua.name);
  ua.device.tv = /crkey|(google|apple|smart|hbb|opera).*tv|(lg|aquos|inettv).*browser|roku|espial/i.test(ua.name);

  // Specific device tests may be added as needed here.
  // Galaxy Note5, Galaxy S6, Galaxy S6 Edge, Galaxy S6 Edge+
  // https://github.com/serbanghita/Mobile-Detect/blob/master/Mobile_Detect.php
  // https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js
  // https://github.com/hgoebl/mobile-detect.js/blob/master/mobile-detect.js#L292
  ua.device.note4 = (ua.os.android && ua.name.indexOf('samsung sm-n910c') >= 0);

  // Specific Browser detects when feature-detection isn't enought.
  ua.browser.ie = (ua.name.indexOf('msie') >= 0 || ua.name.indexOf('trident') >= 0);
  ua.browser.ie11 = /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(ua.name); //only version of IE supporting WebGL
  ua.browser.edge = ua.name.indexOf('edge') >= 0;
  ua.browser.safari = (ua.name.indexOf('safari') >= 0 && !ua.name.indexOf('chrome') >= 0);
  ua.browser.chrome = ua.name.indexOf('chrome') >= 0;
  ua.browser.amazon = ua.name.indexOf('silk') >= 0;
  ua.browser.firefox = ua.name.indexOf('firefox') >= 0;
  ua.browser.opera = ua.name.indexOf('opr/') >= 0; //new opera webkit
  return ua;
})();

/**
 * Add recommended fullscreen styles.
 * https://wiki.mozilla.org/Gecko%3aFullScreenAPI#onfullscreenchange_attribute
 * https://blog.idrsolutions.com/2014/01/adding-fullscreen-using-javascript-api/
 * http://www.sitepoint.com/html5-full-screen-api/
 *
 */
Util.fullscreenClass = (function(fullscreenClass) {
  var head = document.querySelector('head');
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

  // Polyfill the escape keypress handler.
  var escHandler = function(e) {
    console.log('in exitfullscreen keypress');
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

  /*
   * Set the fullscreen enabled flag. To make this
   * work on Mobile Safari, we need to manually test
   * if we satisfy the conditions for fullscreen (all iframes
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
                window.ifs = iframes;
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
      }
    });
  }

  /*
   * Polyfill requestFullscreen method.
   * Edge goes fullscreen, regardless of element's CSS.
   * Webkit leaves CSS styles IN PLACE
   * Firefox goes fullscreen, regardless of element's CSS.
   */
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
      console.log('adding fullscreen class:' + Util.fullscreenClass);
      this.classList.add(Util.fullscreenClass);
      // Create and send a (custom fullscreenchange) event.
      var event = new CustomEvent('fullscreenchange');
      event.target = this;
      // Handle bound onfullscreenchange function.
      if (typeof document.onfullscreenchange == 'function') {
        console.log('dispatching from onfullscreenchange in requestFullscreen');
        ////////document.onfullscreenchange(event);
      } else {
        console.log('dispatching fullscreenchange in requestFullscreen');
        document.dispatchEvent(event);
      }
    };

    /*
     * Polyfill fullscreenchange event.
     */
    var screenChange = function(e) {
      e.stopImmediatePropagation();
      if(e.type !== 'fullscreenchange') {
        console.log('dispatching fullscreenchange in screenChange')
        var event = new CustomEvent('fullscreenchange', e);
        document.dispatchEvent(event);
      }
    }
    document.addEventListener('webkitfullscreenchange', screenChange);
    document.addEventListener('mozfullscreenchange', screenChange);
    document.addEventListener('MSFullscreenChange', screenChange); // Does not exist in edge

    /*
     * Polyfill exitFullscreen exit function.
     * FF nightly doesn't reset the background of the page.
     * Edge exits correctly.
     * Chrome, Opera exit correctly.
    */
    document.exitFullscreen = document.exitFullscreen ||
    document.msExitFullscreen ||
    document.mozCancelFullScreen ||
    document.webkitExitFullscreen ||
    function() {
      console.log('in exitfullscreen polyfill fn');
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

    // Error handling event.
    var screenError = function(e) {
      console.log("fullscreenError in screenError");
      e.stopImmediatePropagation();
      		var event = new CustomEvent('fullscreenerror', e);
      		document.dispatchEvent(event);
    };
    document.addEventListener('webkitfullscreenerror', screenError, false);
    document.addEventListener('mozfullscreenerror', screenError, false);
    document.addEventListener('MSFullscreenError', screenError, false);

  return function() {
    return document.fullscreenEnabled
  };
})();

module.exports = Util;
