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

var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var CardboardDistorter = require('./cardboard-distorter.js');
var DeviceInfo = require('./device-info.js');
var ViewerInfo = require('./viewer-info.js');
var Util = require('./util.js');
var WebVRPagePlayer = require('./webvr-page-player.js');

/**
 * WebVR page
 * A DOM-friendly WebVR implementation
 *
 * WebVR Spec.
 * http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Create the manager.
 * Naming conventions
 * @link https://google.github.io/styleguide/javascriptguide.xml
 */
function WebVRPageManager(renderer, effect, camera, params) {
  this.params = params || {};

  // Give a unique to ID to each manager.
  this.prefix = 'webvr';
  this.uid = Util.getUniqueIncrementingId(this.prefix);

  // Set manager uid.
  params.prefix = this.prefix;
  params.uid = this.uid;

  // Set the default Mode.
  this.mode = params.mode || Modes.ViewStates.DOM;

  // Save the THREE.js renderer, effect, and camera for later.
  this.renderer = renderer;
  this.effect = effect;
  this.camera = camera;

  /*
   * Whether or not the FOV should be distorted or un-distorted. By default, it
   * should be distorted, but in the case of vertex shader based distortion,
   * ensure that we use undistorted parameters.
   */
  this.isUndistorted = !!this.params.isUndistorted;

  // Create the Player and define its buttons.
  this.player = new WebVRPagePlayer(this.renderer, params);

  // Get available device information, along with viewer params.
  this.deviceInfo = new DeviceInfo(params);
  this.viewerInfo = this.deviceInfo.viewerInfo;

  window.deviceInfo = this.deviceInfo; //TODO: remove....//////////////////////////////////////

  // Get the Cardboard distorter.
  this.distorter = new CardboardDistorter(this.renderer, this.deviceInfo);

  // Bind updates in Device to callback distorter recalculations.
  this.deviceInfo.on(Modes.EmitterModes.DEVICE_CHANGED, this.onDeviceChanged_.bind(this));
  var dev = this.deviceInfo.getDevice();
  console.log('Using the %s device.', this.deviceInfo.getDevice().label);

  // Force viewerType if we are a desktop or large tablet (which couldn't fit into a Cardboard viewer).
  if (this.deviceInfo.desktop || this.deviceInfo.tablet) {
    this.viewerInfo.setViewer(this.viewerInfo.viewerList.VIEWER_DESKTOP);
  }
  /*
   * Bind updates in viewer to callback field of view calculations. These calcs
   * use both Device and Viewer information.
   * getDistortedFieldOfViewLeftEye()
   * getUndistortedViewportLeftEye()
   * getUndistortedParams_()
   */
  this.viewerInfo.on(Modes.EmitterModes.VIEWER_CHANGED, this.onViewerChanged_.bind(this));
  this.deviceInfo.viewer = this.viewerInfo.getViewer();
  console.log('Using the %s viewer.', this.viewerInfo.getViewer().label);

  /*
  * Bind the state Buttons in the Player state panel to callbacks. We emit the individual
  * button.id value rather than a generic emit() string to make it specific to the Button
  * and this Manager (allowing multiple Managers on the page).
  */
  this.stateButtons = this.player.getStatePanel();
  this.stateButtons.on(this.stateButtons.getButtonId(Modes.ButtonTypes.BUTTON_FULLSCREEN), this.requestFullscreen.bind(this));
  this.stateButtons.on(this.stateButtons.getButtonId(Modes.ButtonTypes.BUTTON_VR), this.requestVR.bind(this));

  // Init the button in the Player back panel.
  this.backButtons = this.player.getBackPanel();
  this.backButtons.on(this.backButtons.getButtonId(Modes.ButtonTypes.BUTTON_BACK), this.exitFullscreen.bind(this));

  console.log('about to check for hmd')
  // Get info for any HMD (head-mounted device).
  this.getDeviceByType_(HMDVRDevice).then(function(hmd) {
    if (hmd) {
      // Enable barrel distortion.
      console.log('forcing distortion, hmd present:' + hmd.deviceName);
      this.distorter.setActive(true);
      this.hmd = hmd;
    } else if (WebVRConfig.FORCE_DISTORTION) {
      // Enable barrel distortion.
      console.log('no hmd, forcing distortion due to WebVRConfig');
      this.distorter.setActive(true);
    } else {
      console.log('no hmd, no distortion forcing');
    }
  }.bind(this));

  // Save the input device for later sending timing data.
  this.getDeviceByType_(PositionSensorVRDevice).then(function(input) {
    this.input = input;
  }.bind(this));

  // Set default size.
  var size = this.player.getSize();
  this.resize(size.width, size.height);

  this.listenMotion_();

  // Begin listening for resize events.
  this.listenResize_();

  // Begin listening for fullscreen events.
  this.listenFullscreen_();

  // Begin listening for device orientation events.
  this.listenOrientation_();

  // Bind events.

  // Emit an a general initialization event to all managers on the page.
  this.emit(this.prefix + Modes.EmitterModes.PROGRAM_INITIALIZED);
};

