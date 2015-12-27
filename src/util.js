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

Util.base64 = function(mimeType, base64) {
  return 'data:' + mimeType + ';base64,' + base64;
};

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
Util.ua = (function() {
  var ua = {
    browser: {},
    os: {},
    device: {}
  };

  // User agent.
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
  ua.device.Note4 = (ua.os.android && ua.name.indexOf('samsung sm-n910c') >= 0);

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
 * Polyfill array.filter
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 */
 if (!Array.prototype.filter) {
   Array.prototype.filter = function(fun/*, thisArg*/) {
     'use strict';

     if (this === void 0 || this === null) {
       throw new TypeError();
     }

     var t = Object(this);
     var len = t.length >>> 0;
     if (typeof fun !== 'function') {
       throw new TypeError();
     }

     var res = [];
     var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
     for (var i = 0; i < len; i++) {
       if (i in t) {
         var val = t[i];

         // NOTE: Technically this should Object.defineProperty at
         //       the next index, as push can be affected by
         //       properties on Object.prototype and Array.prototype.
         //       But that method's new, and collisions should be
         //       rare, so use the more-compatible alternative.
         if (fun.call(thisArg, val, i, t)) {
           res.push(val);
         }
       }
     }

     return res;
   };
 }

 /**
  * Polfill CustomEvent for IE 9, 10, 11.
  * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
  */
  (function () {
    // IE gives a false positive, so detect it here so we don't replace native CustomEvent.
    //if (!window.CustomEvent || Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject) {
    if(window.location.hash = !!window.MSInputMethodContext && !!document.documentMode) {
      // is IE11
      function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
    }
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
      } // end of get.
    });
  }

  /*
   * A keypress handler for browsers not implementing
   * fullscreen API. Note that IE11 will ignore keydowns if
   * the Console is visible.
  */
  var escHandler = function(e) {
    if(e.keyCode == 27) {
        e.stopImmediatePropagation();
        document.exitFullscreen();
    }
  };

  /*
   * Polyfill requestFullscreen method.
   * Edge goes fullscreen, regardless of element's CSS.
   * Webkit leaves CSS styles IN PLACE
   * Firefox goes fullscreen, regardless of element's CSS.
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
        console.log('invalid iframe, setting fullscreenElement to NULL');
        document.fullscreenElement = null;
        return;
      }

      // Assign fullscreen element.
      if(document.fullscreenElement === null) {
        document.fullscreenElement = this;
      }

      // Assign listener for escape key pressed.
      document.addEventListener('keydown', escHandler, false);

      // Always add the fullscreen class to the element, since implementions differ.
      console.log('adding fullscreen class:' + Util.fullscreenClass);
      this.classList.add(Util.fullscreenClass);

      var event = new Event('fullscreenchange');

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
     * this toggle variable is necessary to update document.fullscreenElement when it is triggered
     * via pressing the escape key, in browsers using mozFullScreenElement,
     * msFullscreenElement, or webkitFullscreenElement
     */
    var toFS = 'true';

    /*
     * Polyfill fullscreenchange event.
     */
    var screenChange = function(e) {
      e.stopImmediatePropagation();
      if(toFS === 'true') { //normal to fullscreen
        document.fullscreenElement = e.target;
        toFS = 'false';
      } else { //fullscreen to normal
        toFS = 'true';
        document.fullscreenElement = null;
      }
      console.log('dispatching fullscreenchange in screenChange, toggle:' + toFS)
      var bob = document.fullscreenElement;
      console.log('bob is a type:' + typeof bob + ' and value:' + bob)
      var event = new CustomEvent('fullscreenchange', e);
      document.dispatchEvent(event);
    };
    document.addEventListener('webkitfullscreenchange', screenChange);
    document.addEventListener('mozfullscreenchange', screenChange);
    document.addEventListener('MSFullscreenChange', screenChange); // Does not exist in edge

    /*
     * Polyfill exitFullscreen function.
     * FF nightly doesn't reset the background of the page.
    */
    document.exitFullscreen = document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen ||
      function (d) {
        d.d = true;
        if(document.fullscreenEnabled === true) {
          document.removeEventListener('keydown', escHandler, false);
          var event = new CustomEvent('fullscreenchange');
          if (typeof document.onfullscreenchange == 'function') {
            document.onfullscreenchange(event);
          } else {
            document.dispatchEvent(event);
          }
        }
      };

    // Error handling.
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

module.exports = Util;
