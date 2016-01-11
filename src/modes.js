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
  // Magic window fullscreen immersive mode.
  FULLSCREEN: 'fullscreen',
  // Full screen split screen VR mode.
  EXIT_FULLSCREEN: 'exitfullscreen',
  // VR mode.
  VR: 'vr',
  // Back button.
  BACK: 'back',
  // Settings dialog.
  SETTINGS: 'settings',
  // Menu select dialog.
  MENU: 'menu',
  // Information dialog.
  INFO: 'info',
  //position top left
  //position top right
  //position bottom right
  //position bottom left
};

module.exports = Modes;
