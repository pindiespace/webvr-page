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
 */

 var Emitter = require('./emitter.js');
 var Modes = require('./modes.js');
 var Util = require('./util.js');

 /**
  * Create dialog windows and buttons.
  */
function WebVRPageDialogs(params) {
  this.params = params || {};

 };

WebVRPageDialogs.prototype = new Emitter();

WebVRPageDialogs.prototype.createWindow_ = function() {

};

WebVRPageDialogs.prototype.createButton_ = function() {

};

WebVRPageDialogs.prototype.createErrorMsg = function(msg) {
  if(document.createElement) {
  var element = document.createElement( 'div' );
  element.id = this.params.uid + '-error-message' || 'error';
  element.style.fontFamily = 'monospace';
  element.style.fontSize = '13px';
  element.style.fontWeight = 'normal';
  element.style.textAlign = 'center';
  element.style.background = '#fff';
  element.style.color = '#000';
  element.style.padding = '1.5em';
  element.style.width = '400px';
  element.style.margin = '5em auto 0';
} else {
  alert(msg); // Never going to run this app.
}

};

 module.exports = WebVRPageDialogs;
