/*
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

// Emitter message strings.
var EmitterModes = {
  PROGRAM_INITIALIZED: '-initialized', // Manager-specific
  MODE_CHANGE: '-modechange',
  DEVICE_CHANGED: 'devicechanged', // Common to multiple managers on the page.
  VIEWER_CHANGED: 'viewerchanged'
};

// Ui (View) states.
var ViewStates = {
  UNKNOWN: 'unknown',
  THUMBNAIL: 'thumbnail',
  DOM: 'dom', // Not fullscreen, may be in DOM.
  FULLSCREEN: 'fullscreen', // Magic window fullscreen immersive mode.
  VR: 'vr' // VR mode (always in fullscreen).
};

// State of elements in DOM or in 3D scene.
var ElementStates = {
  IN_DOM: 'text-in-dom', // Element is a 2D DOM element
  IN_SPRITE: 'text-in-sprite' // Element is a sprite in the scene
};

// Type of modal dialog windows.
var DialogTypes = {
  DIALOG: 'dialog',
  DIALOG_ALERT: 'alert',
  DIALOG_DEVICE_MENU: 'device-menu',
  DIALOG_HMD_SELECT: 'hmd-select'
};

// Types and features of control panels in the Player.
var PanelTypes = {
  PANEL: 'panel',
  // Panel name: state
  PANEL_STATE: 'panel-state',
  // Panel name: back
  PANEL_BACK: 'panel-back',
  TOP_LEFT: 'topleft',
  TOP_RIGHT: 'topright',
  BOTTOM_LEFT: 'bottomleft',
  BOTTOM_RIGHT: 'bottomright',
  CENTER_TOP: 'centertop',
  CENTER_BOTTOM: 'centerbottom',
  CENTER_CENTER: 'centercenter'
};

// Types of buttons in the Player control panels.
var ButtonTypes = {
  BUTTON_CARDBOARD: 'cardboard', //TODO: currently not used, using BUTTON_VR
  BUTTON_HMD: 'hmd',
  BUTTON_FULLSCREEN: 'fullscreen',
  BUTTON_VR: 'vr',
  BUTTON_EXIT_FULLSCREEN: 'exitfullscreen',
  BUTTON_BACK: 'back',
  BUTTON_SETTINGS: 'settings',
  BUTTON_SETTINGS_DEVICE: 'settings-device'
};

module.exports.EmitterModes = EmitterModes;
module.exports.ViewStates = ViewStates;
module.exports.DialogTypes = DialogTypes;
module.exports.PanelTypes = PanelTypes;
module.exports.ButtonTypes = ButtonTypes;
