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
        for (i in names) {
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
    * Detect support for .classList
    */
    var detectQuerySelectorAll_ = function() {
      return !!document.querySelectorAll;
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
   * Detect localStorage support.
   * Similar to Modernizr test.
   */
var detectLocalStorage_ = function() {
  var mod = 'test';
  try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
    } catch(e) {
        return false;
    }

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

  /*
   * Microloader. Store polyfills to load. Deliberately old-school for maximum browser support.
   * After: https://css-tricks.com/snippets/javascript/async-script-loader-with-callback/
   * https://www.nczonline.net/blog/2009/07/28/the-best-way-to-load-external-javascript/
  */
  var load = function(scripts, callback, progressFn, failFn) {
    this.head = document.getElementsByTagName('head')[0] || document.documentElement;
    this.loadCount = 0;
    this.totalRequired = scripts.length;
    this.callback = callback;
    this.progressFn = progressFn;
    this.failFn = failFn;
    var self = this;

    var err_ = function(s) {
      console.log('loader in err_ function, failed to load:' + s.src);
      if(self.failFn) {
        self.failFn(s, self.loadCount);
      }
    };

    // Check loading progress, callback when complete.
    var loaded = function(s) {

      console.log(self.loadCount + ' of ' + self.totalRequired + ' scripts loaded, path:' + s.src);

      if (s.onreadyState) {
        if (s.readyState === 'loaded' || s.readyState === 'complete') {
          // IE completion hack.
          // http://stackoverflow.com/questions/6946631/dynamically-creating-script-readystate-never-complete/18840568#18840568
          var currState = s.readyState;
          s.children;
          if (currState == 'loaded' && s.readyState == 'loading') {
            // custom error code
            self.err_(s);
          }
          self.loadCount++;
        }
      } else {
        self.loadCount++;
      }

      if (typeof self.progressFn == 'function') {
        // Precent loaded.
        self.progressFn(parseInt(100 * self.loadCount / self.totalRequired));
      }

      // Run callback, or run progress function, if present.
      if (self.loadCount == self.totalRequired && typeof self.callback == 'function') {
        console.log('JS loading complete');
        self.callback.call();
      }

      // Null script to prevent memory leaks.
      s.onload = s.onreadystatechange = null;
      if (this.head && s.parentNode) {
        this.head.removeChild(s);
      }

    }; // End of loaded.

    // Load the scripts in an async way.
    var queueScripts = function(src) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.charset = 'utf8';
      s.async = true;
      s.src = src;
      if (s.onreadystatechange) { // Separate since IE 9, 10 have both defined.
        console.log('ie script loader');
        s.onreadystatechange = function() {
          console.log('running ie loader for:' + s.src);
          loaded(s);
        };
      } else if (s.onload !== undefined) {
        console.log('regular script loader for:' + s.src);
        s.onload = function() {
          console.log('running standard loader for:' + s.src);
          loaded(s);
        };
        s.onerror = function() {
          console.log('error loading:' + s.src);
          err_(s);
        };
      }
      // Add script to document.head.
      //console.log('self.head is a:' + self.head)
      self.head.insertBefore(s, self.head.firstChild);
    }; // End of queueScripts.

    // Initialize progress
    if (self.progressFn) {
      self.progressFn(0);
    }

    // Queue the necessary scripts (required polyfills and libraries).
    var runQueue = function () {
    var notNeeded = 0;
    for (var i = 0; i < self.totalRequired; i++) {
      var nm = scripts[i].name;
      //console.log('checking ' + nm);
      if (FeatureDetector[nm] !== undefined && FeatureDetector[nm] === true) {
        console.log(nm + ' does not need a polyfill');
        notNeeded++;
        continue;
      }
      console.log('queueing script: ' + nm + ' #' + i + ':' + scripts[i].poly);
      queueScripts(scripts[i].poly);
    }
    self.totalRequired -= notNeeded;
  };
  runQueue();

  //TODO: nest multiple queues to get script loading order.

  }; // End of microloader.

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
      querySelectorAll: detectQuerySelectorAll_(),
      defineproperty: detectDefineProperty_(),
      defineproperties: detectDefineProperties_(),
      promise: detectPromise_(),
      localStorage: detectLocalStorage_(),
      fullscreen: detectFullscreen_(),
      orientation: detectEventSupport_(window, 'deviceorientation'), //detectOrientationSupport_(),
      devicemotion: detectEventSupport_(window, 'devicemotion'), //detectMotionSupport_(),
      touch: detectTouchSupport_(),
      webVR: detectWebVR_(),
      requestAnimationFrame: detectRequestAnimationFrame_(),
      load: load
    };
  };

  // Run our detector script (which returns an object).
  return detect();

})();
