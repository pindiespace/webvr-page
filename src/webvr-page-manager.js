/*
 * This application is Licensed under the Apache License, Version 2.0 (the "License");
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
 *
 * Portions of this software derive from webvr-boilerplate
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
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

  // Get info for any HMD (head-mounted device).
  // Check if the browser is compatible with WebVR.
  this.getDeviceByType_(HMDVRDevice).then(function(hmd) {
    this.hmd = hmd;
  }.bind(this));

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

  // Emit an initialization event to all managers on the page.
  this.emit('initialized');
};

WebVRPageManager.prototype = new Emitter();

WebVRPageManager.prototype.render = function(scene) {
  this.effect.render( scene, this.camera );
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

WebVRPageManager.prototype.listenFullscreen_ = function() {
  // Whenever we enter fullscreen, we are entering VR or immersive mode.
  document.addEventListener('fullscreenchange',
    this.onFullscreenChange_.bind(this));

  document.addEventListener('exitFullscreen',
    this.exitFullscreen_.bind(this));
};

// Listen for orientation events.
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
  //camera.aspect = window.innerWidth / window.innerHeight;
  //camera.updateProjectionMatrix();
  //effect.setSize( window.innerWidth, window.innerHeight );
  console.log('resize event');
  var size = this.player.getSize();
  this.resize(size.width, size.height);
};

// Resize the effect to a specific size. Does NOT resize the player container.
WebVRPageManager.prototype.resize = function(width, height) {
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.effect.setSize(width, height);
};

WebVRPageManager.prototype.onFullscreenChange_ = function(e) {
  console.log("FULLSCREENCHANGE E IS A:" + e)
  this.player.onFullscreenChange_()
  console.log('fullscreen change');
};

WebVRPageManager.prototype.onOrientationChange_ = function(e) {
  console.log("ORIENTATION E IS A:" + e)
  console.log('orientation change');
};

WebVRPageManager.prototype.requestFullscreen_ = function() {
  console.log('entering fullscreen');
  this.player.requestFullscreen_();
  var canvas = this.player.getContainer();
  canvas.requestFullscreen({vrDisplay: this.hmd});
};

WebVRPageManager.prototype.exitFullscreen_ = function() {
  console.log('exiting fullscreen');
  document.exitFullscreen();
};


module.exports = WebVRPageManager;
