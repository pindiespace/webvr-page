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
  var self = this; // Scope.
  var cs, ctx, tests = [], retests = {}; self.results = {};

  var names = ['3d', 'webgl', 'experimental-webgl', 'experimental-webgl2', 'moz-webgl'];

  /*
   * Feature detection.
   *
   * Our feature detectors are wrapped in named functions so they
   * can be re-tested after loading polyfills.
   */

  // Client vendor prefixes.
  // https://davidwalsh.name/vendor-prefix
  tests['vendorPrefix'] = function() {
    // Get the vendor prefix for the client.
    if (!window.getComputedStyle) {
      return {
        js: '',
        css: ''
      };
    } else {
    var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
        .call(styles)
        .join('')
        .match(/-(moz|webkit|ms|o|xv)-/) || ['',''])[1]; // Default to nothing.
      return {
          js: pre,
          css: '-' + pre + '-',
        };
    }
  };

  /*
   * Test for document.createElement.
   */
  tests['createElement'] = function() {
    return !!(document.createElement);
  };

  /*
   * Test for basic HTML5 tag support.
   * From HTML5Shiv - https://github.com/aFarkas/html5shiv/blob/master/dist/html5shiv.js
   */
  tests['html5'] = function() {
    if(tests['createElement']()) {
      var a = document.createElement('a');
      a.innerHTML = '<xyz></xyz>';
      //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
      var res = ('hidden' in a);
      a = a.innerHTML = null;
      return res;
    }
    return false;
  };

  /*
   * Test for HTML5 canvas.
   * No compatible polyfill (Flash-based ones won't work).
   */
  tests['canvas'] = function() {
    return !!window.CanvasRenderingContext2D;
  };

  /*
   * Test for WebGL enabled.
   * IE 9, 10 Polyfill: https://github.com/iewebgl/iewebgl
   */
  tests['webGL'] = function() {
    if (tests['canvas']() && document.createElement) {
        cs = document.createElement('canvas');
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
    cs = ctx = null;
    return false;
  };

  /*
   * Due to program structure, it is easier to re-create the context,
   * instead of trying to set it in tests[webGL].
   */
  tests['glVersion'] = function() {
    if (tests['canvas']() && document.createElement) {
        cs = document.createElement('canvas');
        for (i in names) {
          try {
            ctx = cs.getContext(names[i]);
            if (ctx && typeof ctx.getParameter == 'function') {
              var vers = ctx.getParameter(ctx.VERSION).toLowerCase();
              cs = ctx = null;
              return vers;
            }
          } catch (e) {}
        }
    }
    cs = ctx = null;
    return false;
  };

  /*
   * Detect Promise object support.
   * Polyfill available:
   */
  tests['promise'] = function() {
    return ('Promise' in window);
  };

  /*
   * Detect support for WebWorkers.
   */
  tests['workers'] = function() {
    return !!window.Worker;
  };

  /*
   * Detect application cache.
   */
  tests['applicationCache'] = function() {
    return !!window.applicationCache;
  };

  /*
   * Detect FileAPI support.
   */
  tests['fileapi'] = function() {
    return !!(window.File && window.FileReader && window.FileList && window.Blob);
  };

  /*
  * Detect localStorage support.
  * Similar to Modernizr test.
  */
  tests['localStorage'] = function() {
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
    * Detect fetch (alternative to XHR) support.
    * https://davidwalsh.name/fetch
    * https://github.com/github/fetch
    */
  tests['fetch'] = function() {
    return ('fetch' in window);
  };

  /*
   * Detect support for .classList
   */
  tests['querySelectorAll'] = function() {
    return !!document.querySelectorAll;
  };

  /*
   * Detect support for addEventListener.
   * Polyfills available.
   */
  tests['addEventListener'] = function() {
    return ('addEventListener' in window);
  };

  /*
   * CustomEvents for IE 9, 10, 11
   */
  tests['CustomEvent'] = function() {
    try {
      new CustomEvent("test");
    } catch(e) {
      return false;
    }
    return true;
  };

  /*
   * Detect support for an event.
   * http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
   */
  var eventSupport_ = function(elem, eventName) {
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
  tests['defineProperty'] = function () {
    return ('defineProperty' in Object);
  };

  tests['defineProperties'] = function() {
    return ('defineProperties' in Object);
  };

  /*
   * Detect typed arrays (needed for WebGL).
   * Polyfill available:
   */
  tests['typedArray'] = function() {
    return ('ArrayBuffer' in window);
  };

  /*
   * Detect support for W3C Fullscreen API. Browsers with
   * vendor prefixes need to be polyfilled.
   */
  tests['fullScreen'] = function() {
    return !!(document.documentElement.requestFullscreen);
  };

  /*
   * Detect touch support (useful for changing the Ui if touch is used).
   */
  tests['touch'] = function() {
    return !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));
  };

  /*
   * Detect native support for requestAnimationFrame
   * Polyfills available.
   */
  tests['requestAnimationFrame'] = function() {
    return ('requestAnimationFrame' in window);
  };

  /*
   * Test for WebVR
   * Polyfill for desktops: https://github.com/borismus/webvr-polyfill
   */
  tests['webvr'] = function() {
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

    console.log("typeofs scripts:" + typeof scripts + " callback:" + typeof callback + " progress:" + typeof progressFn + " fail:" + typeof failFn)

    //var retest = [];
    self.head = document.getElementsByTagName('head')[0] || document.documentElement;
    self.batchCount = 0;
    self.loadCount = 0; // Per-batch count.
    self.totalRequired = 0; // Set for each batch in the queue.
    self.scriptCount = 0; // Entire load operation.
    self.totalScripts = 0; // Sum of all scripts in all batches.
    self.callback = callback;
    self.progressFn = progressFn;
    self.failFn = failFn;

    var err_ = function(s) {
      console.log('loader in err_ function, failed to load:' + s.src);
      if(self.failFn) {
        self.failFn(s, self.loadCount);
      }
    };

    // Check loading progress, callback when complete.
    var loaded = function(s) {

      console.log((self.loadCount + 1) + ' of ' + self.totalRequired + ' scripts loaded, path:' + s.src);
      window.ss = s;
      console.log('#1 s.readyState:' + s.readyState)
      if (s.readyState !== undefined) {
        console.log('#2 readyState:' + s.readyState)
        if (s.readyState === 'loaded' || s.readyState === 'complete') {
          // IE completion hack.
          // http://stackoverflow.com/questions/6946631/dynamically-creating-script-readystate-never-complete/18840568#18840568
          console.log('#3 s.readyState:' + s.readyState)
          var currState = s.readyState;
          s.children;
          console.log('#4 s.readyState:' + s.readyState)
          if (currState == 'loaded' && s.readyState == 'loading') {
            // custom error code
            self.err_(s);
          }
          self.loadCount++;
          self.scriptCount++;
        }
      } else {
        self.loadCount++;
        self.scriptCount++;
      }
      console.log('self.progressFn:' + typeof self.progressFn)
      if (typeof self.progressFn == 'function') {
        console.log('record progress')
        // Precent loaded.
        self.progressFn(parseInt(100 * self.scriptCount / self.totalScripts));
      }

      // Run callback, or run progress function, if present.
      if (self.loadCount == self.totalRequired && typeof self.callback == 'function') {
        // If we have another batch of scripts, start the queue. Otherwise, do the callback.
        self.batchCount++;
        console.log('batchcount:' + self.batchCount)
        window.bb = scripts
        if(scripts.length && scripts[self.batchCount]) {
          console.log('another batch done, starting new batch');
          runQueue(scripts[self.batchCount]);
        } else {
          console.log('All batches done, JS loading complete');
          self.callback.call();
        }
      }

      // Null script to prevent memory leaks.
      s.onload = s.onreadystatechange = null;
      if (self.head && s.parentNode) {
        self.head.removeChild(s);
      }

    }; // End of loaded.

    // Load the scripts in an async way.
    var queueScripts = function(src) {
      console.log('in queuescripts')
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.charset = 'utf8';
      s.async = true;
      s.src = src;
      if (s.onreadystatechange !== undefined) { // Separate since IE 9, 10 have both defined.
        //console.log('ie script loader');
        s.onreadystatechange = function() {
          console.log('ran ie loader for:' + s.src);
          if (/loaded|complete/.test(s.readyState)) {
            loaded(s);
        }
          //loaded(s);
        };
      } else if (s.onload !== undefined) {
        //console.log('regular script loader for:' + s.src);
        s.onload = function() {
          console.log('ran standard loader for:' + s.src);
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

    /*
     * Queue the necessary scripts (required polyfills and libraries).
     * Scripts are loaded on batches which don't depend on each other.
     */
    var runQueue = function (s) {
      console.log('in runQueue')
      var notNeeded = 0;
      self.totalRequired = s.length;
      console.log('starting batch #' + self.batchCount + ' length:' + self.totalRequired);
      for (var i = 0; i < self.totalRequired; i++) {
        var nm = s[i].name;
        //console.log('checking ' + nm);
        if (FeatureDetector[nm] !== undefined && FeatureDetector[nm] === true) {
          console.log(nm + ' does not need a polyfill');
          //retest.push(s);
          notNeeded++; self.scriptCount++;
        } else {
          if(s[i].poly) {
            console.log('queueing polyfill for ' + nm + ' at #' + i + ':' + s[i].path);
            retests[(s[i].name)] = true;
          } else {
            console.log('queueing library script: ' + nm + ' at #' + i + ':' + s[i].path);
          }
          // Save a list of polyfills so we can re-test later.
          queueScripts(s[i].path);
        }
      }
      // Reduce by the number of polyfills not needed for this browser.
      self.totalRequired -= notNeeded;
      self.loadCount = 0;
      console.log('reduced batch length:' + self.totalRequired);
      //TODO: if self.totalRequired = 0, we need to jump to the next script batch
      //TODO: store current batch. If we are zero, jump to the next batch.
      if( self.totalRequired == 0) {
        console.log('nothing required, jumping to next batch')
        self.currBatch++;
        runQueue(scripts[self.currBatch]);
      }
    }; // End of runQueue().

    // Count the total number of scripts.
    self.totalBatches = 0;
    self.totalScripts = 0;
    for(var i = 0; i < scripts.length; i++) {
      var batch = scripts[i];
      for(var j = 0; j < batch.length; j++) {
          self.totalScripts++;
        }
      }
      console.log('batch count is:' + scripts.length + ', total script count is:' + self.totalScripts);

      // Run the first batch. The scripts object is an array of arrays.
      self.currBatch = 0;
      runQueue(scripts[0]);

  }; // End of microloader.

  // Redetect after loading complete
  function reDetect() {
    for (var i in retests) {
      console.log('retesting ' + i);
      if (self.results[i] === undefined) {
        console.error('error retest ' + i + ' not in original results!');
      } else if (!self.results[i]) {
        console.log('checking if polyfill ' + i + ' added functionality to browser');
        self.results[i] = tests[i]();
        if (self.results[i]) {
          console.log('polyfill ' + i + ' added browser functionality');
        } else {
          console.error('polyfill ' + i + ' failed to fix browser!');
        }
      }
    }
  };

  // Detect features. Export so we can re-detect after polyfills are loaded.
  // tests used by other tests can be pre-computed.
  function detect() {
    self.results = {
      deviceorientation: eventSupport_(window, 'deviceorientation'),
      devicemotion: eventSupport_(window, 'devicemotion'),
      load: load,
      detect: detect,
      reDetect: reDetect
    };
    for (var i in tests) {
      if (typeof(tests[i]) === 'function') { // this allows us to pre-compute some results.
        self.results[i] = tests[i]();
      } else {
        self.results[i] = tests[i];
      }
    };
    return self.results;
  }
  //fire the first detection
  return detect();

})();
