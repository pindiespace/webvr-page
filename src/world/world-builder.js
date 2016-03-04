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
 */

 //Note: we assume THREE.js is loaded.

function WebVRWorld(Detector, width, height, depth) {
  this.canvas = null;
  this.camera = null;
  this.renderer = null;
  this.effect = null;
  this.controls = null;
  this.scene = null;
  // Return the world, decorated with required elements.

};

// Set THREE.JS as our prototype. This makes world-building more direct.
WebVRWorld.prototype = THREE;

//TODO: the returns are temporary.

WebVRWorld.prototype.addCanvas = function() {
  return this.canvas;
};

// Create a camera to look at this world.
WebVRWorld.prototype.addCamera = function(fov, aspect, near, far) {
  this.camera = new this.PerspectiveCamera(fov, aspect, near, far);
  return this.camera;
};

WebVRWorld.prototype.addRenderer = function() {
  return this.renderer;
};

WebVRWorld.prototype.addEffect = function() {
  return this.effect;
};

WebVRWorld.prototype.addControls = function(controls) {
  return this.controls;
};

WebVRWorld.prototype.createScene = function() {
  this.scene = new this.Scene();
  return this.scene;
};

// Create a world. Override specifics of world here.
WebVRWorld.prototype.createWorldObject = function() {

};