// Make this an Emitter.
WebVRPageManager.prototype = new Emitter();

// Make Modes visible statically to all parts of our app.
WebVRPageManager.Modes = Modes;

// Make Util visible so we can use it in scene construction.
WebVRPageManager.Util = Util;

/**
 * Render the scene. Either render directly, or render to a
 * texture, adding appropriated barrel distortion for the current
 * HMD.
 */
WebVRPageManager.prototype.render = function(scene) {

  if(this.mode == Modes.ViewStates.VR) {
    this.distorter.preRender();
    this.effect.render(scene, this.camera); // Stereo images.
    this.distorter.postRender();
  } else {
    // Scene may be an array of two scenes, one for each eye.
    if (scene instanceof Array) {
      this.renderer.render(scene[0], this.camera);
    } else {
      this.renderer.render(scene, this.camera);
    }
  }
};

// Get the current Viewer.
WebVRPageManager.prototype.getViewer = function() {
  return this.deviceInfo.getViewer();
};

// Get the current Device.
WebVRPageManager.prototype.getDevice = function() {
  return this.deviceInfo.getDevice();
};

// Get the VR Device, hmd, positionsensor.
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

/**
 * Sets parameters on CardboardHMDVRDevice. These changes are ultimately handled
 * by VREffect.
 */
WebVRPageManager.prototype.setHMDVRDeviceParams_ = function(viewer) {
  this.getDeviceByType_(HMDVRDevice).then(function(hmd) {
    if (!hmd) {
      console.error('in setHMDVRDeviceParams_, no hmd present');
      return;
    }

    console.log('in setHMDVRDeviceParams, hmd present, setting HMDVRDeviceParams');

    // If we can set fields of view, do that now.
    if (hmd.setFieldOfView) {
      // Calculate the optimal field of view for each eye.
      hmd.setFieldOfView(this.deviceInfo.getFieldOfViewLeftEye(this.isUndistorted),
                         this.deviceInfo.getFieldOfViewRightEye(this.isUndistorted));
    }

    // Note: setInterpupillaryDistance is not part of the WebVR standard.
    if (hmd.setInterpupillaryDistance) {
      hmd.setInterpupillaryDistance(viewer.interLensDistance);
    }

    if (hmd.setRenderRect) {
      // TODO(smus): If we can set the render rect, do it.
      //var renderRect = this.deviceInfo.getUndistortedViewportLeftEye();
      //hmd.setRenderRect(renderRect, renderRect);
    }
  }.bind(this));
};

// Start listening for motion events.
WebVRPageManager.prototype.listenMotion_ = function() {
  /*
  window.addEventListener('devicemotion',
    this.onMotionChange_.bind(this));
    */
};

