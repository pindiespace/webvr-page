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

var Modes = {
  UNKNOWN: 'unknown',
  DOM: 'dom', // Not fullscreen, may be in DOM.
  REQUEST_FULLSCREEN: 'requestfullscreen', // Request fullscreen in progress.
  FULLSCREEN: 'fullscreen', // Magic window fullscreen immersive mode.
  EXIT_FULLSCREEN: 'exitfullscreen', // Exiting fullscreen.
  VR: 'vr', // VR mode (always in fullscreen).
  BACK: 'back', // Back button.
  INFO: 'info', // Information dialog.
  TEXT_IN_DOM: 'text-in-dom', // Element is a 2D DOM element
  TEXT_IN_SPRITE: 'text-in-sprite' // Element is a sprite in the scene
};

var DialogTypes = {
  DIALOG: 'dialog',
  DIALOG_ALERT: 'alert',
  DIALOG_DEVICE_MENU: 'device-menu',
  DIALOG_HMD_SELECT: 'hmd-select'
};

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

var ButtonTypes = {
  BUTTON_CARDBOARD: 'cardboard',
  BUTTON_HMD: 'hmd',
  BUTTON_FULLSCREEN: 'fullscreen',
  BUTTON_EXIT_FULLSCREEN: 'exitfullscreen',
  BUTTON_BACK: 'back',
  BUTTON_SETTINGS: 'settings',
  BUTTON_SETTINGS_DEVICE: 'settings-device'
};

module.exports.Modes = Modes;
module.exports.DialogTypes = DialogTypes;
module.exports.PanelTypes = PanelTypes;
module.exports.ButtonTypes = ButtonTypes;
