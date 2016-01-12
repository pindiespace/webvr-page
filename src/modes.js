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
  // Who knows, Highlander?
  UNKNOWN: 'unknown',
  // Not fullscreen, may be in DOM.
  DOM: 'dom',
  // Request fullscreen in progress.
  REQUEST_FULLSCREEN: 'requestfullscreen',
  // Magic window fullscreen immersive mode.
  FULLSCREEN: 'fullscreen',
  // Exiting fullscreen.
  EXIT_FULLSCREEN: 'exitfullscreen',
  // VR mode (always in fullscreen).
  VR: 'vr',
  // Back button.
  BACK: 'back',
  // Information dialog.
  INFO: 'info',
};

var DialogTypes = {
  ALERT: 'alert',
  DEVICE_SELECT: 'device-select',
  HMD_SELECT: 'hmd-select'
};

var PanelTypes = {
  // Panel name: state
  PANEL_STATE: 'panel-state',
  // Panel name: back
  PANEL_BACK: 'panel-back',
  TOP_LEFT: 'topleft',
  TOP_RIGHT: 'topright',
  BOTTOM_LEFT: 'bottomleft',
  BOTTOM_RIGHT: 'bottomright',
};

var ButtonTypes = {
  CARDBOARD: 'cardboard',
  HMD: 'hmd',
  FULLSCREEN: 'fullscreen',
  EXIT_FULLSCREEN: 'exitfullscreen',
  BACK: 'back',
  SETTINGS: 'settings',
  DEVICE: 'device'
};



module.exports.Modes = Modes;
module.exports.DialogTypes = DialogTypes;
module.exports.PanelTypes = PanelTypes;
module.exports.ButtonTypes = ButtonTypes;
