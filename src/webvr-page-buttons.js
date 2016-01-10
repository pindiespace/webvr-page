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
  this.BUTTON_BACK = 'back';
  this.BUTTON_SETTINGS = 'settings';
  this.BUTTONS_PANEL = 'panel';

  this.buttonClasses = {
    button: '-button',      //prefix
    cardboard: '-' + this.BUTTON_CARDBOARD,
    back: '-' + this.BUTTON_BACK,          //back button
    fullscreen: '-' + this.BUTTON_FULLSCREEN,      //fullscreen mode butto,n
    exitfullscreen: '-' + this.BUTTON_EXIT_FULLSCREEN,
    settings: '-' + this.BUTTON_SETTINGS,  //settings panel
    panel: '-' + this.BUTTONS_PANEL        //panel class
  };

  // Constants for setting the corner of the button display.
   this.domPositions = {
    TOP_LEFT:0,
    TOP_RIGHT:1,
    BOTTOM_RIGHT:2,
    BOTTOM_LEFT:3,
    CENTER_TOP:4,
    CENTER_BOTTOM:5,
    CENTER_CENTER:6
  };

  this.dom = null; // DOME object for Panel enclosing all buttons.
  this.buttons = []; // Link to individual button DOM objects.

  this.buttonScale = 0.05; //5% of screen width (may vary).
  this.buttonPadding = '12';

  this.container = container; // Container DOM element for buttons.
  this.params = params;

  // Set a UID.
  this.uid = this.params.uid;

  // Set up the button panel.
  this.initPanel_();

  // Load images associated with the buttons.
  this.loadIcons_();

};

WebVRPageButtons.prototype = new Emitter();

//TODO: move panel position setting to Player (also center-center)
/*
var w = $(this).width();

    //get div dimensions
    var div_h =$('#imgContainer').height();
    var div_w =$('#imgContainer').width();

    //set img position
    this.style.top = Math.round((div_h - h) / 2) + 'px';
    this.style.left = '50%';
    this.style.marginLeft = Math.round(w/2) + 'px';

*/

// Each WebVRPageButtons object is a panel to which buttons may be added or removed.
WebVRPageButtons.prototype.initPanel_ = function(panelPosition) {
  this.dom = document.createElement('nav');

  // Set the id and class.
  this.dom.id = this.uid + this.buttonClasses.panel;
  Util.addClass(this.dom, this.params.prefix + this.buttonClasses.panel);

  // Default panel position in Player.
  if(this.params.panelPosition) {
    this.dom.quadrant = this.params.panelPosition;
  } else {
    this.dom.quadrant = this.domPositions.BOTTOM_RIGHT;
  }

  // Set CSS styles.
  var s = this.dom.style;
  //s.border = '1px solid orange';
  s.width = '100%';
  s.height = (this.calcButtonSize_().height + (this.buttonPadding * 2)) + 'px';
  s.position = 'absolute';

  // set Panel position in the Player.
  this.setPanelPosition(this.dom.quadrant);

  // Style button on hover.
  this.dom.addEventListener('mouseenter', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.tagName === 'IMG') {
      var s = e.target.style;
      s.filter = s.webkitFilter = 'drop-shadow(0 0 5px rgba(255,255,255,1))';
    }
  }, true);
  this.dom.addEventListener('mouseleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.tagName === 'IMG') {
      var s = e.target.style;
      s.filter = s.webkitFilter = '';
    }
  }, true);

  // Add the button panel to the Player.
  this.container.appendChild(this.dom);
};

// Create a button of a specific type
WebVRPageButtons.prototype.createButton = function(buttonType, display) {
  // Use <img> element as button.
  var button = document.createElement('img');

  // Give button a unique Id.
  button.id = this.uid + this.buttonClasses[buttonType];

  // Add button classes.
  Util.addClass(button, this.params.prefix + this.buttonClasses.button);

  // get the local style.
  var s = button.style;

  // Load a SVG icon for specific button type.
  button.src = this.icons[buttonType];

  // Compute size for current Player container.
  var sz = this.calcButtonSize_();

  // Set button styles.
  s.width = sz.width + 'px';
  s.height = sz.height + 'px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.cursor = 'pointer';
  s.padding = this.buttonPadding + 'px';
  s.marginLeft = s.padding;
  s.zIndex = 100000;

  // Set display
  if (display) {
    s.display = 'block';
  } else {
    s.display = 'none';
  }

  // Position absolutely inside container.
  //s.position = 'absolute';

  //set the button position in the container
  switch(this.dom.quadrant) {
    case this.domPositions.TOP_LEFT:
    case this.domPositions.BOTTOM_LEFT:
      s.float = 'left';
      break;
    case this.domPositions.TOP_RIGHT:
    case this.domPositions.BOTTOM_RIGHT:
      s.float = 'right';
      break;
    case this.domPositions.CENTER_TOP:
      //TODO:
      break;
    case this.domPositions.CENTER_BOTTOM:
      //TODO:
      break;
    default:
      break;
  }

  // Store a reference to the button
  this.buttons.push(button);

  // Add the button to the DOM container.
  this.dom.appendChild(button);

  // return the button for further manipulation
  return button;
};

WebVRPageButtons.prototype.setPanelPosition = function(quadrant) {
  this.dom.quadrant = quadrant;
  var s = this.dom.style;
  var dist = '0px';
  switch(quadrant) {
    case this.domPositions.TOP_LEFT:
      s.top = dist;
      s.left = dist;
      break;
    case this.domPositions.TOP_RIGHT:
      s.top = dist;
      s.right = dist;
      break;
    case this.domPositions.BOTTOM_RIGHT:
      s.bottom = dist;
      s.right = dist;
      break;
    case this.domPositions.BOTTOM_LEFT:
      s.bottom = dist;
      s.left = dist;
      break;
    case this.domPositions.CENTER_TOP:
    //TODO:
      break;
    case this.domPositions.CENTER_BOTTOM:
    //TODO:
      break;
    case this.domPositions.CENTER_CENTER:
      break;
    default:
      break;
  }
};

// Compute button size (CSS pixels) based on container size. Scale up for mobile.
WebVRPageButtons.prototype.calcButtonSize_ = function() {
  var w = parseInt(this.buttonScale * Util.getElementWidth(this.container));
  var h = parseInt(this.buttonScale * Util.getElementHeight(this.container));
  // Size accd. to Windows Guidelines, 34 px cutoff (Apple seems a bit large).
  // https://www.smashingmagazine.com/2012/02/finger-friendly-design-ideal-mobile-touchscreen-target-sizes/
  if (h < 34) {
    w = h = 34;
    this.buttonPadding = parseInt(0.1 * h);
  }
  return {
    width: w,
    height: h,
  };
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
