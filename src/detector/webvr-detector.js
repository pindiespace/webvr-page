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
 * Detects devices and features, loads polyfills as needed.
 * Polyfills:
 * https://github.com/inexorabletash/polyfill/tree/5c070ddef1b7ecf741567a37ffd3ac5658dd9683
 * Portions of this code use WebGL detection strategies from UserAgent.js (webGL based device tests)
 * https://github.com/uupaa/UserAgent.js/wiki/UserAgent
 */

var WebVRDetector = (function(paramList) {
  var cs, ctx, glVersion = '', glVendor = '', glShaderVersion;

  /*
   * Feature detection.
   *
   * Our feature detectors are wrapped in named functions so they
   * can be re-tested after loading polyfills.
   */

  // Test for HTML5 canvas
  var detectCanvas = function() {
    return !!window.CanvasRenderingContext2D;
  };

  var detectWebGL = function() {

    if (detectCanvas()) {
        cs = document.createElement('canvas');
        var names = ['3d', 'webgl', 'experimental-webgl', 'experimental-webgl2', 'moz-webgl'];
        for(i in names) {
          try {
            ctx = cs.getContext(names[i]);
            if (ctx && typeof ctx.getParameter == 'function') {
              return true;
            }
          } catch (e) {}
        }
    }
    return false;
  };

  // glVersion is actually assigned in detectWebGL().
  var detectWebGLVersion = function() {
    if(ctx) {
      glVersion =  ctx.getParameter(ctx.VERSION).toLowerCase();
      return glVersion;
    }
  };

  var detectGLVendor = function() {
    if(ctx) {
      glVendor = ctx.getParameter(ctx.VENDOR).toLowerCase();
      return glVendor;
    }
  };

  var detectShaderVersion = function() {
    if(ctx) {
      glShaderVersion = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION).toLowerCase();
      return glShaderVersion;
    }
  };

  var detectEventListener = function() {
    return ('addEventListener' in window);
  };

  var detectFullscreen = function() {
    if (document.body.requestFullscreen ||
      document.body.mozRequestFullScreen ||
      document.body.webkitRequestFullscreen ||
      document.body.msRequestFullscreen) {
        return true;
      }
      return false;
  }
  // Test for WebVR
  var detectWebVR = function() {
    if ('getVRDevices' in navigator || 'mozGetVRDevices' in navigator) {
      console.log('found getVRDevices in navigator');
      return true;
    } else if(window.HMDVRDevice) {
      console.log('found window.HMDVRDevice');
      return true;
    }
    else {
      return false;
    }
  };

  /*
   * Device detection.
   * use a combination of user-agents, plus versioning from WebGL
   * to identify device hardware.
   * http://webglreport.com/?v=1
   * http://hgoebl.github.io/mobile-detect.js/doc/mobile-detect.js.html
   * https://github.com/piwik/device-detector
   * http://www.tera-wurfl.com/explore/search.php?action=browse
   */

  // User agent.
  var ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

  // Use indexOf if possible, (MUCH faster than creating a large number of regexes).

  // OS detects
  var os = {};
  os.ios = /(iphone|ipad|ipod)/.test(ua);
  os.crios = /(cros|crmo)/.test(ua);
  os.mac = !os.ios && (ua.indexOf('mac os x') >= 0);
  os.linux = (ua.indexOf('linux') >= 0);
  os.windowsphone = (ua.indexOf('windows phone') >= 0);
  os.windows = (ua.indexOf('windows') >= 0);
  os.android = (ua.indexOf('android') >= 0);
  os.blackberry = /(blackberry|bb10|rim[0-9])/.test(ua);
  os.firefoxos = /mobile.*(firefox)/i.test(ua);

  // OS Versions (if needed)
  // Android - https://gist.github.com/srs81/2589680

  // Screen features.
  var display = {};
  //TODO: display.headset
  display.touch = !!('ontouchstart in window');
  display.pixelRatio = window.devicePixelRatio || 1.0;
  display.screenWidth = window.screen.width || 0;
  display.screenHeight = window.screen.height || 0;
  display.pixelWidth = display.screenWidth * window.devicePixelRatio || 1;
  display.pixelHeight = display.screenHeight * display.pixelRatio;
  display.retina = (display.pixelRatio >= 2);

  // Classify devices based on user-agent.
  var formFactor = {};
  formFactor.mobile = os.ios || os.android || /mobi|ip(hone|od|ad)|touch|blackberry|bb10|windows phone|kindle|silk|htc|(hpw|web)os|opera mini|fxios/.test(ua);
  formFactor.tablet = /ipad|tablet|nexus[\s]+(7|9|10)|playbook|silk|ideapad|slate|touchpad|playbook|toshiba|xoom/.test(ua);
  formFactor.console = /(nintendo|wiiu|3ds|playstation|xbox|archos|ouya)/.test(ua);
  formFactor.tv = !formFactor.mobile && !formFactor.tablet && !formFactor.console && /(google|apple|smart|hbb|opera|pov|net|videoweb).*tv|(lg|aquos|inettv).*browser|(roku|kylo|viera|humax|ikea|dmm|espial|sharp|boxee|dlnadoc|crkey|airties|altech uec|bangolufsen|changhong|ce-html)/.test(ua);
  formFactor.desktop = !formFactor.mobile && !formFactor.tablet && !formFactor.console && !formFactor.tv || (window.screenX != 0);

  // General device detects.
  var device = {}, m = '';
  // Specific Android devices.
  // TODO: examine glVersion in android for hardware-specific features.
  // https://gist.github.com/srs81/2589680
  // https://github.com/faisalman/ua-parser-js/blob/master/src/ua-parser.js

  var detectiOS = function() {

    device.iphone = (ua.indexOf('iphone') >= 0);
    device.ipad = (ua.indexOf('ipad') >= 0);
    device.ipod = (ua.indexOf('ipod') >= 0);

    // Version detect.
    m = (ua).match(/os (\d+)_(\d+)_?(\d+)?/);
    if(m && m[1] && m[2]) {
      os.version = parseFloat(m[1] + '.' + m[2]);
    }

    // Feature-detect webGL versions to classify iOS hardware.
    // https://github.com/uupaa/UserAgent.js/wiki/UserAgent.
    //var SGX535 = /535/.test(glVersion); // iPhone 3GS, iPhone 4
    var SGX543 = glVersion.indexOf('543'); // iPhone 4s/5/5c, iPad 2/3, iPad mini
    var SGX554 = glVersion.indexOf('554'); // iPad 4
    var A7     = glVersion.indexOf('a7');  // iPhone 5s, iPad mini 2/3, iPad Air
    var A8X    = glVersion.indexOf('a8X'); // A8X, iPad Air 2
    var A8     = glVersion.indexOf('a8'); // A8,  iPhone 6/6+, iPad mini 4, iPod touch 6
    var A9     = glVersion.indexOf('a9');  // A9, A9X, iPhone 6s/6s+, iPad Pro

    // Screen size.
    var long     = Math.max(display.screenWidth, display.screenHeight);
    var short    = Math.min(display.screenWidth, display.screenHeight);
    var longest = Math.max(long, short); // iPhone 4s: 480, iPhone 5: 568
    // IOS hardware detect.
    if (device.iphone) {
      device.iphone3g = !display.retina;
      if (longest <= 480) {
        (SGX543 || os.version >= 8) ? device.iphone4s = true : device.iphone4 = true; // iPhone 4 stopped in iOS 7.
      } else if (longest <= 568) {
        device.iphone4 = device.iphone4s = false;
        A7 ? device.iphone5s = true : device.iphone5 = true; // iPhone 5 or iPhone 5c
      } else if (longest <= 667) {
        device.iphone5 = device.iphone5s = false;
        A9 ? device.iphone6s = true : device.iphone6 = true;
      } else if (longest <= 736) {
        device.iphone6 = device.iphone6s = false;
        A9 ? device.iphone6splus = true : device.iphone6plus = true;
      } else {
        device.iphone6plus = device.iphone6splus = false;
      }
      /*
      !display.retina ? device.iphone3g = true
        : longest <= 480 ? (SGX543 || os.version >= 8 ? device.iphone4s = true; device.iphone4 = false : device.iphone4s = false; device.iphone4 = true) // iPhone 4 stopped in iOS 7.
        : longest <= 568 ? (A7 ? device.iphone5s = true; device.iphone5 = false : device.iphone5 = true; device.iphone5s = false) // iPhone 5 or iPhone 5c
        : longest <= 667 ? (A9 ? device.iphone6s = true; device.iphone6 = false : device.iphone6 = true; device.iphone6s = false)
        : longest <= 736 ? (A9 ? device.iphone6splus = true; device.iphone6plus = false : device.iphone6plus = true; device.iphone6splus)
        : device.iphoneunknown = true;
        */
    } else if (device.ipad) {
      // Device list - https://support.apple.com/en-us/HT201471
      // https://51degrees.com/blog/ArtMID/1641/ArticleID/363/Device-Detection-for-Apple-iPhone-and-iPad

      // ipad1 doesn't have an accelerometer
      // https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent
      device.ipad1 = true; // Negated if 'devicemotion' event is triggered.
      device.ipad2 = false;
      function motionHandler(e) {
        device.ipad1 = false;
        if(display.retina) {
          SGX543 ? device.ipad3 = true
          : device.ipad3 = false; SGX554 ? device.ipad4 = true
          : device.ipad4 = false; A7 ? device.ipadmini2 = true // iPad mini 3, iPad Air
          : device.ipadair2 = false; A8X ? device.ipadair2 = true
          : device.ipaidair2 = false; A8 ? device.ipadmini4 = true
          : device.ipadmini4 = false; A9 ? device.ipadpro = true
          : device.ipadpro = false;
        } else {
            //console.log('e.acceleration found, ipad2')
            device.ipad2 = true; // iPad2 or iPad mini, Also uses SGX543
        }
        removeEventListener(e.type, motionHandler, false);
      }; //end of motionHandler
      addEventListener('devicemotion', motionHandler, false);
    } else if (device.ipod) {
        longest <= 480 ? (retina ? device.ipodtouch4 = true : device.ipodtouch3 = true)
                        : (A8 ? device.ipodtouch6 = true : device.ipodtouch5 = true);
    }
  };

  var detectAndroid = function() {
    // Version detect.
    m = ua.match(/android (\d+(?:\.\d+)+)[;)]/);
    if(m && m[0]) {
      os.version = parseFloat(m[0]);
    }
    // Individual Android devices.
    device.android = true;
    device.note4 = (ua.indexOf('samsung sm-n910c') >= 0);
    device.nexus5 = (ua.indexOf('nexus 5 ') >= 0);
    device.nexus5s = (ua.indexOf('nexus 5s') >= 0);
    device.nexus6 = (ua.indexOf('nexus 6 ') >= 0);
    device.nexus6p = (ua.indexOf('nexus 6p') >= 0);
    device.galaxygrand = (ua.indexOf('sm-g7102') >= 0);
    device.galaxygrandprime = (ua.indexOf('sm-g530h') >= 0);
    device.galaxy5 = (ua.indexOf('sm-g313hz') >= 0);
    device.galaxys3 = (ua.indexOf('gt-i9300') >= 0);
    device.galaxys4 = (ua.indexOf('gt-i9505') >= 0);
    device.galaxys4 = (ua.indexOf('sm-g900') >= 0);
    device.galaxys5mini = (ua.indexOf('sm-g800f') >= 0);
    device.galaxys6 = (ua.indexOf('sm-g920') >= 0);
    device.htconemax = (ua.indexOf('htc 8088') >= 0);
  };

  // They definitely would work for webvr
  // https://msopentech.com/blog/2014/10/10/creating-3d-scenes-on-windows-phone-8-1-with-webgl-and-cordova/#
  var detectWindowsPhone = function() {
    m = ua.match(/Windows Phone ([0-9]+\.[0-9]+)/);
    if(m && m[1]) {
      os.version = m[1];
    }
    device.windowsphone = (ua.indexOf('windows phone') >= 0);
    device.lumina1520 = (ua.indexOf('lumina 1520') >= 0); // 6"
    device.lumina950 = (ua.indexOf('lumina 950') >= 0); // Large Windows 10, 5.7"
    device.lumina950xl = (ua.indexOf('lumina 950xl') >= 0); // XL phablet version
    device.lumina930 = (ua.indexOf('lumia 930') >= 0); // 5-inch

  }

  var detectTV = function() {
    // Specific TV models, not vary useful without an HMD.
    // Detailed regexes at https://github.com/piwik/device-detector
    if(formFactor.tv) {
      device.tv = true;
    }
  };

  var detectDesktop = function() {
    // Specific desktops, not very useful.
    if(formFactor.desktop) {
      device.desktop = true;
    }
  };

  // Conditional Android detects.
  if (os.android) {
    detectAndroid();
  } else if (os.ios) {
    detectiOS();
  } else if (os.windowsphone) {
    detectWindowsPhone();
  } else if(!formFactor.mobile || formFactor.tablet && (os.windows || os.mac || os.linux)) {
    detectDesktop();
  }
  // Specific Browser detects by UA and features.
  var browser = {};
  browser.edge = (ua.indexOf('edge') >= 0);
  browser.amazon = (ua.indexOf('silk') >= 0);
  browser.opera = (ua.indexOf('opr/') >= 0); //new opera webkit
  browser.chrome = (ua.indexOf('chrome') >= 0) && !browser.edge && !browser.amazon && !browser.opera;
  browser.firefox = (ua.indexOf('firefox') >= 0);
  browser.ie = (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0);
  browser.ie11 = (window.location.hash = !!window.MSInputMethodContext && !!document.documentMode);
  browser.safari = (ua.indexOf('safari') >= 0 && !browser.chrome && !browser.edge && !browser.amazon && !browser.opera && !browser.firefox && !browser.ie);
  //browser.ie11 = /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(ua); //only version of IE supporting webGL
  if (browser.ie) {
    browser.ie8 = ua.indexOf('msie 8.') >= 0;
    browser.ie9 = ua.indexOf('msie 9.') >= 0;;
    browser.ie10 = ua.indexOf('msie 10.') >= 0;;
  } else if (browser.ie11) {
    browser.ie = true;
  }

  // Object test (same as _underscores library).
  function isObject(obj) {
    return obj === Object(obj);
  };

  // Get a list of the keys for an object.
  function getDetectList(detectObj) {
    var ls = [];
    for (var i in detectObj) {
      ls.push(i);
    }
    return ls;
  };

  // Get the list of browser names.
  function getBrowserList(browserName) {
    return getDetectList(browser);
  };

  // Get the list of form factors.
  function getFormFactorList() {
    return getDetectList(formFactor);
  };

  // Get the list of devices.
  function getDeviceList() {
    detectiOS();
    detectAndroid();
    detectWindowsPhone();
    detectDesktop();
    return getDetectList(device);
  };

  // Get the list of OSes.
  function getOSList() {
    return getDetectList(os);
  };

  // Get the currently detected item for an object type.
  function getCurrentDetect(detectObj, objName) {
    var oo = [];
    for (var i in detectObj) {
      var o = detectObj[i];
      if (o) {
        if (isObject(o)) {
          oo.push(o); //return attached parameters object if it exists, which should have a 'name' member.
        } else {
          oo.push({name: i}); //just the string
        }
      }
    }
    switch(oo.length) {
      case 0:
        console.warn('Detector warning - no ' + objName + ' found');
        break;
      case 1:
        return oo[0];
        break;
      default:
        console.warn('Detector warning - multiple ' + objName + 's found');
        return oo; // Debugging.
        break;
    }
  };

  // Get the current browser.
  function getCurrentBrowser() {
    return getCurrentDetect(browser, 'browser');
  };

  // Get the current device.
  function getCurrentDevice() {
    return getCurrentDetect(device, 'devices');
  };

  // Get the current form factor.
  function getCurrentFormFactor() {
    return getCurrentDetect(formFactor, 'form factor');
  };

  // Get the current OS.
  function getCurrentOS() {
    return getCurrentDetect(os, 'operating system');
  };

  // Allows objects to be replaced with a parameter list, which should be provided as a list of
  // sub-objects in a larger object. The function will use the object name and assign it to any
  // detects listed non-falsy.
  if (paramList) {
    for (var i in device) {
      if (device[i]) {
        device[i] = paramList[i]; // key to key assignment of params object (not numerical).
      }
    }
  }

  // Detect features. Export so we can re-detect after polyfill load.
  var detect = function() {
    return {
      // Individual feature detects.
      canvas: detectCanvas(),
      webGL: detectWebGL(),
      glVersion: detectWebGLVersion(),
      glVendor: detectGLVendor(),
      glShader: detectShaderVersion(),
      defineProperty: ('defineProperty' in Object),
      defineProperties: ('defineProperties' in Object),
      typedArray: ('ArrayBuffer' in window),
      promise: ('Promise' in window),
      fullscreen: detectFullscreen(),
      webVR: detectWebVR(),
      requestAnimationFrame: (('requestAnimationFrame' in window) ||
        ('mozRequestAnimationFrame' in window) ||
        ('webkitRequestAnimationFrame' in window)),
      addEventListener: detectEventListener(),
      // Objects.
      display:display,
      formFactor:formFactor,
      browser: browser,
      device: device,
      os:os,
      // Getter functions.
      detect: detect,
      getBrowserList: getBrowserList,
      getDeviceList: getDeviceList,
      getFormFactorList: getFormFactorList,
      getOSList: getOSList,
      getCurrentBrowser: getCurrentBrowser,
      getCurrentDevice: getCurrentDevice,
      getCurrentFormFactor: getCurrentFormFactor,
      getCurrentOS: getCurrentOS
    };
  };

  // Run our detector script (which returns an object).
  return detect();

})(params);

