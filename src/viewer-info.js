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
 var ViewerList = require('./viewer/viewer-list.js');

function ViewerInfo(params) {
  this.foundViewer = null;

  // Get the viewer database.
  this.viewerList = new ViewerList();

  // Get a viewer by default.
  if(params.viewerName) {
      this.setViewer(params.viewerName);
  } else {
    this.getViewer(); // Default.
  }

};

// Get a named viewer.
ViewerInfo.prototype.getViewer = function() {
  if(!this.foundViewer) {
    this.detectViewer_();
  }
  return this.foundViewer;
};

ViewerInfo.prototype.setViewer = function(viewerName) {
  if(viewerName) {
    return this.detectViewer_(viewerName);
  }
  console.error('ViewerInfo.setViewer(), no viewer name set');
  return {};
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
  return {};
};

// Detect a Viewer, if it can be detected.
ViewerInfo.prototype.detectViewer_ = function() {
  //TODO: write a detection script..

  // Otherwise, get the default viewer.
  console.warn('using generic viewer');
  this.foundViewer = this.viewerList.getDefault();
  return this.foundViewer;
  return {};
};

// Scan for a list of devices matching keywords
ViewerInfo.prototype.searchViewer = function(keywords) {
  //TODO: write a progressive search funciton
};

ViewerInfo.prototype.getLeftFOV_ = function() {

};

ViewerInfo.prototype.getRightFOV_ = function() {

};

ViewerInfo.prototype.getDistortedLeftFOV_ = function() {

};

ViewerInfo.prototype.getProjectionMatrixLeft_ = function() {

};

ViewerInfo.prototype.getUndistortedViewportLeft_ = function() {

};

ViewerInfo.prototype.getUndistortedFieldOfViewLeft_ = function() {

};

module.exports = ViewerInfo;