// Start listening for orientation events.
WebVRPageManager.prototype.listenOrientation_ = function() {
  window.addEventListener('orientationchange',
      this.onOrientationChange_.bind(this));
};

// Start listening for fullscreen change and exit events.
WebVRPageManager.prototype.listenFullscreen_ = function() {
  // Whenever we enter fullscreen, we are entering VR or immersive mode.
  document.addEventListener('fullscreenchange',
    this.onFullscreenChange_.bind(this));

  document.addEventListener('exitfullscreen',
    this.onExitFullscreen_.bind(this));
};

// Start listening for window resize events.
WebVRPageManager.prototype.listenResize_ = function() {
  this.view = window;
  this.view.addEventListener('resize', function(e) {
    this.onResize_(e);
  }.bind(this), false);
};

// Callback for device motion changes.
WebVRPageManager.prototype.onMotionChange_ = function(e) {
  console.log('devicemotion detected');
  var current = e.accelerationIncludingGravity,
    time,
    diff,
    deltaX = 0,
    deltaY = 0,
    deltaZ = 0,
    dist;
};

// Callback for screen orientation changes.
WebVRPageManager.prototype.onOrientationChange_ = function(e) {
  console.log('Manager orientation change event, object is:' + e);
};

// Callback for window resize events.
WebVRPageManager.prototype.onResize_ = function(e) {
  var size = this.player.getSize();
  console.log('onresize event, width:' + size.width + ' height:' + size.height);
  this.resize(size.width, size.height);
};

// Callback for Viewer changed.
WebVRPageManager.prototype.onViewerChanged_ = function(viewer) {
  console.log('Viewer changed to:' + viewer.label);
  // this.viewerInfo.setViewer(viewer);

  console.log("ONVIEWERCHANGED: this.distorter.updateDeviceInfo");
  // Update the distortion appropriately.
  this.distorter.updateDeviceInfo(this.deviceInfo);

  // And update the HMDVRDevice parameters.
  this.setHMDVRDeviceParams_(viewer);

  // Notify anyone interested in this event.
  //this.emit(Modes.EmitterModes.VIEWER_CHANGED, viewer);
};

// Callback for Device changed.
WebVRPageManager.prototype.onDeviceChanged_ = function(device) {
  console.log("******+++++++*********IN UPDATEDEVICEINFO")

  console.log('Device changed to:' + device.label);
  //this.deviceInfo.updateDeviceParams(newParams);
  console.log("ONDEVICECHANGED: this.distorter.updateDeviceInfo:" + this.distorter.updateDeviceInfo)
  this.distorter.updateDeviceInfo(this.deviceInfo);
  console.log(")))))))WE ARE PAST THE UPDATEDEVICEINFO CALL")
};

// Resize the effect to a specific size. Does NOT resize the player container.
WebVRPageManager.prototype.resize = function(width, height) {
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(width, height);
  this.effect.setSize(width, height);
};

// Take action when screen toggles between normal and fullscreen.
WebVRPageManager.prototype.onFullscreenChange_ = function(e) {
  console.log("Manager onFullscreenChange_, target:" + e.target);
  console.log("Manager onFullscreenChange_, document.fullscreenElement is a:" + typeof document.fullscreenElement + " value:" + document.fullscreenElement)
  // Catches exit from fullscreen, both manually, and via 'escape' key pressed in fullscreen view.
  if (document.fullscreenElement === null) {
    console.log('Manager, exitFullscreen event triggered, dispatching exitfullscreen event');
    /////////////document.exitFullscreen();
    var event = new CustomEvent('exitfullscreen');
    document.dispatchEvent(event);
  } else {
    // Catch fullscreen late
  }

  this.player.onFullscreenChange_(e);
};

// Take action when exiting a fullscreen. Triggered by custom event 'exitfullscreen'.
WebVRPageManager.prototype.onExitFullscreen_ = function(e) {
  console.log('>>>>>>>>Manager onExitFullscreen_ custom event, object is:' + e);
  this.exitFullscreen();
};