/*
 * Parameters for phones used in VR.
 */

var params = {
  iphone4: {
  name: 'iPhone 4',
  width: 640,
  height: 960,
  widthMeters: 0.075,
  heightMeters: 0.0495,
  bevelMeters: 0.004
},
iphone5: {
  name: 'iPhone 5',
  width: 640,
  height: 1136,
  widthMeters: 0.09011,
  heightMeters: 0.05127,
  bevelMeters: 0.00343
},
iphone6: {
  name: 'iPhone 6',
  width: 750,
  height: 1334,
  widthMeters: 0.1038,
  heightMeters: 0.0584,
  bevelMeters: 0.004
},
iphone6plus: {
  name: 'iPhone 6 Plus',
  width: 1242,
  height: 2208,
  widthMeters: 0.12235,
  heightMeters: 0.06954,
  bevelMeters: 0.00471
},
nexus5: {
  name: 'Nexus 5',
  widthMeters: 0.110,
  heightMeters: 0.062,
  bevelMeters: 0.004
},
nexus6: {
  name: 'Nexus 6',
  widthMeters: 0.1593,
  heightMeters: 0.083,
  bevelMeters: 0.004
},
nexus5s: {
  name: 'Nexus 5S',
  widthMeters: 0.1155,
  heightMeters: 0.065,
  bevelMeters: 0.004
},
nexus6p: {
  name: 'Nexus 6P',
  widthMeters: 0.126,
  heightMeters: 0.0705,
  bevelMeters: 0.004
},
galaxys3: {
  name: 'Galaxy S3',
  widthMeters: 0.106,
  heightMeters: 0.060,
  bevelMeters: 0.005
},
galaxys4: {
  name: 'Galaxy S4',
  widthMeters: 0.111,
  heightMeters: 0.0625,
  bevelMeters: 0.004
},
galaxys5: {
  name: 'Galaxy S5',
  widthMeters: 0.113,
  heightMeters: 0.066,
  bevelMeters: 0.005
},
galaxys6: {
  name: 'Galaxy S6',
  widthMeters: 0.114,
  heightMeters: 0.0635,
  bevelMeters: 0.0035
}
};
