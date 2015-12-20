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

/**
 * Create the manager.
 * Naming conventions
 * @link https://google.github.io/styleguide/javascriptguide.xml
 */
function WebVRPageManager(renderer, effect, params) {
  this.params = params || {};


  // Begin listening for resize events.
  this.listenResize_();

};

// Handle a window resize event.
WebVRPageManager.prototype.resize_ = function(camera) {

};

// Start listening for window resize events.
WebVRPageManager.prototype.listenResize_ = function(camera) {

};

WebVRPageManager.prototype.render = function(scene, camera, timestamp) {

};

module.exports = WebVRPageManager;
