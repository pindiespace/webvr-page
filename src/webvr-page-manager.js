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
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 */

var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var Util = require('./util.js');
var WebVRPagePlayer = require('./webvr-page-player.js');

/**
 * Create the manager.
 * Naming conventions
 * @link https://google.github.io/styleguide/javascriptguide.xml
 */
function WebVRPageManager(renderer, effect, camera, params) {
  this.params = params || {};

  // Give a unique to ID to each manager.
  this.prefix = 'webvr';
  this.uid = Util.getUniqueId(this.prefix);

  // Save the THREE.js renderer and effect for later.
  this.renderer = renderer;
  this.effect = effect;
  this.camera = camera;

  // Get the Player object
  this.player = new WebVRPagePlayer(renderer, params);

  // Add a method to the THREE.JS effect to adjust field of view if necessary in VR mode.
  if(this.effect.setFOV !== 'function') {
    console.log('setFOV() missing from VREffect.js, adding it');
    this.effect.setFOV = function(fovL, fovR) {
      eyeFOVL = fovL;
      eyeFOVR = fovR;
    };
  }

  /*
   * Get info for any HMD (head-mounted device).
  */
  this.getDeviceByType_(HMDVRDevice).then(function(hmd) {
    this.hmd = hmd;
  }.bind(this));

  // Save the input device for later sending timing data.
  this.getDeviceByType_(PositionSensorVRDevice).then(function(input) {
    this.input = input;
  }.bind(this));

  console.log("GOT THE DEVICES")

  // Set default size.
  var size = this.player.getSize();
  this.resize(size.width, size.height);

  // Begin listening for resize events.
  this.listenResize_();

  // Begin listening for fullscreen events.
  this.listenFullscreen_();

  // Begin listening for orientation events.
  this.listenOrientation_();

  // Bind events.

  // Emit an a general initialization event to all managers on the page.
  this.emit('initialized');
};

WebVRPageManager.prototype = new Emitter();

// Make these modules visible outside manager.
WebVRPageManager.Modes = Modes;
WebVRPageManager.Util = Util;

// Render the scene.
WebVRPageManager.prototype.render = function(scene) {
  this.camera.updateProjectionMatrix();
  this.effect.render(scene, this.camera);
};

// Get the VR device.
WebVRPageManager.prototype.getDeviceByType_ = function(type) {
  return new Promise(function(resolve, reject) {
    navigator.getVRDevices().then(function(devices) {
      // Promise succeeds, but check if there are any devices actually.
      for (var i = 0; i < devices.length; i++) {
        if (devices[i] instanceof type) {
          resolve(devices[i]);
          break;
        }
      }
      resolve(null);
    }, function() {
      // No devices are found.
      resolve(null);
    });
  });
};

WebVRPageManager.prototype.getDefaultDeviceFOV_ = function() {
  return {
    downDegrees:40,
    leftDegrees:40,
    rightDegrees:40,
    upDegrees:40
  };
};

// Make a copy of the FOV for this device.
WebVRPageManager.prototype.cloneFOV_ = function(fovObj) {
  return {
    downDegrees:fovObj.downDegrees,
    upDegrees:fovObj.upDegrees,
    leftDegrees:fovObj.leftDegrees,
    rightDegrees:fovObj.rightDegrees
  };
};

// Polyfill for managinging different HMD object structures.
WebVRPageManager.prototype.getFOV_ = function() {
  var eyeFOVL, eyeFOVR;
  if(this.hmd) {
    var h = this.hmd;
    if (h.getEyeParameters !== undefined) {
      var eyeParamsL = h.getEyeParameters('left');
      var eyeParamsR = h.getEyeParameters('right');
      eyeFOVL = this.cloneFOV_(eyeParamsL.recommendedFieldOfView);
      eyeFOVR = this.cloneFOV_(eyeParamsR.recommendedFieldOfView);
    } else if (h.getRecommendedFOV !== undefined) {
      // MS Edge Browser in mobile emulation mode.
      var eyeParamsL = h.getRecommendedFOV('left');
      var eyeParamsR = h.getREcommendedFOV('right');
      eyeFOVL = this.cloneFOV_(eyeParamsL);
      eyeFOVR = this.cloneFOV_(eyeParamsR);
    } else {
      // Obsolete code path.
      eyeFOVL = this.cloneFOV_(h.getRecommendedEyeFieldOfView('left'));
      eyeFOVR = this.cloneFOV_(h.getRecommendedEyeFieldOfView('right'));
    }
  } else {
    // Return a generic FOV
    eyeFOVL = this.getDefaultDeviceFOV_();
    eyeFOVR = this.getDefaultDeviceFOV_();
  }
  return {
    eyeFOVL:eyeFOVL,
    eyeFOVR:eyeFOVR
  };
};

