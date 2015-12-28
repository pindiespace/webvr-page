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

var Detector = (function() {
  var cs, ctx;
  var webgl = false, glVersion = false;

  // Test for HTML5 canvas
  var canvas = !!window.CanvasRenderingContext2D;

  // Test for WebGL, https://www.browserleaks.com/webgl#howto-detect-webgl
    if(canvas) {
      try {
        cs = document.createElement('canvas');
        ctx = cs.getContext('webgl') ||
          cs.getContext('experimental-webgl') ||
          cs.getContext('moz-webgl');
          if(ctx) {
            webgl = true;
            var glVersion =  ctx.getParameter(ctx.VERSION);
          }
      } catch(e) {
        console.log('webgl not availabe');
      }
    } //end of canvas and webgl tests.


  // Test for Promise

  // User agent.
  var ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

  // OS detects
  var os = {};
  os.ios = /(iphone|ipad|ipod)/i.test(ua);
  os.crios = /(cros|crmo)/i.test(ua);
  os.mac = ua.indexOf('mac os x') >= 0;
  os.linux = ua.indexOf('linux') >= 0;
  os.windows = ua.indexOf('windows') >= 0;
  os.android = ua.indexOf('android') >= 0;
  os.blackberry = /(blackberry|bb10|rim[0-9])/i.test(ua);
  os.firefoxOS = /mobile.*(firefox)/i.test(ua);

  // General device detects.
  var device = {};
  device.pixelRatio = window.devicePixelRatio || 1.0;
  device.screenWidth = Math.max(window.screen.width, window.screen.height)  || 0;
  device.screenHeight = Math.min(window.screen.width, window.screen.height) || 0;
  device.retina = (device.pixelRatio >= 2);
  device.mobile = os.ios || os.android || (/mobi|ip(hone|od|ad)|touch|blackberry|bb10|windows phone|kindle|silk|htc|(hpw|web)os|opera mini|fxios/i.test(ua));
  device.tablet = /ipad|tablet|nexus[\s]+(7|9|10)|playbook|silk|ideapad|slate|touchpad|playbook|toshiba|xoom/i.test(ua);
  device.console = /(nintendo|wiiu|3ds|playstation|xbox)/i.test(ua);
  device.tv = /crkey|(google|apple|smart|hbb|opera).*tv|(lg|aquos|inettv).*browser|roku|espial/i.test(ua);

  // Specific Android devices.
  device.Note4 = (os.android && ua.indexOf('samsung sm-n910c') >= 0);
  if(os.android) {

  }

  // Specific iOS devices.
  if (os.ios) {
    device.iPhone = /iphone/.test(ua);
    device.iPad = /ipad/.test(ua);
    device.iPod = /ipod/.test(ua);
    //Feature-detect WebGL versions to classify iOS hardware
    //var SGX535 = /535/.test(glVersion); // iPhone 3GS, iPhone 4
    var SGX543   = /543/.test(glVersion); // iPhone 4s/5/5c, iPad 2/3, iPad mini
    var SGX554   = /554/.test(glVersion); // iPad 4
    var A7       = /A7/.test(glVersion);  // iPhone 5s, iPad mini 2/3, iPad Air
    var A8X      = /A8X/.test(glVersion); // A8X, iPad Air 2
    var A8       = /A8/.test(glVersion);  // A8,  iPhone 6/6+, iPad mini 4, iPod touch 6
    var A9       = /A9/.test(glVersion);  // A9, A9X, iPhone 6s/6s+, iPad Pro
  var long         = Math.max(device.screenWidth, device.screenHeight);
    var short        = Math.min(device.screenWidth, device.screenHeight);
    var longEdge     = Math.max(long, short); // iPhone 4s: 480, iPhone 5: 568
    if (device.iPhone) {
      !device.retina ? device.iPhone3Gs = true
                   : longEdge <= 480 ? (SGX543 || osVersion >= 8 ? device.iPhone4s = true : device.iPhone4 = true) // iPhone 4 stopped in iOS 7.
                   : longEdge <= 568 ? (A7 ? device.iPhone5s = true : device.iPhone5 = true) // iPhone 5 or iPhone 5c
                   : longEdge <= 667 ? (A9 ? device.iPhone6s = true : device.iPhone6 = true)
                   : longEdge <= 736 ? (A9 ? device.iPhone6sPlus = true : device.iPhone6Plus = true) : device.iPhoneUnknown = true;
    } else if (device.iPad) {
      !device.retina  ? device.iPad2 = true // iPad 1/2, iPad mini
             : SGX543 ? device.iPad3 = true
             : SGX554 ? device.iPad4 = true
             : A7     ? device.iPadMini2 = true // iPad mini 3, iPad Air
             : A8X    ? device.iPadAir2 = true
             : A8     ? device.iPadMini4 = true
             : A9     ? device.iPadPro = true : device.iPadUnknown = true;
    } else if (device.iPod) {

      longEdge <= 480 ? (retina ? device.iPodTouch4 = true : device.iPodTouch3 = true)
                      : (A8 ? device.iPodTouch6 = true : device.iPodTouch5 = true);
    }
  } //end of ios

  // Specific Browser detects when feature-detection isn't enough.
  var browser = {};

  browser.ie = (ua.indexOf('msie') >= 0 || ua.indexOf('trident') >= 0);
  browser.ie11 = (window.location.hash = !!window.MSInputMethodContext && !!document.documentMode);
  //browser.ie11 = /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i.test(ua); //only version of IE supporting WebGL
  if(browser.ie) {
    browser.ie8 = navigator.appVersion.indexOf("MSIE 8.") >= 0;
    browser.ie9 = navigator.appVersion.indexOf("MSIE 9.") >= 0;;
    browser.ie10 = navigator.appVersion.indexOf("MSIE 10.") >= 0;;
  } else if(browser.ie11) {
    browser.ie = true;
  }

  browser.edge = ua.indexOf('edge') >= 0;
  browser.safari = (ua.indexOf('safari') >= 0 && !ua.indexOf('chrome') >= 0);
  browser.chrome = ua.indexOf('chrome') >= 0;
  browser.amazon = ua.indexOf('silk') >= 0;
  browser.firefox = ua.indexOf('firefox') >= 0;
  browser.opera = ua.indexOf('opr/') >= 0; //new opera webkit

  return {
    canvas:canvas,
    webgl:webgl,
    glVersion:glVersion,
    os:os,
    device:device,
    browser:browser
  };

})();
