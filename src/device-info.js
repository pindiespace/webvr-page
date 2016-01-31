/*
 * This application is Licensed under the Apache License, Version 2.0 (the 'License');
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
 *
 * Portions of this software derive from webvr-boilerplate
 *
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 */

/*
 * This object loads device descriptions, and maps them to detected
 * objects.
 */

var Util = require('./util.js');
var Distortion = require('./distortion/distortion.js');
var ViewerInfo = require('./viewer-info.js');
var DeviceList = require('./device/device-list.js');

function DeviceInfo(params) {

  var DEFAULT_LEFT_CENTER = {x: 0.5, y: 0.5};
  var DEFAULT_RIGHT_CENTER = {x: 0.5, y: 0.5};

  this.detected = false;

  // Feature detect results, passed to detector functions
  this.tests = {};

  // Assign a specific Viewer, or get a default one.
  if(params) {
    this.viewerInfo = new ViewerInfo(params);
  } else {
    this.viewerInfo = new ViewerInfo();
  }
  this.viewer = this.getViewer(); //this.viewerInfo.getViewer();

  // Current device.
  this.device = null;

  // User agent.
  this.ua = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

  // Load the device database.
  this.devList = new DeviceList();

  // If a device name was supplied, set it. Otherwise, detect the device.
  if(params.deviceName) {
    this.setDevice(deviceName);
  } else {
    // Run feature and user agent detects on the browser.
    this.detectGL_();
    this.detectDisplay_();
    this.detectOS_();
    this.detectFormFactor_();

    //Get our device.
    this.getDevice();
  }

};

// Get the found device.
DeviceInfo.prototype.getDevice = function() {
  if (!this.device) {
    return this.detectDevice();
  }
  return this.device;
};

DeviceInfo.prototype.getViewer = function() {
  if(!this.viewer) {
    return this.viewerInfo.getViewer();
  }
  return this.viewer;
};

DeviceInfo.prototype.setDevice = function(deviceName) {
  var list = this.devList.getList(deviceList);
  var dev = list[deviceName];
  if(dev) {
    if(dev != this.device) {
      this.detected = false;
    }
    this.device = dev;
    return this.device;
  }
  console.error('device ' + deviceName + ' not found in deviceList');
  return {};
};

// Return the names of all devices used for detection.
DeviceInfo.prototype.getDeviceNames = function(deviceList) {
  var names = [];
  var list = this.devList.getList(deviceList);
  for (var i in list) {
    names.push(i);
  }
  list = null;
  return names;
};

DeviceInfo.prototype.getDeviceLabels = function(deviceList) {
  var labels = [];
  if(!deviceList) {
    deviceList = this.deviceGroup_ALL;
  }
  var list = this.devList.getList(deviceList);
  for (var i in list) {
    labels.push(list[i].label);
  }
  list = null;
  return labels;
};

DeviceInfo.prototype.getDeviceByName = function(deviceName) {
  var list = this.deviceList.getList(this.deviceList.DEVICE_ALL);
  var dev = list[deviceName];
  if(dev) {
    return dev;
  }
  console.error('Device ' + deviceName + ' not found in lists');
  return {};
};

// Scan for a list of devices matching keywords, return the device(s) in an array.
DeviceInfo.prototype.searchDevice = function(keywords) {
  //TODO: write a progressive search funciton
}; // End of searchDevice_ function.

