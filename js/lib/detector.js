/*
 * Device and feature detector for the boilerplate.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * Detects devices and features, loads polyfills as needed.
 * Polyfills:
 * https://github.com/inexorabletash/polyfill/tree/5c070ddef1b7ecf741567a37ffd3ac5658dd9683
 * Portions of this code use detection strategies from UserAgent.js (webGL based device tests)
 * https://github.com/uupaa/UserAgent.js/wiki/UserAgent
 */

var Detector = (function(paramList) {
  var cs, ctx;
  var webgl = false, glVersion = false;

  // Test for HTML5 canvas
  var canvas = !!window.CanvasRenderingContext2D;

  // Test for WebGL, https://www.browserleaks.com/webgl#howto-detect-webgl
    if (canvas) {
      try {
        cs = document.createElement('canvas');
        ctx = cs.getContext('webgl') ||
          cs.getContext('experimental-webgl') ||
          cs.getContext('moz-webgl');
          if (ctx) {
            webgl = true;
            var glVersion =  ctx.getParameter(ctx.VERSION).toLowerCase();
          }
      } catch(e) {
        console.log('webgl not availabe');
      }
    } //end of canvas and webgl tests.

  // User agent.
  var ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

  /*
   * for simple detects, use indexOf, which is MUCH faster than
   * creating a large number of regexes.
   */

  // OS detects
  var os = {};
  os.ios = /(iphone|ipad|ipod)/.test(ua);
  os.crios = /(cros|crmo)/.test(ua);
  os.mac = (ua.indexOf('mac os x') >= 0);
  os.linux = (ua.indexOf('linux') >= 0);
  os.windows = (ua.indexOf('windows') >= 0);
  os.android = (ua.indexOf('android') >= 0);
  os.blackberry = /(blackberry|bb10|rim[0-9])/.test(ua);
  os.firefoxOS = /mobile.*(firefox)/i.test(ua);

  // Screen features.
  var display = {};
  display.touch = !!('ontouchstart in window');
  display.pixelRatio = window.devicePixelRatio || 1.0;
  display.screenWidth = Math.max(window.screen.width, window.screen.height)  || 0;
  display.screenHeight = Math.min(window.screen.width, window.screen.height) || 0;
  display.pixelWidth = display.screenWidth * window.devicePixelRatio;
  display.pixelHeight = display.screenHeight * display.pixelRatio;
  display.retina = (display.pixelRatio >= 2);

  // Classify devices based on user-agent.
  var formFactor = {};
  formFactor.mobile = os.ios || os.android || /mobi|ip(hone|od|ad)|touch|blackberry|bb10|windows phone|kindle|silk|htc|(hpw|web)os|opera mini|fxios/.test(ua);
  formFactor.tablet = /ipad|tablet|nexus[\s]+(7|9|10)|playbook|silk|ideapad|slate|touchpad|playbook|toshiba|xoom/.test(ua);
  formFactor.console = /(nintendo|wiiu|3ds|playstation|xbox)/.test(ua);
  formFactor.tv = /crkey|(google|apple|smart|hbb|opera).*tv|(lg|aquos|inettv).*browser|roku|espial/.test(ua);
  formFactor.desktop = !formFactor.mobile && !formFactor.tablet && !formFactor.console && !formFactor.tv || (window.screenX != 0);

  // General device detects.
  var device = {};
  // Specific Android devices.
  if (os.android) {
    device.note4 = (ua.indexOf('samsung sm-n910c') >= 0);
    device.nexus5 = (ua.indexOf('nexus 5 ') >= 0);
    device.nexus5s = (ua.indexOf('nexus 5s') >= 0);
    device.nexus6 = (ua.indexOf('nexus 6 ') >= 0);
    device.nexus6p = (ua.indexOf('nexus 6p') >= 0);
    device.galaxyS3 = (ua.indexOf('gt-i9300') >= 0);
    device.galaxyS4 = (ua.indexOf('gt-i9505') >= 0);
    device.galaxyS5 = (ua.indexOf('sm-g900F') >= 0);
    device.galaxyS6 = (ua.indexOf('sm-g920') >= 0);
  }

  // Specific iOS devices.
  if (os.ios) {
    device.iphone = (ua.indexOf('iphone') >= 0);
    device.ipad = (ua.indexOf('ipad') >= 0);
    device.ipod = (ua.indexOf('ipod') >= 0);
    //Feature-detect WebGL versions to classify iOS hardware
    //var SGX535 = /535/.test(glVersion); // iPhone 3GS, iPhone 4
    var SGX543 = glVersion.indexOf('543'); // iPhone 4s/5/5c, iPad 2/3, iPad mini
    var SGX554 = glVersion.indexOf('554'); // iPad 4
    var A7     = glVersion.indexOf('a7');  // iPhone 5s, iPad mini 2/3, iPad Air
    var A8X    = glVersion.indexOf('a8X'); // A8X, iPad Air 2
    var A8     = glVersion.indexOf('a8'); // A8,  iPhone 6/6+, iPad mini 4, iPod touch 6
    var A9     = glVersion.indexOf('a9');  // A9, A9X, iPhone 6s/6s+, iPad Pro

    // Screen size.
    var long     = Math.max(device.screenWidth, device.screenHeight);
    var short    = Math.min(device.screenWidth, device.screenHeight);
    var longEdge = Math.max(long, short); // iPhone 4s: 480, iPhone 5: 568

    // IOS hardware detect.
    if (device.iPhone) {
      !device.retina ? device.iPhone3Gs = true
        : longEdge <= 480 ? (SGX543 || osVersion >= 8 ? device.iphone4s = true : device.iphone4 = true) // iPhone 4 stopped in iOS 7.
        : longEdge <= 568 ? (A7 ? device.iphone5s = true : device.iphone5 = true) // iPhone 5 or iPhone 5c
        : longEdge <= 667 ? (A9 ? device.iphone6s = true : device.iphone6 = true)
        : longEdge <= 736 ? (A9 ? device.iphone6splus = true : device.iphone6plus = true) : device.iphoneunknown = true;
    } else if (device.iPad) {
      !device.retina  ? device.ipad2 = true // iPad 1/2, iPad mini
        : SGX543 ? device.ipad3 = true
        : SGX554 ? device.ipad4 = true
        : A7     ? device.ipadmini2 = true // iPad mini 3, iPad Air
        : A8X    ? device.ipadair2 = true
        : A8     ? device.ipadmini4 = true
        : A9     ? device.ipadpro = true : device.ipadunknown = true;
    } else if (device.ipod) {

      longEdge <= 480 ? (retina ? device.ipodtouch4 = true : device.ipodtouch3 = true)
                      : (A8 ? device.ipodtouch6 = true : device.ipodtouch5 = true);
    }
  } //end of ios

  // Specific Browser detects by UA and features.
  var browser = {};
  browser.edge = (ua.indexOf('edge') >= 0);
  browser.chrome = (ua.indexOf('chrome') >= 0);
  browser.amazon = (ua.indexOf('silk') >= 0);
  browser.opera = (ua.indexOf('opr/') >= 0); //new opera webkit
  browser.firefox = (ua.indexOf('firefox') >= 0);
  browser.ie = (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0);
  browser.ie11 = (window.location.hash = !!window.MSInputMethodContext && !!document.documentMode);
  browser.safari = (ua.indexOf('safari') >= 0 && !browser.chrome && !browser.edge && !browser.amazon && !browser.opera && !browser.firefox && !browser.ie);

  //browser.ie11 = /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(ua); //only version of IE supporting WebGL
  if (browser.ie) {
    browser.ie8 = navigator.appVersion.indexOf('msie 8.') >= 0;
    browser.ie9 = navigator.appVersion.indexOf('msie 9.') >= 0;;
    browser.ie10 = navigator.appVersion.indexOf('msie 10.') >= 0;;
  } else if (browser.ie11) {
    browser.ie = true;
  }

  // Object test, the same as _underscore JS.
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

  function isWebVRCapable() {

  };

  // Allows objects to be replaced with a parameter list, which should be provided as a list of
  // sub-objects in a larger object. The function will use the object name and assign it to any
  // detects listed 'true'.
  if (paramList) {
    for (var i in device) {
      if (device[i]) {
        device[i] = paramList[i]; // key to key assignment of params object (not numerical).
      }
    }
  }

  return {
    typedArray: ('ArrayBuffer' in window),
    canvas: canvas,
    webgl: webgl,
    glVersion: glVersion,
    promise:('Promise' in this),
    defineProperty: ('defineProperty' in Object),
    defineProperties: ('defineProperties' in Object),
    display:display,
    formFactor:formFactor,
    browser: browser,
    device: device,
    os:os,
    getBrowserList: getBrowserList,
    getCurrentBrowser: getCurrentBrowser,
    getCurrentDevice: getCurrentDevice,
    getCurrentFormFactor: getCurrentFormFactor,
    getCurrentOS: getCurrentOS,
    isWebVRCapable:isWebVRCapable
  };

})(params);

// Parameters for devices.
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
