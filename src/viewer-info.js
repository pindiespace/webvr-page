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
 * This object loads VR viewer descriptions.
 */

 var Util = require('./util.js');
 var Emitter = require('./emitter.js');
 var Modes = require('./modes.js');
 var ViewerList = require('./viewer/viewer-list.js');

function ViewerInfo(params) {
  this.viewer = null;

  this.params = params || {};

  // Get the viewer database.
  this.viewerList = new ViewerList();

  // Get a viewer by default.
  if(this.params.viewerName) {
    console.log('VIEWER SEARCHING FOR:' + this.params.viewerName)
      if (this.setViewer(this.params.viewerName)) {
        console.log("successfully set Viewer to:" + this.params.viewerName)
        this.emit(Modes.EmitterModes.VIEWER_CHANGED, this.viewer); /////////////////////////////
      }
  }
  console.log(">>>>>THIS VIEWER:" + this.viewer);
  // Call this.getViewer() to search for a viewer.

};

ViewerInfo.prototype = new Emitter();

// Get a named viewer.
ViewerInfo.prototype.getViewer = function() {
  if(!this.viewer) {
    this.detectViewer_();
  }
  return this.viewer;
};

ViewerInfo.prototype.setViewer = function(viewerName) {
  if(viewerName) {
    return this.detectViewer_(viewerName);
  }
  console.error('ViewerInfo.setViewer(), no viewer name set');
  return false;
};

// Get a list of viewer names
ViewerInfo.prototype.getViewerNames = function(viewerList) {
  var names = [];

  var list = this.viewerList.getList(viewerList);
  for (var i in list) {
    names.push(i);
  }
  list = null;
  return names;
};

ViewerInfo.prototype.getViewerLabels = function(viewerList) {
  var labels = [];
  if(!viewerList) {
    viewerList = this.viewerList.VIEWER_ALL;
  }
  var list = this.viewerList.getList(viewerList);
  for (var i in list) {
    labels.push(list[i].label);
  }
  list = null;
  return labels;
};

ViewerInfo.prototype.getViewerByName = function(viewerName) {
  var list = this.viewerList.getList(this.viewerList.VIEWER_ALL);
  var viewer = list[viewerName];
  if(viewer) {
    return viewer;
  }
  console.error('Viewer ' + viewerName + ' not found in lists');
  return null;
};

// Detect a Viewer, if it can be detected.
ViewerInfo.prototype.detectViewer_ = function() {
  //TODO: write a detection script..

  // Otherwise, get the default viewer.
  console.warn('using generic viewer');
  this.viewer = this.viewerList.getDefault();

  // Emit view change.
  console.log('########ABOUT TO VIEWER EMIT');
  this.emit(Modes.EmitterModes.VIEWER_CHANGED, this.viewer); /////////////////////////////

  return this.viewer;
};

// Scan for a list of Viewers matching keywords
ViewerInfo.prototype.searchViewer = function(keywords) {
  //TODO: write a progressive search funciton
};

// Get the default Field of View.
ViewerInfo.prototype.getDefaultFOV_ = function() {
  return {
    downDegrees:40,
    leftDegrees:40,
    rightDegrees:40,
    upDegrees:40
  };
};

module.exports = ViewerInfo;
