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

function WebVRWorld(canvas, width, height, depth, webgl) {
  this.canvas = canvas;
  this.camera = null;
  this.effect = null;
  this.controls = null;
  this.scene = new THREE.Scene();
  this.aspect = null;

  this.addVRRenderer(webgl);
  this.addVREffect();

  // Return the world, decorated with required elements.

};

// Set THREE.JS as our prototype. This makes world-building more direct.
WebVRWorld.prototype = THREE;

//TODO: the returns are temporary.

// Create a camera to look at this world.
WebVRWorld.prototype.addView = function(fov, aspect, near, far) {

  this.camera = new this.PerspectiveCamera(fov, aspect, near, far);
  this.addVRControls();
  return this.camera;
};

WebVRWorld.prototype.addVRRenderer = function(webGL) {
  if(!this.canvas) {
    console.error('no canvas, no renderer added');
    return false;
  }
  if(webGL) { // 3D scenes ok.
    this.renderer = new this.WebGLRenderer({
      antialias: true,
      canvas: this.canvas
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
  } else { // Can't do 3d, just draw the scene once and use as a fallback image.
    console.warn('no webGL, fallback to canvas still image rendering of scene');
    this.renderer = new this.CanvasRenderer({
      antialias: true,
      canvas: this.canvas
    });
  }
  return this.renderer;
};

WebVRWorld.prototype.addVREffect = function() {
  if(!this.renderer) {
    console.error('no renderer present, effect not added');
  }
  this.effect = new this.VREffect(this.renderer);
  return this.effect;
};

WebVRWorld.prototype.addVRControls = function() {
  if(!this.camera) {
    console.error('no camera present, no controls added');
    return false;
  }
  this.controls = new this.VRControls(this.camera);
  return this.controls;
};

WebVRWorld.prototype.createScene = function() {
  this.scene = new this.Scene();
  return this.scene;
};

WebVRWorld.prototype.addObject = function(obj) {
  return this.scene.add(obj)
};

WebVRWorld.prototype.removeObject = function(obj) {
  return this.scene.remove(obj);
}
