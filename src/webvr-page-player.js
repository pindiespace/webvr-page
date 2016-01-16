/*
 * Custom Player for webvr-page.
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
var WebVRPageDialogs = require('./webvr-page-dialogs.js');
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
function WebVRPagePlayer(renderer, params, buttonTypes) {

  // CSS classes.
  this.playerClasses = {
    player: 'player',    //player suffix
    caption: 'caption', //<figcaption> suffix
    canvas: 'canvas',   //canvas suffix
  };

  this.dom = null;
  this.buttons = [];
  this.caption = null;

  // Save params.
  this.params = params || {uid: Util.getUniqueId()};

  // Assign base uid for Player elements.
  this.uid = (params.uid || Util.getUniqueId()) + '-' + this.playerClasses.player;

  // Create default text for <figcaption> element.
  this.captionDefault = 'WebVR Page Player Scene #' + parseInt(params.uid);

  // Save a warning if HTML5 canvas is not supported.
  this.canvasWarn = 'Your web browser does not support HTML5 canvas. You need to upgrade to a modern browser.';

  // Save a warning if 3D is not supported.
  this.webglWarn = 'Your web browser cannot support 3D drawing necessary for VR. You need to upgrade to a modern browser';

  // Save the renderer.
  this.renderer = renderer;

  // Save the drawing canvas.
  this.canvas = this.renderer.domElement;

  // Find the enclosing Player container (a <figure>), or create one.
  this.initFigure_();

  // Display error messages if we can't support WebGL or other features.
  this.errorMsgIfNeeded_();

  // Add control buttons to screen, as necessary.
  this.initButtons_(buttonTypes);

  // Find the <figcaption> element, or create one.
  this.initCaption_();

  // Always resize the player to the initial aspect ratio (unless manually changed).
  this.aspect = this.getCurrentWidth() / this.getCurrentHeight();

  // flag initialization.
  this.ready = true;
};

WebVRPagePlayer.prototype = new Emitter();

// Overwrite the <canvas> with errors if we can't run.
WebVRPagePlayer.prototype.errorMsgIfNeeded_ = function() {
  if(!this.params.canvas) {
    //TODO: message
  } else if(!this.params.webgl) {
    //TODO: call dialog manager with message
  }
};

// Get the player Id.
WebVRPagePlayer.prototype.getPlayerId = function() {
  return this.uid;
}

// Get the Player container.
WebVRPagePlayer.prototype.getContainer = function() {
  return this.dom;
};

// Get the Player canvas.
WebVRPagePlayer.prototype.getCanvas = function() {
  return this.canvas;
};

// Set up Player <figure> element.
WebVRPagePlayer.prototype.initFigure_ = function() {
  var c = this.canvas;

  // If our canvas isn't wrapped in a Player <figure> container, add it.
  if (c.parentNode.tagName != 'FIGURE') {
    this.dom = document.createElement('figure');
    c.parentNode.appendChild(this.dom);
    this.dom.appendChild(c);
  }
  else {
    // Supplied <canvas> is already inside a <figure> tag.
    this.dom = c.parentNode;
  }

  // Set up CSS classes.
  var d = this.dom;
  var prefix = Util.parseText(this.params.uid);

  // Set the Player id and standard class.
  if (!d.id) {
    d.id = this.getPlayerId();
  }
  Util.addClass(d, prefix + this.playerClasses.player);

  // Must use relative positioning for Player child elements to be absolutely positioned.
  d.style.position = 'relative';

  // Set the Player canvas id and standard class
  if (!c.id) {
    c.id = this.uid + this.playerClasses.canvas;
  }
  Util.addClass(c, prefix + this.playerClasses.canvas);

  // Set the ARIA attribute for figure caption.
  d.setAttribute('aria-describedby', this.uid + '-' + this.playerClasses.caption);
};

// Create control buttons.
WebVRPagePlayer.prototype.initButtons_ = function(buttonTypes) {
  this.initStatePanel_();
  this.initBackPanel_();
};

// Create buttons controlling state.
WebVRPagePlayer.prototype.initStatePanel_ = function() {
  // Create VR and fullscreen buttons. Save as associative for manager access.
  this.statePanel = new WebVRPageButtons(Modes.PanelTypes.PANEL_STATE, Modes.PanelTypes.BOTTOM_RIGHT, this.dom, this.params);
  this.buttons[Modes.ButtonTypes.BUTTON_FULLSCREEN] = this.statePanel.createButton(Modes.ButtonTypes.BUTTON_FULLSCREEN, true);
  this.buttons[Modes.ButtonTypes.BUTTON_CARDBOARD] = this.statePanel.createButton(Modes.ButtonTypes.BUTTON_CARDBOARD, true);

};

// Create buttons jumping to the last state.
WebVRPagePlayer.prototype.initBackPanel_ = function() {
  // Create a back button, visible only in fullscreen.
  this.backPanel = new WebVRPageButtons(Modes.PanelTypes.PANEL_BACK, Modes.PanelTypes.TOP_LEFT, this.dom, this.params);
  this.backPanel.setPanelPosition(Modes.ButtonTypes.TOP_LEFT);
  this.buttons[Modes.ButtonTypes.BUTTON_BACK] = this.backPanel.createButton(Modes.ButtonTypes.BUTTON_BACK, true);
};

// Get buttons currently in the Player.
WebVRPagePlayer.prototype.getStatePanel = function() {
  return this.statePanel;
};

WebVRPagePlayer.prototype.getBackPanel = function() {
  return this.backPanel;
};

// Set up the Player caption element.
WebVRPagePlayer.prototype.initCaption_ = function() {
  var figCaption = Util.getChildrenByTagName(this.dom, 'figcaption');
    if (figCaption[0]) {
      figCaption = figCaption[0];
    } else {
      figCaption = document.createElement('figcaption');
      this.dom.appendChild(figCaption);
    }

    // Link caption to its parent figure (required by ARIA).
    figCaption.id = this.dom.getAttribute('aria-describedby');

    // Set the standard class.
    var prefix = Util.parseText(this.params.uid);
    Util.addClass(figCaption, prefix + this.playerClasses.player + '-' + this.playerClasses.caption);

    // Add caption text, if supplied, otherwise default.
    if (this.params.caption) {
      figCaption.textContent = this.params.caption;
    } else {
      if (figCaption.textContent == '') {
        figCaption.textContent = this.captionDefault;
      }
    }

    // Caption style, typically near the bottom and centered.
    var s = figCaption.style;
    s.position = 'absolute';
    if(this.backPanel) {
      s.marginBottom = this.backPanel.dom.style.height;
    } else {
      s.marginBottom = '24px'
    }
    s.width = '100%';
    s.textAlign = 'center';

    // Save a reference
    this.caption = figCaption;

    // Show it.
    this.setCaptionVisibility(true);
};

// Get the Player caption.
WebVRPagePlayer.prototype.getCaption = function() {
  return this.caption;
};

// Set the visibility of the caption in the DOM.
// TODO: handle visibility as a DOM element, or a Sprite.
WebVRPagePlayer.prototype.setCaptionVisibility = function(mode) {
  if(mode) {
    this.caption.style.visibility = 'block';
  } else {
    this.caption.style.visibility = 'none';
  }
};

/*
 * Player objects can be 2D DOM elements in the web page, or
 * 3D elements embedded in the scene. This function convets DOM elements
 * to Sprites,or does the reverse.
 */
WebVRPagePlayer.setLocation = function(loc) {
  if (loc == Modes.IN_DOM) {
    // Move the elements into the DOM.
  } else if (loc == Modes.IN_SPRITE) {
    // Make the element a sprite in the 3D scene.
  }
};

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
  Util.addClass(cn, Util.fullscreenClass);
  //cn.classList.add(Util.fullscreenClass);
  return cn;
};

// Exit fullscreen request initiated, remove fullscreen classes.
WebVRPagePlayer.prototype.exitFullscreen = function(e) {
  console.log('Player exitFullscreen');
  var cn = this.getContainer();
  var cs = this.getCanvas();
  Util.removeClass(cn, Util.fullscreenClass);
  //cn.classList.remove(Util.fullscreenClass);
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
