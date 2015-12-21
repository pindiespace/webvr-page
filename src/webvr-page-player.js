/*
 * Copyright 2015 Google Inc. All Rights Reserved.
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

var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var Util = require('./util.js');

/**
 * The Player is a wrapper for a VR-enabled canvas,
 * plus its controls. It is implemented as an html5
 * <figure> element with a <figcaption> describing
 * the VR scene. It also stores the last known style
 * of its canvas, for loop updates.
 *
 * Note: Renderer must have a canvas element to use.
 */
function WebVRPagePlayer(renderer, params) {

  // Save params.
  this.params = params || {};
  this.fullscreen = false;

  // Save the renderer.
  this.renderer = renderer;

  // Find the enclosing player container, or create one.
  this.dom = this.renderer.domElement.parentNode;

};

WebVRPagePlayer.prototype = new Emitter();

// Respond to events.

// Fullscreen request initiated.
WebVRPagePlayer.prototype.requestFullscreen_ = function() {
};

// Screen toggling between full and DOM.
WebVRPagePlayer.prototype.onFullscreenChange_ = function() {
  console.log('in Player fullscreen change');
  if(this.fullscreen === true) {
    this.fullscreen = false;
  } else {
    this.fullscreen = true;
  }
}

// Get the Player container.
WebVRPagePlayer.prototype.getContainer = function() {
  return this.dom;
};

// Get the computed width of the Player.
WebVRPagePlayer.prototype.getCurrentWidth = function() {
  return parseFloat(getComputedStyle(this.dom).getPropertyValue('width'));
};

// Get the computed height of the Player.
WebVRPagePlayer.prototype.getCurrentHeight = function() {
  return parseFloat(getComputedStyle(this.dom).getPropertyValue('height'));
}

WebVRPagePlayer.prototype.getSize = function() {
  return {
    width: this.getCurrentWidth(),
    height: this.getCurrentHeight()
  };
};

module.exports = WebVRPagePlayer;