// Detect device.
DeviceInfo.prototype.detectDevice = function() {
  var ua = this.ua;
  var devices = {};

  // Broad device classification based on OS used to load data.
  this.deviceGroup = {
    iphone: (ua.indexOf('iphone') >= 0),
    ipad: (ua.indexOf('ipad') >= 0),
    ipod: (ua.indexOf('ipod') >= 0),
    windowsphone: (ua.indexOf('windows phone') >= 0)
  };
  this.deviceGroup.android = (!this.deviceGroup.windowsphone && ua.indexOf('android') >= 0);
  /*
   * Run searches in the most efficient way.
   * - iOS - checkfor the device first.
   * - Windows Phone - check for the OS first.
   * - Android - check for the OS first
   */
  if (this.deviceGroup.android) { // 80% in 2015.
    devices = this.devList.getList(this.devList.DEVICE_ANDROID);
  } else if (this.deviceGroup.iphone) { // iOS 15% IN 2015.
    devices = this.devList.getList(this.devList.DEVICE_IPHONE);
  } else if (this.deviceGroup.ipad) {
    this.tests.devicemotion = this.detectEvents_(window, 'devicemotion'); // window.DeviceOrientationEvent INCORRECTLY returns true for ipad 1
    devices = this.devList.getList(this.devList.DEVICE_IPAD);
  } else if (this.deviceGroup.ipod) {
    devices = this.devList.getList(this.devList.DEVICE_IPOD);
  } else if (this.deviceGroup.windowsphone) { // 3% IN 2015.
    devices = this.devList.getList(this.devList.DEVICE_WINDOWS_PHONE);
  } else if (this.deviceGroup.blackberry) {
    devices = this.devList.getList(this.devList.DEVICE_BLACKBERRY);
  } else if (this.os.tizen) {
    devices = this.devList.getList(this.devList.DEVICE_TIZEN);
  } else if (this.os.windows) {
        // Not used.
  } else if (this.os.mac) {
        // Not used.
  } else { // 2%, Symbian, Series 40, 60 Firefox OS, others.
    //TBD
  }
//////////////////////////////////////
//TODO: make these all async in a promise chain
//TODO: make the loop below a separate callback function.
//TOOD: different loops for different types, possibly in the device-list function.
  this.json = this.devList.getDPDB(this.ua); ////////////////////////
  window.jj = this.json;
////////////////////////////////////////

  // Using the device list, run the tests.
  // TODO: move into deviceList
  for (var i in devices) {
    if (devices[i].detect(this.ua, this.display, this.tests)) {
      //console.log('i:' + i)
      this.device = devices[i];
      console.log('device found:' + this.device.label + '.');
      return true;
    }
  }
  console.warn('using generic device');
  this.device = this.devList.getDefault(this.display);

  // If we defaulted to desktop, consider this a detect.
  if(this.desktop == true) {
    this.detected = true;
  }
  return this.device;
}; // End of find device.

// Check if WebGL is present and enabled.
// https://www.browserleaks.com/webgl#howto-detect-webgl
DeviceInfo.prototype.detectGL_ = function() {
  var cs, ctx, canvas, webGL, glVersion, glVendor, glShaderVersion;
  // Test for HTML5 canvas
  this.tests.canvas = !!window.CanvasRenderingContext2D;

  // Test for WebGL.
  if (this.tests.canvas) {
    this.tests.webGL = false;
    cs = document.createElement('canvas');
    var names = ['webgl', 'webgl2', 'experimental-webgl', 'experimental-webgl2', 'moz-webgl', '3d', 'webkit-3d'];
    for (i in names) {
      try {
        ctx = cs.getContext(names[i]);
        if (ctx && ctx instanceof 'WebGLRenderingContext') {
          this.tests.webGL = true;
          this.tests.webGLCtxName = names[i];
        }
      } catch (e) {}
    }
  }

  // Get WebGL information for better feature detection.
  if (ctx) {
      this.tests.glVersion =  ctx.getParameter(ctx.VERSION).toLowerCase();
      this.tests.glVendor = ctx.getParameter(ctx.VENDOR).toLowerCase();
      this.tests.glShaderVersion = ctx.getParameter(ctx.SHADING_LANGUAGE_VERSION).toLowerCase();
      this.tests.glRenderer = ctx.getParameter(ctx.RENDERER).toLowerCase();
    }

  // Undefine the context and <canvas> we created.
  cs = ctx = undefined;

};

// Detect screen parameters reported by the browser.
// https://github.com/LeaVerou/dpi/blob/gh-pages/dpi.js
DeviceInfo.prototype.detectDisplay_ = function() {

  this.display = {
    touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch),
    pixelRatio: (window.devicePixelRatio ||
      (window.matchMedia && window.matchMedia('(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)').matches? 2 : 1) ||
      1.0),
    screenWidth: (Math.max(window.screen.width, window.screen.height)  || 0),
    screenHeight: (Math.min(window.screen.width, window.screen.height) || 0)
  };

  // Define display pixels and retina.
  this.display.pixelWidth = this.display.screenWidth * this.display.pixelRatio;
  this.display.pixelHeight = this.display.screenHeight * this.display.pixelRatio;
  this.display.retina = (this.display.pixelRatio > 1);

  // Use for combined ua and feature detects.
  var long     = Math.max(this.display.screenWidth, this.display.screenHeight);
  var short    = Math.min(this.display.screenWidth, this.display.screenHeight);
  this.display.longest = Math.max(long, short); // iPhone 4s: 480, iPhone 5: 568
};

// See if an event type is supported on the device.
DeviceInfo.prototype.detectEvents_ = function(elem, eventName) {
  eventName = 'on' + eventName;
  var isSupported = (eventName in elem);
  if (!isSupported) { // Firefox.
    el.setAttribute(eventName, 'return;');
    isSupported = typeof elem[eventName] == 'function';
  }
  return isSupported;
};

