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
 * Device database, returns an object
 */
 function DeviceList() {
   this.DEVICE_ALL = 0,
   this.DEVICE_IPHONE = 1,
   this.DEVICE_IPAD = 2,
   this.DEVICE_IPOD = 3,
   this.DEVICE_ANDROID = 4,
   this.DEVICE_WINDOWS_PHONE = 5,
   this.DEVICE_TIZEN = 6,
   this.DEVICE_BLACKBERRY = 7,
   this.DEVICE_GAME_CONSOLE = 8,
   this.DEVICE_TV = 9;

   // TODO: Future versions could get this info from a dynamic database.
   // Choose a DeviceList to load.
   this.getList = function(whichList) {
     if(!whichList) {
       whichList = this.DEVICE_ALL;
     }
     switch(whichList) {
       case this.DEVICE_ALL:
        return this.merge(this.list.iphone, this.list.android, this.list.windowsphone);
        break;
      case this.DEVICE_IPHONE:
        return this.list.iphone;
        break;
      case this.DEVICE_ANDROID:
        return this.list.android;
        break;
      case this.DEVICE_WINDOWS_PHONE:
        return this.list.windowsphone;
        break;
      default:
        break;
      }
  };

   /*
    * https://jsfiddle.net/ppwovxey/1/
    * var combined_object=object_merge(object1,object2,object3);
    * var combined_object=object_merge({},object1,object2,object3);
    */
  this.merge = function() {
    for (var i = 1; i < arguments.length; i++) {
	     for (var a in arguments[i]) {
           arguments[0][a] = arguments[i][a];
         }
    }
    return arguments[0];
  };

  /*
   * Data lists.
   * http://www.tera-wurfl.com/explore/search.php?search
   * http:/www.gsmarena.com
   * http://www.webapps-online.com/online-tools/user-agent-strings
   * http://support.blackberry.com/kb/articleDetail?articleNumber=000033531
   * http://www.zytrax.com/tech/web/browser_ids.htm
   * UA specs http://developer.samsung.com/technical-doc/view.do?v=T000000203
   */
  this.list = {};

  this.list.iphone = {
  iphone3: { // iPhone 3GS, non-Retina.
    name: 'iPhone 3',
    detect: function(ua, display, glVersion) {
        return (display.longest <= 480 && !display.retina && glVersion.indexOf('535') >= 0);
    },
    width: 360,
    height: 480,
    widthMeters: 0.0492,
    heightMeters: 0.628,
    bevelMeters: 0
  },
  iphone4: { //4 and 4s
    name: 'iPhone 4',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 480 && display.retina && glVersion.indexOf('535') >=0);
    },
    width: 640,
    height: 960,
    widthMeters: 0.075,
    heightMeters: 0.0495,
    bevelMeters: 0.004
  },
  iphone5: { // iPhone 5, 5c
    name: 'iPhone 5',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 568 && glVersion.indexOf('543'));
    },
    width: 640,
    height: 1136,
    widthMeters: 0.09011,
    heightMeters: 0.05127,
    bevelMeters: 0.00343
  },
  iphone5s: { // iPhone 5s
    name: 'iPhone 5s',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 568 && glVersion.indexOf('a7'));
    },
    width: 640,
    height: 1136,
    widthMeters: 0.09011,
    heightMeters: 0.05127,
    bevelMeters: 0.00343
  },
  iphone6: {
    name: 'iPhone 6',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 736 && glVersion.indexof('a8'));
    },
    width: 750,
    height: 1334,
    widthMeters: 0.1038,
    heightMeters: 0.0584,
    bevelMeters: 0.004
  },
  iphone6plus: {
    name: 'iPhone 6 Plus',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 736 && glVersion.indexOf('a8'));
    },
    width: 1242,
    height: 2208,
    widthMeters: 0.12235,
    heightMeters: 0.06954,
    bevelMeters: 0.00471
  },
  iphone6s: {
    name: 'iPhone 6s',
    detect: function(ua, display, glVersion) {
      return (display.longest <= 736 && glVersion.indexOf('a9'));
    },
    width: 750,
    height: 1334,
    widthMeters: 0.1038,
    heightMeters: 0.0584,
    bevelMeters: 0.004
  }
};

  // iPads are unlikely VR systems, have similar hardware.
  this.list.ipad = {};

  // iPods are problably too small, but share hardware.
  this.list.ipod = {};

  /*
   * Android devices are accessed as a group.
   */
  this.list.android = {
  note4: {
    name: 'Note 4',
    detect: function(ua, display, glVersion) {
        return ua.indexOf('sm-n910c') >= 0;
    },
    width: 2560,
    height: 1440,
    widthMeters: 0.125,
    heightMeters: 0.70,
    bevelMeters: 0
  },
  note5: {
    name: 'Note 5',
    detect: function(ua, display, glVersion) {
        return ua.indexOf('sm-a920') >=0;
    },
    width: 2560,
    height: 1440,
    widthMeters: 0.125,
    heightMeters: 0.70,
    bevelMeters: 0
  },
  nexus5: {
    name: 'Nexus 5',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('nexus 5 ') >= 0;
    },
    width:1920,
    height:1080,
    widthMeters: 0.110,
    heightMeters: 0.062,
    bevelMeters: 0.004
  },
  nexus6: { // Nexus 6, 6p
    name: 'Nexus 6',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('nexus 6') >= 0;
    },
    width:2560,
    height:1440,
    widthMeters: 0.1593,
    heightMeters: 0.083,
    bevelMeters: 0.004
  },
  nexus6p: {
    name: 'Nexus 6P',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('nexus 6p') >= 0;
    },
    width:2560,
    height:1440,
    widthMeters: 0.126,
    heightMeters: 0.0705,
    bevelMeters: 0.004
  },
  galaxygrand: { // Old phone, less likely
    name: 'Galaxy Grand',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-g7102') >= 0;
    },
    width:800,
    height:480,
    widthMeters: 0.109,
    heightMeters: 0.065,
    bevelMeters: 0.004
  },
  galaxygrandprime: {
    name: 'Galaxy Grand Prime',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-g530h') >= 0;
    },
    width:960,
    height:540,
    widthMeters: 0.1108,
    heightMeters: 0.0623,
    bevelMeters: 0
  },
  galaxys3: {
    name: 'Galaxy S3',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('gt-i9300') >= 0;
    },
    width: 0,
    height: 0,
    widthMeters: 0.106,
    heightMeters: 0.060,
    bevelMeters: 0.005
  },
  galaxys4: {
    name: 'Galaxy S4',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('gt-i9505') >= 0;
    },
    width: 1920,
    height: 1080,
    widthMeters: 0.111,
    heightMeters: 0.0625,
    bevelMeters: 0.004
  },
  galaxys5: {
    name: 'Galaxy S5',
    detect: function(ua, display, glVersion) {
      return /(sm-g900|scl23|sc04f)/.test(ua);
    },
    width: 0,
    height: 0,
    widthMeters: 0.113,
    heightMeters: 0.066,
    bevelMeters: 0.005
  },
  galaxys5mini: {
    name: 'Galaxy S5 Mini',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-g800f') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.0997,
    heightMeters: 0.561,
    bevelMeters: 0
  },
  galaxys6: { // S6, S6 edge
    name: 'Galaxy S6',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-g920') >= 0;
      return /(sm-g950|sm-g925)/.test(ua);
    },
    width: 2560,
    height: 1440,
    widthMeters: 0.114,
    heightMeters: 0.0635,
    bevelMeters: 0.0035
  },
  galaxya3: { // 4.7"
    name: 'Galaxy A3',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-a300') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1042,
    heightMeters: 0.0586,
    bevelMeters: 0
  },
  galaxya5: { // 6"
    name: 'Galaxy A5',
    detect: function(ua, display, glVersion) {
      return /sm-(a500|a510)/.test(ua);
    },
    width:1920,
    height:1080,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  galaxya7: { // 5.5"
    name: 'Galaxy A7',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-a700') >= 0;
    },
    width:1920,
    height:1080,
    widthMeters: 0.1216,
    heightMeters: 0.0684,
    bevelMeters: 0
  },
  galaxya9: { // 6"
    name: 'Galaxy A9',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-a900') >= 0;
    },
    width:1920,
    height:1080,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  htcone: { // HTC One, One Max
    name: 'HTC One',
    detect: function(ua, display, glVersion) {
      return /htc.*one/.test(ua);
    },
    width: 1920,
    height: 1080,
    widthMeters: 0.1307,
    heightMeters: 0.735,
    bevelMeters: 0
  },
  zenfone6: { // 6"
    name: 'ASUS ZenFone 6',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('asus_t00g') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1327,
    heightMeters: 0.746,
    bevelMeters: 0
  }
};

  // Windows Phone 8, 10 have WebGL.
  this.list.windowsphone = {

  lumina1520: { // 6" size
    name: 'Lumina 1520',
    detect: function(ua, display, glVersion) {
      return (ua.indexOf('lumina 1520') >= 0);
    },
    width: 1920,
    height: 1080,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  lumina950: { // 950, 950XL, Large Windows 10, 5.7"
    name: 'Lumina 950',
    detect: function(ua, display, glVersion) {
      return (ua.indexOf('lumina 950') >= 0);
    },
    width: 2560,
    height: 1440,
    widthMeters: 0.1262,
    heightMeters: 0.0756,
    bevelMeters: 0
  },
  lumina930: { // 4.7"
    name: 'Lumina 930',
    detect: function(ua, display, glVersion) {
      return (ua.indexOf('lumina 930') >= 0);
    },
    width: 1920,
    height: 1080,
    widthMeters: 0.1106,
    heightMeters: 0.0622,
    bevelMeters: 0
  },
  lumina550: { // 5"
    name: 'Lumina 550',
    detect: function(ua, display, glVersion) {
      return (ua.indexOf('lumina 550') >= 0);
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1032,
    heightMeters: 0.058,
    bevelMeters: 0
  }

}; // End of data objects.

this.list.blackberry = {
  //z3, z10 is too small
  blackberryleap: { // 5"
    name: 'Blackberry Leap',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('str100') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1105,
    heightMeters: 0.0622,
    bevelMeters: 0
  },

  blackberrypriv: { // 5.4" high-definition
    name: 'Blackberry Priv',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('stv100-3') >= 0;
    },
    width: 2560,
    height: 1440,
    widthMeters: 0.1204,
    heightMeters: 0.0677,
    bevelMeters: 0
  }
}; // End of data object.

this.list.tizen = {
  samsungz: { // 4.8"
    name: 'Samsung Z',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-910f') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1062,
    heightMeters: 0.0598,
    bevelMeters: 0
  },
  samsungz3: { // 5", Z1 and Z2 too small.
    name: 'Samsung Z3',
    detect: function(ua, display, glVersion) {
      return ua.indexOf('sm-z300') >= 0;
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1106,
    heightMeters: 0.0622,
    bevelMeters: 0
  }
}; // End of data object.

}; // End of DeviceList

module.exports = DeviceList;
