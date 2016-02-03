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
 * Viewer database, returns an object
 */

function ViewerList() {

  // Viewer group names.
  this.VIEWER_ALL = 0,
  this.VIEWER_CARDBOARD = 1;
  this.VIEWER_INCREDISONIC = 2;
  this.VIEWER_DESKTOP = 3;

  this.getList = function(whichList) {
    if(!whichList) {
      whichList = this.VIEWER_ALL;
    }
    switch(whichList) {
      case this.VIEWER_ALL:
        return this.merge(this.list.cardboard, this.list.incredisonic, this.list.desktop);
        break;
      case this.VIEWER_CARDBOARD:
        return this.list.cardboard;
        break;
      case this.VIEWER_INCREDISONIC:
        return this.list.incredisonic;
        break;
      case this.VIEWER_DESKTOP: // Desktop and large tablets.
        return this.list.desktop;
        beak;
      default:
        return {};
        break;
     }

  };

  // Default viewer object.
  this.getDefault = function(viewerName) {
    switch (viewerName) {
      case this.VIEWER_DESKTOP:
        console.warn('using generic desktop viewer');
        return this.list.desktop.generic;
      break;
      case this.VIEWER_CARDBOARD:
        console.warn('using generic mobile viewer');
        return this.list.cardboard.cardboardv1;
      break;
      default:
        console.warn('using generic mobile viewer');
        return this.list.cardboard.cardboardv1;
      break;
    }
    //return this.list.cardboard.cardboardv1;
    //return this.list.incredisonic.vue;
  };

  /*
   * Merge several JS objects into a single object.
   * Used to create DISPLAY_ALL from individual databases.
   * https://jsfiddle.net/ppwovxey/1/
   * var combined_object=object_merge(object1,object2,object3);
   * var combined_object=object_merge({},object1,object2,object3);
   */
  this.merge = function() {
    for (var i = 1; i < arguments.length; i++) {
      for (var a in arguments[i]) {
        arguments[0][a] = arguments[i][a];
      }
    }
    return arguments[0];
  };

  this.list = {};
  this.list.desktop = { // Desktop and large tablets. Dynamically compute approximate screen size.
    generic: {
      label: 'Generic Desktop',
      fov: 40,
      interLensDistance: ((screen.width / 4) / 96 ) * 0.0254,
      baselineLensDistance: ((screen.width / 8) / 96) * 0.0254,
      screenLensDistance: 1,
      distortionCoefficients: [0.441, 0.156],
      inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139,
        -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841,
        0.0651772, -0.01488963, 0.001559834]
    }
  },
  this.list.cardboard = {
    cardboardv1: {
      label: 'Cardboard I/O 2014',
      fov: 40,
      interLensDistance: 0.060,
      baselineLensDistance: 0.035,
      screenLensDistance: 0.042,
      distortionCoefficients: [0.441, 0.156],
      inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139,
        -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841,
        0.0651772, -0.01488963, 0.001559834]
    },
    cardboardv2: {
      label: 'Cardboard I/O 2015',
      fov: 60,
      interLensDistance: 0.064,
      baselineLensDistance: 0.035,
      screenLensDistance: 0.039,
      distortionCoefficients: [0.34, 0.55],
      inverseCoefficients: [-0.33836704, -0.18162185, 0.862655, -1.2462051,
        1.0560602, -0.58208317, 0.21609078, -0.05444823, 0.009177956,
        -9.904169E-4, 6.183535E-5, -1.6981803E-6]
    }
  }; // End of Viewer list.

  this.list.incredisonic = {
    vue: {
      label: 'Incrediconic VUE 2015',
      fov: 60,
      interLensDistance: 0.060,
      baselineLensDistance: 0.035,
      screenLensDistance: 0.042,
      distortionCoefficients: [0.441, 0.156],
      inverseCoefficients: [-0.4410035, 0.42756155, -0.4804439, 0.5460139,
        -0.58821183, 0.5733938, -0.48303202, 0.33299083, -0.17573841,
        0.0651772, -0.01488963, 0.001559834]
    }
  };

}; // End of function.

module.exports = ViewerList;
