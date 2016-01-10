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
 var WebVRPageButtons = require('./webvr-page-buttons.js');

 /**
  * Create dialog windows and buttons.
  */
function WebVRPageDialogs(params) {

  this.DEFAULT_WIDTH = 480;
  this.DEFAULT_HEIGHT = 360;
  this.DIALOG = 'dialog';
  this.DIALOG_MENU = 'dialog-menu'; // Ajax selection menu.

  // CSS classes.
  this.dialogClasses = {
    dialog: this.DIALOG,
    dialogMenu: this.DIALOG_MENU
  };

  // Save params.
  this.params = params || {};

  // Assign base uid for Player elements.
  this.uid = (this.params.uid || Util.getUniqueId()) + this.dialogClasses.dialog;

  // Containing DOM element for dialog.
  this.container = document.body;

 };

WebVRPageDialogs.prototype = new Emitter();

// Create a page dialog.
WebVRPageDialogs.prototype.createDialog_ = function(container, width, height, ok,cancel, callback) {
  this.container = container;
  var sz = this.adjustDialogSize_(width, height);

  this.dom = document.createElement('div');
  if(this.dom) {
    var d = this.dom;
    d.id = this.params.uid + this.dialogClasses.DIALOG;
    d.style.fontFamily = 'monospace';
    d.style.fontSize = '13px';
    d.style.fontWeight = 'normal';
    d.style.textAlign = 'center';
    d.style.background = '#fff';
    d.style.color = '#000';
    d.style.padding = '1.5em';
    d.style.width = sz.width + 'px';
    d.style.height = sz.height + 'px';
    d.style.margin = 'auto 0 auto 0';
    d.style.borderRadius = '6px';
    d.style.zIndex = 16777271; // Should support old browsers.
  } else {
    // TODO: respond to 'ok' and 'cancel' options.
    alert('error');
  }
};

// Close an existing dialog.
WebVRPageDialogs.prototype.closeDialog_ = function() {
  // Hide the dialog.
  if(this.dom) {

    // Zero out the dialog.
    this.dom = null;
  }
};

// Check if a dialog is visible.
WebVRPageDialogs.prototype.isOpenDialog = function() {
  return this.dom ? true : false;
};

// Add a Button (actually a button panel) to the dialog.
WebVRPageDialogs.prototype.addButton_ = function() {

};

// Add text to the dialog.
WebVRPageDialogs.prototype.addText_ = function() {

};

// Adjust dialog for the screen.
WebVRPageDialogs.prototype.adjustDialogSize_ = function(width, height) {
  if(this.container) {
    if (!width) {
      width = this.DEFAULT_WIDTH;
    }
    if (!height) {
      height = this.DEFAULT_HEIGHT;
    }
    var w = Util.getElementWidth(this.container);
    var h = Util.getElementHeight(this.container);
    if(!w || !h) {
      console.error('could not calculate dialog size');
      return;
    }
    // If the dialog is bigger than screen, shrink it.
    if (width > w) {
      width = w;
    }
    if (height > h) {
      height = h;
    }
  }
  return {
    width:width,
    height:height
  };
};

// Force horizontal and vertical centering for an element.
WebVRPageDialogs.prototype.centerCenter_ = function(elem) {
  var d = this.dom;
  var widthPercent = 100 * ((this.container.style.width - d.style.width) / d.style.width);
  var heightPercent = ((this.container.stye.height - d.style.height) / d.style.height);
  d.style.width = widthPercent + '%';
  d.style.height = heightPercent + '%';
  d.style.overflow = 'auto';
  d.style.margin = 'auto';
  d.style.position = 'absolute';
  d.top = d.left = d.bottom = d.right = '0';
/*
.Center-Container {
  position: relative;
}

.Absolute-Center {
  width: 50%;
  height: 50%;
  overflow: auto;
  margin: auto;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
}
*/
};

 module.exports = WebVRPageDialogs;