WebVRPageManager.prototype.adjustFOV_ = function(width, height) {
  if(this.hmd) {
    var aspectChange = height / (width);
    console.log("going to adjust FOV, aspectChange:" + aspectChange);
    var fov = this.getFOV_();
    if(aspectChange > 1) {
      fov.eyeFOVL.upDegrees = fov.eyeFOVL.downDegrees =
      fov.eyeFOVR.upDegrees = fov.eyeFOVR.downDegrees *= aspectChange;
    }
    this.effect.setFOV(fov.eyeFOVL, fov.eyeFOVR);
  }
}

// Start listening for fullscreen change and exit events.
WebVRPageManager.prototype.listenFullscreen_ = function() {
  // Whenever we enter fullscreen, we are entering VR or immersive mode.
  document.addEventListener('fullscreenchange',
    this.onFullscreenChange_.bind(this));

  document.addEventListener('exitfullscreen',
    this.onExitFullscreen_.bind(this));
};

// Start listening for orientation events.
WebVRPageManager.prototype.listenOrientation_ = function() {
  window.addEventListener('orientationchange',
      this.onOrientationChange_.bind(this));
};

// Start listening for window resize events.
WebVRPageManager.prototype.listenResize_ = function() {
  this.view = window;
  this.view.addEventListener('resize', function(e) {
    this.onResize_(e);
  }.bind(this), false);
};

// Callback for window resize events.
WebVRPageManager.prototype.onResize_ = function(e) {
  console.log('resize event');
  var size = this.player.getSize();
  this.resize(size.width, size.height);
};

// Resize the effect to a specific size. Does NOT resize the player container.
WebVRPageManager.prototype.resize = function(width, height) {
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
  this.effect.setSize(width, height);
};

// Take action when screen orientation changes.
WebVRPageManager.prototype.onOrientationChange_ = function(e) {
  console.log('Manager orientation change event, object is:' + e);
};

// Take action when screen toggles between normal and fullscreen.
WebVRPageManager.prototype.onFullscreenChange_ = function(e) {
  console.log("Manager onFullscreenChange_, target:" + e.target);
  console.log("Manager onFullscreenChange_, document.fullscreenElement is a:" + typeof document.fullscreenElement + " value:" + document.fullscreenElement)
  // Catches exit from fullscreen, both manually, and via 'escape' key pressed in fullscreen view.
  if(document.fullscreenElement === null) {
    console.log('Manager, exitFullscreen event triggered, dispatching exitfullscreen event');
    document.exitFullscreen();
    var event = new CustomEvent('exitfullscreen');
    document.dispatchEvent(event);
  }
  this.player.onFullscreenChange_(e);
};

// Take action when exiting a fullscreen. Triggered by custom event 'exitfullscreen'.
WebVRPageManager.prototype.onExitFullscreen_ = function(e) {
  console.log('Manager onExitFullscreen_ custom event, object is:' + e);
  console.log('ABOUT TO RESET FOV')
  var fov = this.getFOV_();
  window.fov =fov;
  this.effect.setFOV(fov.eyeFOVL, fov.eyeFOVR);
  this.exitFullscreen();
};

WebVRPageManager.prototype.onErrorFullscreen_ = function(e) {
  console.log('Manager error on fullscreen change, object is:' + e);
};

// Trigger a fullscreen event.
WebVRPageManager.prototype.requestFullscreen = function() {
  console.log('Manager USER entering fullscreen');

  // Adjust the scene to the screen dimensions.
  this.adjustFOV_(screen.width, screen.height);

  // Let the player know we are going to fullscreen, and let it choose the fullscreen element.
  var canvas = this.player.requestFullscreen();
  //this.effect.setFullScreen(true);
  //TODO: this is a way to pass in an altered HMD to the renderer
  //RECOMPUTE field of view, when pass in.

  // Trigger fullscreen.
  canvas.requestFullscreen({vrDisplay: this.hmd});
  //canvas.requestFullscreen();
};

// Trigger an exitfullscreen event.
WebVRPageManager.prototype.exitFullscreen = function() {
  console.log('exiting exitFullscreen');
  this.player.exitFullscreen();
  document.exitFullscreen();
};

module.exports = WebVRPageManager;
