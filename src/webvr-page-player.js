/*
 * Custom Player for webvr-page.
 *
 *
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
 var WebVRPageButtons = require('./webvr-page-buttons.js');

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

  // Save the renderer.
  this.renderer = renderer;

  // Save the drawing canvas.
  this.canvas = this.renderer.domElement;

  // Find the enclosing player container, or create one.
  this.dom = this.canvas.parentNode;

  // Add control buttons to screen, as necessary.
  this.buttons = new WebVRPageButtons(params);

  // Always resize the player to the initial aspect ratio (unless manually changed).
  this.aspect = this.getCurrentWidth() / this.getCurrentHeight();

};

WebVRPagePlayer.prototype = new Emitter();

// Respond to events.

// Screen toggling between full and DOM.
WebVRPagePlayer.prototype.onFullscreenChange_ = function() {
  console.log('Player onFullscreenChange event');
};

// Fullscreen request initiated, add fullscreen class and return element.
WebVRPagePlayer.prototype.requestFullscreen = function(e) {
  console.log('Player requestFullscreen');
  var cn = this.getContainer();
  var cs = this.getCanvas();
  // Return the parent DOM object (Player) rather than the drawing <canvas>.
  cn.classList.add(Util.fullscreenClass);
  return cn;
};

// Exit fullscreen request initiated, remove fullscreen classes.
WebVRPagePlayer.prototype.exitFullscreen = function(e) {
  console.log('Player exitFullscreen');
  var cn = this.getContainer();
  var cs = this.getCanvas();
  cn.classList.remove(Util.fullscreenClass);
};

// Get the Player container.
WebVRPagePlayer.prototype.getContainer = function() {
  return this.dom;
};

// Get the Player canvas.
WebVRPagePlayer.prototype.getCanvas = function() {
  return this.canvas;
};

WebVRPagePlayer.prototype.getAspect = function() {
  return this.aspect;
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
  var h;
  if(document.fullscreenElement !== null) {
    h = this.getCurrentHeight();
  } else {
    h = this.getCurrentWidth() / this.aspect;
  }
  return {
    width: this.getCurrentWidth(),
    height:h //this.getCurrentHeight()
  };
};

module.exports = WebVRPagePlayer;