// Use a combination of browser features and user-agent sniffing to detect the correct device.
DeviceInfo.prototype.detectOS_ = function() {
  var m;
  var ua = this.ua;

  // OS detects.
  this.os = {
      ios: /(iphone|ipad|ipod)/.test(ua),
      crios: /(cros|crmo)/.test(ua),
      linux: (ua.indexOf('linux') >= 0),
      windowsphone: (ua.indexOf('windows phone') >= 0),
      blackberry: (/(blackberry|bb10|rim[0-9])/.test(ua)),
      tizen: (ua.indexOf('tizen') >= 0),
      firefoxos: (/mobile.*(firefox)/i.test(ua))
    };
  this.os.android = (!this.os.windowsphone && ua.indexOf('android') >= 0);
  this.os.mac = (!this.os.ios && ua.indexOf('mac os x') >= 0);
  this.os.windows = (!this.os.windowsphone && ua.indexOf('windows') >= 0);

  // OS Version detects (mobile only).
  if (this.os.ios) {
    m = (ua).match(/os (\d+)_(\d+)_?(\d+)?/);
    if (m && m[1] && m[2]) {
      this.os.version = parseFloat(m[1] + '.' + m[2]);
    }
  } else if (this.os.crios) {
    // TODO: CriOS detects here.
  } else if (this.os.linux) {
    // TODO: Linux detects here.
  } else if (this.os.android) {
    m = ua.match(/android (\d+(?:\.\d+)+)[;)]/);
    if (m && m[0]) {
      this.os.version = parseFloat(m[0]);
    }
  } else if (this.os.windowsphone) {
      m = ua.match(/windows phone (\d+\.\d+)/);
      if (m && m[1]) {
        this.os.version = parseFloat(m[1]);
      }
    } else if (this.os.blackberry) {
      if (ua.indexOf('bb10') >= 0) { // only Blackberry 10 phones would work (also support WebGL).
        m = ua.match(/bb10.*version\/(\d+\.\d+)?/);
        if (m && m[0]) {
          this.os.version = parseFloat(m[1]);
        }
      }
    } else if (this.os.tizen) {
        m = ua.match(/tizen.*(\d+\.\d+)/);
    } else if (this.os.windows) {
      // Not used.
    } else if (this.os.mac) {
      // Not used.
    } else {
    this.os.version = 0;
  }

}; // End of os detect function.

// Detect the general form factor.
DeviceInfo.prototype.detectFormFactor_ = function() {
  var ua = this.ua;
  // Form factor detects.
  this.mobile = this.os.ios || this.os.android || /mobi|ip(hone|od|ad)|touch|blackberry|bb10|windows phone|kindle|silk|htc|(hpw|web)os|opera mini|fxios/.test(ua);
  this.tablet = /ipad|tablet|nexus[\s]+(7|9|10)|playbook|silk|ideapad|slate|touchpad|playbook|toshiba|xoom/.test(ua);
  this.gameConsole = /(nintendo|wiiu|3ds|playstation|xbox)/.test(ua);
  this.tv = /(google|apple|smart|hbb|opera|pov|net).*tv|(lg|aquos|inettv).*browser|(roku|kylo|aquos|viera|espial|boxee|dlnadoc|crkey|ce-html)/.test(ua);
  this.desktop = !this.mobile && !this.tablet && !this.gameConsole && !this.tv || (window.screenX != 0);
}; // End of formfactor detect function.

/**
 * Calculates field of view for the left eye.
 */
DeviceInfo.prototype.getDistortedFieldOfViewLeftEye = function() {
  var viewer = this.viewer;
  var device = this.device;

  var distortion = new Distortion(viewer.distortionCoefficients);

  // Device.height and device.width for device in portrait mode, so transpose.
  var eyeToScreenDistance = viewer.screenLensDistance;

  var outerDist = (device.widthMeters - viewer.interLensDistance) / 2;
  var innerDist = viewer.interLensDistance / 2;
  var bottomDist = viewer.baselineLensDistance - device.bevelMeters;
  var topDist = device.heightMeters - bottomDist;

  var outerAngle = Util.radToDeg(Math.atan(
      distortion.distort(outerDist / eyeToScreenDistance)));
  var innerAngle = Util.radToDeg(Math.atan(
      distortion.distort(innerDist / eyeToScreenDistance)));
  var bottomAngle = Util.radToDeg(Math.atan(
      distortion.distort(bottomDist / eyeToScreenDistance)));
  var topAngle = Util.radToDeg(Math.atan(
      distortion.distort(topDist / eyeToScreenDistance)));

  return {
    leftDegrees: Math.min(outerAngle, viewer.fov),
    rightDegrees: Math.min(innerAngle, viewer.fov),
    downDegrees: Math.min(bottomAngle, viewer.fov),
    upDegrees: Math.min(topAngle, viewer.fov)
  }
};

