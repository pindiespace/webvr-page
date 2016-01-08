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
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 */

var Emitter = require('./emitter.js');
var Modes = require('./modes.js');
var Util = require('./util.js');
var WebVRPageDialogs = require('./webvr-page-dialogs.js');

 /**
  * Everything having to do with the WebVR button.
  * Emits a 'click' event when it's clicked.
  */
function WebVRPageButtons(container, params) {

  this.BUTTON_CARDBOARD = 'cardboard';
  this.BUTTON_FULLSCREEN = 'fullscreen';
  this.BUTTON_EXIT_FULLSCREEN = 'exitfullscreen';
  this.BUTTON_VR = 'vr';
  this.BUTTON_BACK = 'back';
  this.BUTTON_SETTINGS = 'settings';

  this.buttonClasses = {
    button: '-button',      //prefix
    cardboard: '-' + this.BUTTON_CARDBOARD,
    back: '-' + this.BUTTON_BACK,          //back button
    fs: '-' + this.BUTTON_FULLSCREEN,      //fullscreen mode butto,n
    efs: '-' + this.BUTTON_EXIT_FULLSCREEN,
    vr: '-' + this.BUTTON_VR,              //vr mode button
    settings: '-' + this.BUTTON_SETTINGS  //settings panel
  };

  // Constants for setting the corner of the button display.
   this.buttonPositions = {
    topLeft:0,
    topRight:1,
    bottomRight:2,
    bottomLeft:3
  };

  this.buttonScale = 0.05; //5% of screen width (may vary).

  this.container = container; // Container DOM element for buttons.
  this.params = params;

  // Set a UID.
  this.uid = this.params.uid + this.buttonClasses.panel;

  this.loadIcons_();

};

WebVRPageButtons.prototype = new Emitter();

// Compute button size based on container size. Scale up for mobile.
WebVRPageButtons.prototype.calcButtonSize_ = function() {
  //TODO: write scaling function.
  return {
    width: parseInt(this.buttonScale * this.container.style.width),
    height: parseInt(this.buttonScale * this.container.style.height)
  };
};

// Create a button of a specific type
WebVRPageButtons.prototype.createButton = function(buttonType, buttonPosition) {
  // Use <img> element as button.
  var button = document.createElement('img');
  // Add button classes.
  Util.addClass(button, this.params.prefix + this.buttonClasses.button);

  // get the local style.
  var s = button.style;

  // Load a SVG icon for specific button type.
  button.src = this.icons[buttonType];
  // Compute size for current Player container.
  var sz = this.calcButtonSize_();
  s.width = sz.width;
  s.height = sz.height;
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  s.padding = '12px';
  s.zIndex = 1;
  s.display = 'none';

  // Position absolutely inside container.
  s.position = 'absolute';

  //set the button position in the container
  switch(buttonPosition) {
    case this.buttonPositions.topLeft:
      s.float = 'left';
      s.top = '0px';
      break;
    case this.buttonPositions.topRight:
      s.float = 'right';
      stip = '0px';
      break;
    case this.buttonPositions.bottomRight:
      s.float = 'right';
      s.bottom = '0px';
      break;
    case this.buttonPositions.bottomLeft:
      s.float = 'left';
      s.bottom = '0px';
      break;
    default:
      break;
  }

};

// Set the visiblity of a button, based on program mode.
WebVRPageButtons.prototype.setVisibility = function(mode) {
  //TODO: give all buttons a ruleset for determing if they should be visible.
};

