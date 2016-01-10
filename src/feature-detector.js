/*
 * Device and feature detector for the boilerplate.
 *
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

/*
 * Detects devices and features, interface matches THREE Detector.js object, but
 * with additional feature detects (e.g. Promise).
 * Polyfills:
 * https://github.com/inexorabletash/polyfill/tree/5c070ddef1b7ecf741567a37ffd3ac5658dd9683
 */

var FeatureDetector = (function() {
  var cs, ctx;

  /*
   * Feature detection.
   *
   * Our feature detectors are wrapped in named functions so they
   * can be re-tested after loading polyfills.
   */

  /*
   * Test for HTML5 canvas.
   * No compatible polyfill (Flash-based ones won't work).
   */
  var detectCanvas_ = function() {
    return !!window.CanvasRenderingContext2D;
  };

  /*
   * Test for WebGL enabled.
   * IE 9, 10 Polyfill: https://github.com/iewebgl/iewebgl
   */
  var detectWebGL_ = function() {
    if (detectCanvas_()) {
        cs = document.createElement('canvas');
        var names = ['3d', 'webgl', 'experimental-webgl', 'experimental-webgl2', 'moz-webgl'];
        for(i in names) {
          try {
            ctx = cs.getContext(names[i]);
            if (ctx && typeof ctx.getParameter == 'function') {
              cs = ctx = null;
              return true;
            }
          } catch (e) {}
        }
    }
    return false;
  };

  /*
   * Detect support for WebWorkers.
   */
   var detectWorkers_ = function() {
     return !!window.Worker;
   };

   var detectFileAPI_ = function() {
     return !!(window.File && window.FileReader && window.FileList && window.Blob);
   };

  /*
   * Detect support for addEventListener.
   * Polyfills available.
   */
  var detectEventListener_ = function() {
    return ('addEventListener' in window);
  };

  /*
   * Detect support for an event.
   * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
   */
  var detectEventSupport_ = function(elem, eventName) {
    eventName = 'on' + eventName;
    var isSupported = (eventName in elem);
    if (!isSupported && 'setAttribute' in elem) {
      elem.setAttribute(eventName, 'return;');
      isSupported = typeof elem[eventName] == 'function';
      elem.removeAttribute(eventName);
    }
    return isSupported;
  };

  /*
   * Support for ES5 properties.
   * Polyfill available:
   */
  var detectDefineProperty_ = function () {
    return ('defineProperty' in Object);
  };

  var detectDefineProperties_ = function() {
    return ('defineProperties' in Object);
  };

  /*
   * Detect typed arrays (needed for WebGL).
   * Polyfill available:
   */
  var detectTypedArray_ = function() {
    return ('ArrayBuffer' in window);
  };

  /*
   * Detect Promise object support.
   * Polyfill available:
   */
  var detectPromise_ = function() {
    return ('Promise' in window);
  };

  /*
   * Detect support for W3C Fullscreen API. Browsers with
   * vendor prefixes need to be polyfilled.
   */
  var detectFullscreen_ = function() {
    return !!(document.documentElement.requestFullscreen);
  };

  /*
   * Detect touch support (useful for changing the Ui if touch is used).
   */
  var detectTouchSupport_ = function() {
    return !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));
  };

  /*
   * Detect native support for requestAnimationFrame
   * Polyfills available.
   */
  var detectRequestAnimationFrame_ = function() {
    return ('requestAnimationFrame' in window);
  };

  /*
   * Test for WebVR
   * Polyfill for desktops: https://github.com/borismus/webvr-polyfill
   */
  var detectWebVR_ = function() {
    if ('getVRDevices' in navigator || 'mozGetVRDevices' in navigator) {
      console.log('found getVRDevices in navigator');
      return true;
    } else if (window.HMDVRDevice) {
      console.log('found window.HMDVRDevice');
      return true;
    }
    else {
      return false;
    }
  };

  // Detect features. Export so we can re-detect after polyfills are loaded.
  var detect = function() {
    return {
      // Individual feature detects.
      addEventListener: detectEventListener_(),
      canvas: detectCanvas_(),
      typedArray: detectTypedArray_(),
      webgl: detectWebGL_(),
      workers: detectWorkers_(),
      fileapi: detectFileAPI_(),
      defineproperty: detectDefineProperty_(),
      defineproperties: detectDefineProperties_(),
      promise: detectPromise_(),
      fullscreen: detectFullscreen_(),
      orientation: detectEventSupport_(window, 'deviceorientation'), //detectOrientationSupport_(),
      devicemotion: detectEventSupport_(window, 'devicemotion'), //detectMotionSupport_(),
      touch: detectTouchSupport_(),
      webVR: detectWebVR_(),
      requestAnimationFrame: detectRequestAnimationFrame_()
    };
  };

  // Run our detector script (which returns an object).
  return detect();

})();