DeviceInfo.prototype.getFieldOfViewLeftEye = function(opt_isUndistorted) {
  return opt_isUndistorted ? this.getUndistortedFieldOfViewLeftEye() :
      this.getDistortedFieldOfViewLeftEye();
};

DeviceInfo.prototype.getFieldOfViewRightEye = function(opt_isUndistorted) {
  var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);
  return {
    leftDegrees: fov.rightDegrees,
    rightDegrees: fov.leftDegrees,
    upDegrees: fov.upDegrees,
    downDegrees: fov.downDegrees
  };
};

/**
 * Calculates a projection matrix for the left eye.
 */
DeviceInfo.prototype.getProjectionMatrixLeftEye = function(opt_isUndistorted) {
  var fov = this.getFieldOfViewLeftEye(opt_isUndistorted);

  var projectionMatrix = new THREE.Matrix4();
  var near = 0.1;
  var far = 1000;
  var left = Math.tan(Util.degToRad(fov.leftDegrees)) * near;
  var right = Math.tan(Util.degToRad(fov.rightDegrees)) * near;
  var bottom = Math.tan(Util.degToRad(fov.downDegrees)) * near;
  var top = Math.tan(Util.degToRad(fov.upDegrees)) * near;

  // makeFrustum expects units in tan-angle space.
  projectionMatrix.makeFrustum(-left, right, -bottom, top, near, far);

  return projectionMatrix;
};


DeviceInfo.prototype.getUndistortedViewportLeftEye = function() {
  var p = this.getUndistortedParams_();
  var viewer = this.viewer;
  var device = this.device;

  var eyeToScreenDistance = viewer.screenLensDistance;
  var screenWidth = device.widthMeters / eyeToScreenDistance;
  var screenHeight = device.heightMeters / eyeToScreenDistance;
  var xPxPerTanAngle = device.width / screenWidth;
  var yPxPerTanAngle = device.height / screenHeight;

  var x = Math.round((p.eyePosX - p.outerDist) * xPxPerTanAngle);
  var y = Math.round((p.eyePosY - p.bottomDist) * yPxPerTanAngle);
  return {
    x: x,
    y: y,
    width: Math.round((p.eyePosX + p.innerDist) * xPxPerTanAngle) - x,
    height: Math.round((p.eyePosY + p.topDist) * yPxPerTanAngle) - y
  };
};

/**
 * Calculates undistorted field of view for the left eye.
 */
DeviceInfo.prototype.getUndistortedFieldOfViewLeftEye = function() {
  var p = this.getUndistortedParams_();

  return {
    leftDegrees: Util.radToDeg(Math.atan(p.outerDist)),
    rightDegrees: Util.radToDeg(Math.atan(p.innerDist)),
    downDegrees: Util.radToDeg(Math.atan(p.bottomDist)),
    upDegrees: Util.radToDeg(Math.atan(p.topDist))
  };
};

DeviceInfo.prototype.getUndistortedParams_ = function() {
  var viewer = this.viewer;
  var device = this.device;
  var distortion = new Distortion(viewer.distortionCoefficients);

  // Most of these variables in tan-angle units.
  var eyeToScreenDistance = viewer.screenLensDistance;
  var halfLensDistance = viewer.interLensDistance / 2 / eyeToScreenDistance;
  var screenWidth = device.widthMeters / eyeToScreenDistance;
  var screenHeight = device.heightMeters / eyeToScreenDistance;

  var eyePosX = screenWidth / 2 - halfLensDistance;
  var eyePosY = (viewer.baselineLensDistance - device.bevelMeters) / eyeToScreenDistance;

  var maxFov = viewer.fov;
  var viewerMax = distortion.distortInverse(Math.tan(Util.degToRad(maxFov)));
  var outerDist = Math.min(eyePosX, viewerMax);
  var innerDist = Math.min(halfLensDistance, viewerMax);
  var bottomDist = Math.min(eyePosY, viewerMax);
  var topDist = Math.min(screenHeight - eyePosY, viewerMax);

  return {
    outerDist: outerDist,
    innerDist: innerDist,
    topDist: topDist,
    bottomDist: bottomDist,
    eyePosX: eyePosX,
    eyePosY: eyePosY
  };
};

module.exports = DeviceInfo;