// Use Emmier click binding, instead of DOM event listener.
WebVRPageButtons.prototype.createClickHandler_ = function(eventName) {
  return function(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log("*****************ABOUT TO EMIT:" + eventName + '-' + this.params.uid)
    this.emit(eventName + '-' + this.params.uid);
  }.bind(this);
};

 WebVRPageButtons.prototype.loadIcons_ = function() {
   // Preload some hard-coded SVG.
   this.icons = [];
   this.icons[this.BUTTON_CARDBOARD] = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMjAuNzQgNkgzLjIxQzIuNTUgNiAyIDYuNTcgMiA3LjI4djEwLjQ0YzAgLjcuNTUgMS4yOCAxLjIzIDEuMjhoNC43OWMuNTIgMCAuOTYtLjMzIDEuMTQtLjc5bDEuNC0zLjQ4Yy4yMy0uNTkuNzktMS4wMSAxLjQ0LTEuMDFzMS4yMS40MiAxLjQ1IDEuMDFsMS4zOSAzLjQ4Yy4xOS40Ni42My43OSAxLjExLjc5aDQuNzljLjcxIDAgMS4yNi0uNTcgMS4yNi0xLjI4VjcuMjhjMC0uNy0uNTUtMS4yOC0xLjI2LTEuMjh6TTcuNSAxNC42MmMtMS4xNyAwLTIuMTMtLjk1LTIuMTMtMi4xMiAwLTEuMTcuOTYtMi4xMyAyLjEzLTIuMTMgMS4xOCAwIDIuMTIuOTYgMi4xMiAyLjEzcy0uOTUgMi4xMi0yLjEyIDIuMTJ6bTkgMGMtMS4xNyAwLTIuMTMtLjk1LTIuMTMtMi4xMiAwLTEuMTcuOTYtMi4xMyAyLjEzLTIuMTNzMi4xMi45NiAyLjEyIDIuMTMtLjk1IDIuMTItMi4xMiAyLjEyeiIvPgogICAgPHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgyNHYyNEgwVjB6Ii8+Cjwvc3ZnPgo=');
   this.icons[this.BUTTON_FULLSCREEN] = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNNyAxNEg1djVoNXYtMkg3di0zem0tMi00aDJWN2gzVjVINXY1em0xMiA3aC0zdjJoNXYtNWgtMnYzek0xNCA1djJoM3YzaDJWNWgtNXoiLz4KPC9zdmc+Cg==');
   this.icons[this.BUTTON_EXIT_FULLSCREEN] = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNNSAxNmgzdjNoMnYtNUg1djJ6bTMtOEg1djJoNVY1SDh2M3ptNiAxMWgydi0zaDN2LTJoLTV2NXptMi0xMVY1aC0ydjVoNVY4aC0zeiIvPgo8L3N2Zz4K');
   this.icons[this.BUTTON_BACK] = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMjAgMTFINy44M2w1LjU5LTUuNTlMMTIgNGwtOCA4IDggOCAxLjQxLTEuNDFMNy44MyAxM0gyMHYtMnoiLz4KPC9zdmc+Cg==');
   this.icons[this.BUTTON_SETTINGS] = Util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0ZGRkZGRiI+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+CiAgICA8cGF0aCBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2Yy0uMTItLjIyLS4zOS0uMy0uNjEtLjIybC0yLjQ5IDFjLS41Mi0uNC0xLjA4LS43My0xLjY5LS45OGwtLjM4LTIuNjVDMTQuNDYgMi4xOCAxNC4yNSAyIDE0IDJoLTRjLS4yNSAwLS40Ni4xOC0uNDkuNDJsLS4zOCAyLjY1Yy0uNjEuMjUtMS4xNy41OS0xLjY5Ljk4bC0yLjQ5LTFjLS4yMy0uMDktLjQ5IDAtLjYxLjIybC0yIDMuNDZjLS4xMy4yMi0uMDcuNDkuMTIuNjRsMi4xMSAxLjY1Yy0uMDQuMzItLjA3LjY1LS4wNy45OHMuMDMuNjYuMDcuOThsLTIuMTEgMS42NWMtLjE5LjE1LS4yNC40Mi0uMTIuNjRsMiAzLjQ2Yy4xMi4yMi4zOS4zLjYxLjIybDIuNDktMWMuNTIuNCAxLjA4LjczIDEuNjkuOThsLjM4IDIuNjVjLjAzLjI0LjI0LjQyLjQ5LjQyaDRjLjI1IDAgLjQ2LS4xOC40OS0uNDJsLjM4LTIuNjVjLjYxLS4yNSAxLjE3LS41OSAxLjY5LS45OGwyLjQ5IDFjLjIzLjA5LjQ5IDAgLjYxLS4yMmwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NGwtMi4xMS0xLjY1ek0xMiAxNS41Yy0xLjkzIDAtMy41LTEuNTctMy41LTMuNXMxLjU3LTMuNSAzLjUtMy41IDMuNSAxLjU3IDMuNSAzLjUtMS41NyAzLjUtMy41IDMuNXoiLz4KPC9zdmc+Cg==');
 };

 module.exports = WebVRPageButtons;