// Fullscreen error callback.
WebVRPageManager.prototype.onErrorFullscreen_ = function(e) {
  console.log('Manager error on fullscreen change, object is:' + e);
};

// Trigger a fullscreen event.
WebVRPageManager.prototype.requestFullscreen = function() {
  // Trigger fullscreen or fullscreen-VR only if we support it.
  if (this.params.detector.webGL) {
    console.log('Manager requestFullscreen() - entering fullscreen, mode:' + this.mode);
    if (this.mode == Modes.ViewStates.VR) {
      console.log('Manager requestFullscreen() - exiting VR');
      this.exitVR();
    }

    // Set to fullscreen mode. May be changed if we go to VR.
    this.setMode(Modes.ViewStates.FULLSCREEN);

    // Let the player know we are going to fullscreen, and let it choose the fullscreen element.
    this.player.requestFullscreen(this.hmd);

    // Adjust the scene to the screen dimensions.
    console.log("in requestFullscreen() WIDTH:" + screen.width + " HEIGHT:" + screen.height)

  }
};

// Trigger an exitfullscreen event.
WebVRPageManager.prototype.exitFullscreen = function() {
  console.log('exiting exitFullscreen, FIRST mode is:' + this.mode);
  if(this.mode == Modes.ViewStates.VR) {
    this.exitVR(); // Normal screen never VR.
  }
  console.log("exiting exitFullscreen, SECOND mode is:" + this.mode);
  /*
   * We have to do this tests since an exit from fullscreen might happen by
   * 1. button pressed (would generate loops due to CustomEvent)
   * 2. escape key pressed (requires CustomEvent to fire properly)
   */
  if(this.mode !== Modes.ViewStates.DOM) {
    this.player.exitFullscreen();
    this.setMode(Modes.ViewStates.DOM);
    document.exitFullscreen();
  }

};

// Jump to VR (stereo) rendering mode. Also jumps to fullscreen.
WebVRPageManager.prototype.requestVR = function() {
  // Patch renderer to render barrel-distorted images in stereo.
  if (this.mode === Modes.ViewStates.VR) {
    console.warn('warning mode is already VR');
    return;
  }

  /*
   * TODO: we get distortion because we can't make two square stereo images.
   * TODO: we can do one of two things:
   * TODO: 1. change vertical FieldOfView
   * TODO: 2. shrink longest dimension of <canvas> so stereo images are exactly square.
   *
   * TODO: flip to fullscreen on orientation change, out when flipping back.
   * TODO: do by computing width and height.
   */

  this.requestFullscreen();
  this.distorter.patch(this.camera);
  this.setMode(Modes.ViewStates.VR);
};

// Exit VR (stereo) rendering mode. Called by exitFullscreen() fullscreen to DOM.
WebVRPageManager.prototype.exitVR = function() {
  this.distorter.unpatch();
};

// Update according to the current mode.
WebVRPageManager.prototype.setMode = function(mode) {
  // Redundant mode change.
  var oldMode = this.mode;
  if (mode == this.mode) {
    console.error('Not changing modes, already in %s', mode);
    return;
  } else if (mode == undefined) {
    console.error('Not changing modes, in %s, mode is undefined', this.mode);
    return;
  }
  console.log('Mode change: %s => %s', this.mode, mode);

  this.mode = mode;

  // Update Player element visiblity.

  // Update Dialog visibility.

  // Change the mode.
  switch(mode) {
    case Modes.ViewStates.DOM:
      break;
    case Modes.ViewStates.FULLSCREEN:
      break;
    case Modes.ViewStates.VR:
      this.setHMDVRDeviceParams_(this.viewerInfo.getViewer());
      break;
    default:
      console.error('Unknown mode: %s => %s', this.mode, mode);
      break;
  }

  // Emit an event indicating the mode changed.
  this.emit(this.prefix + Modes.EmitterModes.MODE_CHANGE, mode, oldMode);

};

module.exports = WebVRPageManager;
