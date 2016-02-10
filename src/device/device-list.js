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

  //Device group names.
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

  this.ERROR = -1;

  // Use the dpdb datase.
  this.ONLINE_DPDB_URL = 'https://storage.googleapis.com/cardboard-dpdb/dpdb.json';

  // TODO: Future versions could get this info from a dynamic database.
  // Choose a DeviceList to load.
  this.getList = function(whichList) {
    if(!whichList) {
      whichList = this.DEVICE_ALL;
    }
    switch(whichList) {
      case this.DEVICE_ALL:
        return this.merge(this.list.iphone, this.list.ipad, this.list.ipod,
        this.list.android, this.list.windowsphone, this.list.blackberry, this.list.tizen,
        this.list.gameconsole, this.list.tv);
        break;
      case this.DEVICE_IPHONE:
        return this.list.iphone;
        break;
      case this.DEVICE_IPAD:
        return this.list.ipad;
        break;
      case this.DEVICE_IPOD:
        return this.list.ipod;
        break;
      case this.DEVICE_ANDROID:
        return this.list.android;
        break;
      case this.DEVICE_WINDOWS_PHONE:
        return this.list.windowsphone;
        break;
      case this.DEVICE_BLACKBERRY:
        return this.list.blackberry;
        break;
      case this.DEVICE_TIZEN:
        return this.list.tizen;
        break;
      case this.DEVICE_GAME_CONSOLE:
        return this.list.gameConsole;
        break;
      case this.DEVICE_TV:
        return this.list.tv;
      default:
        return {};
        break;
      }
  };

  // Get meters from screen size and PPI/DPI.
  this.metersFromPixels_ = function(px, ppi) {
    if(px && ppi && ppi > 0) {
        return (px / ppi) * 0.0254;
    }
    return this.ERROR;
  };

  // Given width and height of display, return diagonal length.
  this.getDiagonal_ = function(w, h) {
    return (Math.sqrt(w*w + h*h));
  };

  // Create a default device for desktops (in fullscreen mode).
  // Default PPI value http://dpi.lv/
  // https://github.com/LeaVerou/dpi
  this.getDefault = function(display) {
    var ppi = 96 * display.pixelRatio; // 96 is standard browser value on desktop..
    var w = display.screenWidth;
    var h = display.screenHeight;
    return {
      label: 'Default Device (by feature detect)',
      detect: function(ua, display, tests) {
          return false;
      },
      width: w,
      height: h,
      diag: this.getDiagonal_(w, h) / ppi,
      ppi: ppi,
      pxlr: display.pixelRatio,
      widthMeters: this.metersFromPixels_(w, ppi),
      heightMeters: this.metersFromPixels_(h, ppi),
      bevelMeters: 0.004
    };
  };

   /*
    * Merge several JS objects into a single object.
    * Used to create DISPLAY_ALL from individual databases.
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

  // Search local databases in our native format.
  this.searchLocalDB = function(key, ua, display, tests) {
    var devices = this.getList(key);
    for (var i in devices) {
      if (devices[i].detect(ua, display, tests)) {
        //console.log('i:' + i)
        console.log('device found:' + devices[i].label + '.');
        return devices[i];
      }
    }
    return; // Device is undefined.
  };

  // Search a DPDB-format array for our device, based on user-agent.
  this.searchDPDB = function(ua, display, devices) {
    var len = devices.length;
    for (var i = 0; i < len; i++) {
      var rules = devices[i].rules.ua;
      if (ua.indexOf(rules) >= 0) {
        console.log('FOUND THE DEVICE IN DPDB');
        window.dev = devices[i];
        return devices[i];
      }
    }
    return null;
  };

  // Convert DPDB device data to our format.
  this.convertDPDB = function(dpdbDevice, device) {
    if (!dpdbDevice || !device) {
      return null;
    }
    if (dpdbDevice.rules && dpdbDevice.rules['ua']) {
      console.log('DPDB changed device label'); ///////////////////////////////////
      device.label = dpdbDevice.rules['ua'];
    }
    if(dpdbDevice.ppi) {
      console.log('DPDB changed device ppi'); /////////////////////////////////
      device.ppi = dpdbDevice.dpi;
    }
    device.diag = this.getDiagonal_(device.width, device.height) / device.ppi;
    if(dpdbDevice.bw) {
      console.log('DPDB changed bevelMeters');
      device.bevelMeters = this.metersFromPixels_(dpdbDevice.bw, device.ppi);
    }
    // Return the modified device params.
    return device;
  };

  /*
   * Data lists.
   * http://www.tera-wurfl.com/explore/search.php?search
   * http:/www.gsmarena.com
   * http://www.webapps-online.com/online-tools/user-agent-strings
   * http://support.blackberry.com/kb/articleDetail?articleNumber=000033531
   * http://www.zytrax.com/tech/web/browser_ids.htm
   * http://developer.samsung.com/technical-doc/view.do?v=T000000203
   * http://detectmobilebrowsers.com/
   * https://github.com/hgoebl/mobile-detect.js/blob/master/mobile-detect.js
   * https://github.com/serbanghita/Mobile-Detect/blob/master/Mobile_Detect.php
   * https://mobiforge.com/research-analysis/webviews-and-user-agent-strings
   * http://stackoverflow.com/questions/14403766/how-to-detect-the-stock-android-browser
   * https://github.com/serbanghita/Mobile-Detect/blob/master/Mobile_Detect.php#L274
   * http://cpansearch.perl.org/src/MAMOD/HTTP-UA-Parser-0.005/lib/HTTP/UA/Parser/regexes.yaml
   * https://udger.com/resources/ua-list/device-detail?device=Smart%20TV
   * http://www.everymac.com/systems/apple/ipad/index-ipad-specs.html
   * http://www.canbike.org/CSSpixels/
   * http://www.devicespecifications.com/ (GREAT data, including video chips)
   * http://www.mobilemultimedia.be/en/mobile-phone-user-agent/LG-user-agent.html
   * https://github.com/piwik/device-detector/blob/df9e81508f65f33436bab0daaaf942e1d59c89a1/regexes/device/mobiles.yml
   */
  this.list = {};

  this.list.iphone = {
  iphone3: { // iPhone 1, 2, iPhone 3GS, non-Retina.
    label: 'iPhone 1, 2, 3',
    detect: function(ua, display, tests) {
        return (display.longest <= 480 && !display.retina && (tests.glVersion.indexOf('535') >= 0));
    },
    width: 360,
    height: 480,
    diag: 3.5,
    ppi: 163,
    pxlr: 1,
    widthMeters: 0.0492,
    heightMeters: 0.628,
    bevelMeters: 0
  },
  iphone4: { //4 and 4s
    label: 'iPhone 4, 4s',
    detect: function(ua, display, tests) {
      return (display.longest <= 480 && display.retina && (tests.glVersion.indexOf('535') >=0));
    },
    width: 640,
    height: 960,
    diag: 3.5,
    ppi: 326,
    pxlr: 1,
    widthMeters: 0.075,
    heightMeters: 0.0495,
    bevelMeters: 0.004
  },
  iphone5: { // iPhone 5 5c
    label: 'iPhone 5, 5c',
    detect: function(ua, display, tests) {
      return (display.longest <= 568 && (tests.glVersion.indexOf('543') >= 0));
    },
    width: 640,
    height: 1136,
    diag: 4,
    ppi: 326,
    pxlr: 2,
    widthMeters: 0.09011,
    heightMeters: 0.05127,
    bevelMeters: 0.00343
  },
  iphone5s: { // iPhone 5s
    label: 'iPhone 5s',
    detect: function(ua, display, tests) {
      return (display.longest <= 568 && (tests.glVersion.indexOf('a7') >= 0));
    },
    width: 640,
    height: 1136,
    diag: 4,
    ppi: 326,
    pxlr: 2,
    widthMeters: 0.09011,
    heightMeters: 0.05127,
    bevelMeters: 0.00343
  },
  iphone6: { // TODO: 1.16 http://info.localytics.com/blog/research-shows-the-iphone-6-is-the-most-adopted-iphone-model-with-the-highest-user-engagement
    label: 'iPhone 6',
    detect: function(ua, display, tests) {
      return (display.longest <= 736 && (tests.glVersion.indexOf('a8') >= 0));
    },
    width: 750,
    height: 1334,
    diag: 4.7,
    ppi: 326,
    pxlr: 2,
    widthMeters: 0.1038,
    heightMeters: 0.0584,
    bevelMeters: 0.004
  },
  iphone6s: {
    label: 'iPhone 6s',
    detect: function(ua, display, tests) {
      return (display.longest <= 736 && display.pixelRatio <= 2 && (tests.glVersion.indexOf('a9') >= 0));
    },
    width: 750,
    height: 1334,
    diag: 4.7,
    ppi: 326,
    pxlr: 2,
    widthMeters: 0.1038,
    heightMeters: 0.0584,
    bevelMeters: 0.004
  },
  iphone6splus: {
    label: 'iPhone 6s Plus',
    detect: function(ua, display, tests) {
      return (display.longest <= 750 && display.pixelRatio > 2 && (tests.glVersion.indexOf('a9') >= 0));
    },
    width: 1920,
    height: 1080,
    diag: 5.5,
    ppi: 401,
    pxlr: 2.46,
    widthMeters: 0.12235,
    heightMeters: 0.06954,
    bevelMeters: 0.00471
  }
};

  // iPads.
  this.list.ipad = {
    ipad1: {
      label: 'ipad1',
      detect: function(ua, display, tests) {
        return (display.retina && !tests.devicemotion);
      },
      width: 1024,
      height: 768,
      diag: 9.7,
      ppi: 132,
      pxlr: 1,
      widthMeters: 0.1924,
      heightMeters: 0.1477,
      bevelMeters: 0
    },
    ipad2: { // has accelerometer.
      label: 'iPad 2',
      detect: function(ua, display, tests) {
        return(!display.retina && display.longest <= 1024 && /543/.test(tests.glVersion));
      },
      width: 1024,
      height: 768,
      diag: 9.7,
      ppi: 132,
      pxlr: 1,
      widthMeters: 0.1924,
      heightMeters: 0.1477,
      bevelMeters: 0
    },
    ipad3: {
      label: 'iPad 3',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2048 && /543/.test(tests.glVersion));
      },
      width: 2048,
      height: 1536,
      diag: 9.7,
      ppi: 264,
      pxlr: 2,
      widthMeters: 0.1970,
      heightMeters: 0.1478,
      bevelMeters: 0
    },
    ipad4: {
      label: 'iPad 4',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2048 && /554/.test(tests.glVersion));
      },
      width: 2048,
      height: 1536,
      diag: 9.7,
      ppi: 264,
      pxlr: 2,
      widthMeters: 0.1970,
      heightMeters: 0.1478,
      bevelMeters: 0
    },
    ipadair: { // TODO: can't differentiate this from iPad Mini 2, 3
      label: 'iPad Air',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2048 && /A7/.test(tests.glVersion)); // iPad Mini 2, 3, iPad Air
      },
      width: 2048,
      height: 1536,
      diag: 9.7,
      ppi: 264,
      pxlr: 2,
      widthMeters: 0.1970,
      heightMeters: 0.1478,
      bevelMeters: 0
    },
    ipadair2: { // 264ppi , chip 2x faster.
      label: 'iPad Air 2',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2048 && /A8X/.test(tests.glVersion));
      },
      width: 2048,
      height: 1536,
      diag: 9.7,
      ppi: 264,
      pxlr: 2,
      widthMeters: 0.1970,
      heightMeters: 0.1478,
      bevelMeters: 0
    },
    ipadpro: { // A9 chip = 5x faster, 264ppi, larger screen.
      label: 'iPad Pro',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2732 && /A9/.test(tests.glVersion)); // iPhone 6, iPad Pro
      },
      width: 2732,
      height: 2048,
      diag: 12.9,
      ppi: 264,
      pxlr: 2,
      widthMeters: 0.2628,
      heightMeters: 0.1970,
      bevelMeters: 0
    },
    ipadmini: { // iPad Mini 1.
      label: 'iPad Mini',
      detect: function(ua, display, tests) {
        return (!display.retina && /A7/.test(tests.glVersion)); // iPad Mini 2, 3, iPad Air.
      },
      width: 1024,
      height: 768,
      diag: 7.9,
      ppi: 163,
      pxlr: 1,
      widthMeters: 0.1595,
      heightMeters: 0.1197,
      bevelMeters: 0
    },
    ipadmini3: { // TODO: does not differentiate iPad mini 2,3, iPad Air.
      label: 'iPad Mini Retina 2 and 3',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 2048 && /A7/.test(tests.glVersion)); // iPad Mini 2, 3, iPad Air.
      },
      width: 2048,
      height: 1536,
      diag: 7.9,
      ppi: 326,
      pxlr: 2,
      widthMeters: 0.1596,
      heightMeters: 0.12,
      bevelMeters: 0
    },
    ipadmini4: { // Graphics 1.6x faster
      label: 'iPad Mini 4',
      detect: function(ua, display, tests) {
        return (display.retina && /A8/.test(tests.glVersion)); // iPad Mini 4
      },
      width: 2048,
      height: 1536,
      diag: 7.9,
      ppi: 326,
      pxlr: 2,
      widthMeters: 0.1596,
      heightMeters: 0.12,
      bevelMeters: 0
    }
  };

  // Recent iPods.
  this.list.ipod = {
    ipodtouch3: {
      label: 'iPod Touch 3',
      detect: function(ua, display, tests) {
        return (!display.retina && display.longest <= 480);
      },
      width: 480,
      height: 320,
      diag: 3,
      ppi: 163,
      pxlr: 1,
      widthMeters: 0.0748,
      heightMeters: 0.0498,
      bevelMeters: 0
    },
    ipodtouch4: {
      label: 'iPod Touch 4',
      detect: function(ua, display, tests) {
        return (display.retina && display.longest <= 480);
      },
      width: 960,
      height: 640,
      diag: 3.5,
      ppi: 326,
      pxlr: 2,
      widthMeters: 0.0748,
      heightMeters: 0.0498,
      bevelMeters: 0
    },
    ipodtouch5: {
      label: 'iPod Touch 5',
      detect: function(ua, display, tests) {
        return(display.retina && display.longest > 480 && !/A8/.test(tests.glVersion));
      },
      width: 1136,
      height: 640,
      diag: 4,
      ppi: 326,
      pxlr: 2,
      widthMeters: 0.0885,
      heightMeters: 0.0498,
      bevelMeters: 0
    },
    ipodtouch6: {
      label: 'iPod Touch 6',
      detect: function(ua, display, tests) {
        return(display.retina && display.longest > 480 && /A8/.test(tests.glVersion));
      },
      width: 1136,
      height: 640,
      diag: 4,
      ppi: 326,
      pxlr: 2,
      widthMeters: 0.0885,
      heightMeters: 0.0498,
      bevelMeters: 0
    }
  };

  /*
   * Android devices are accessed as a group.
   */
  this.list.android = {
  note4: {
    label: 'Note 4',
    detect: function(ua, display, tests) {
        return (ua.indexOf('sm-n910c') >= 0);
    },
    width: 2560,
    height: 1440,
    diag: 5.7,
    ppi: 515,
    pxlr: 4,
    widthMeters: 0.125,
    heightMeters: 0.70,
    bevelMeters: 0
  },
  note5: {
    label: 'Note 5',
    detect: function(ua, display, tests) {
        return (ua.indexOf('sm-a920') >= 0);
    },
    width: 2560,
    height: 1440,
    diag: 5.7,
    ppi: 515,
    widthMeters: 0.125,
    heightMeters: 0.70,
    bevelMeters: 0
  },
  nexus5: {
    label: 'Nexus 5',
    detect: function(ua, display, tests) {
      return (ua.indexOf('nexus 5 ') >= 0);
    },
    width:1920,
    height:1080,
    diag: 5,
    ppi: 441,
    widthMeters: 0.110,
    heightMeters: 0.062,
    bevelMeters: 0.004
  },
  nexus6: {
    label: 'Nexus 6',
    detect: function(ua, display, tests) {
      return (ua.indexOf('nexus 6') >= 0);
    },
    width:2560,
    height:1440,
    diag: 5.93,
    ppi: 493,
    width:2560,
    height:1440,
    widthMeters: 0.1320,
    heightMeters: 0.074,
    bevelMeters: 0.004
  },
  nexus6p: {
    label: 'Nexus 6p',
    detect: function(ua, display, tests) {
      return (ua.indexOf('nexus 6p') >= 0);
    },
    width:2560,
    height:1440,
    diag: 5.7,
    ppi: 515,
    widthMeters: 0.126,
    heightMeters: 0.0705,
    bevelMeters: 0.004
  },
  galaxygrand: { // Old phone, less likely
    label: 'Galaxy Grand',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-g7102') >= 0);
    },
    width:800,
    height:480,
    diag: 5,
    ppi: 187,
    widthMeters: 0.109,
    heightMeters: 0.065,
    bevelMeters: 0.004
  },
  galaxygrandprime: {
    label: 'Galaxy Grand Prime',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-g530h') >= 0);
    },
    width:960,
    height:540,
    diag: 5,
    ppi: 220,
    widthMeters: 0.1108,
    heightMeters: 0.0623,
    bevelMeters: 0
  },
  galaxys3: {
    label: 'Galaxy S3',
    detect: function(ua, display, tests) {
      return (ua.indexOf('gt-i9300') >= 0);
    },
    width: 0,
    height: 0,
    diag: 4.8,
    ppi: 306,
    pxlr: 2,
    widthMeters: 0.106,
    heightMeters: 0.060,
    bevelMeters: 0.005
  },
  galaxys4: {
    label: 'Galaxy S4',
    detect: function(ua, display, tests) {
      return (ua.indexOf('gt-i9505') >= 0);
    },
    width: 1920,
    height: 1080,
    diag:5,
    ppi: 441,
    pxlr: 3,
    widthMeters: 0.111,
    heightMeters: 0.0625,
    bevelMeters: 0.004
  },
  galaxys5: {
    label: 'Galaxy S5',
    detect: function(ua, display, tests) {
      return /(sm-g900|scl23|sc04f)/.test(ua);
    },
    width: 0,
    height: 0,
    diag: 5.1,
    ppi: 432,
    pxlr: 3,
    widthMeters: 0.113,
    heightMeters: 0.066,
    bevelMeters: 0.005
  },
  galaxys5mini: {
    label: 'Galaxy S5 Mini',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-g800f') >= 0);
    },
    width: 1280,
    height: 720,
    diag: 4.5,
    ppi: 326,
    pxlr: 2,
    widthMeters: 0.0997,
    heightMeters: 0.561,
    bevelMeters: 0
  },
  galaxys6: { // S6, S6 edge
    label: 'Galaxy S6',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-g920') >= 0);
      return /(sm-g950|sm-g925)/.test(ua);
    },
    width: 2560,
    height: 1440,
    diag: 5.1,
    ppi: 576,
    pxlr: 4,
    widthMeters: 0.114,
    heightMeters: 0.0635,
    bevelMeters: 0.0035
  },
  galaxys6edge: {
    label: 'Galaxy S6 Edge+',
    detect: function(ua, display, tests) {
      return /sm-g928t/.test(ua);
    },
    width: 2560,
    height: 1440,
    diag: 5.1,
    ppi: 577,
    pxlr: 3.5,
    widthMeters: 0.1126,
    heightMeters: 0.0634,
    bevelMeters: 0
  },
  galaxya3: { // 4.7"
    label: 'Galaxy A3',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-a300') >= 0);
    },
    width: 1280,
    height: 720,
    diag: 4.7,
    ppi: 312,
    pxlr: 3.5,
    widthMeters: 0.1042,
    heightMeters: 0.0586,
    bevelMeters: 0
  },
  galaxya5: { // 2016 model
    label: 'Galaxy A5',
    detect: function(ua, display, tests) {
      return /sm-(a500|a510)/.test(ua);
    },
    width:1920,
    height:1080,
    diag: 5.2,
    ppi: 424,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  galaxya7: {
    label: 'Galaxy A7',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-a700') >= 0);
    },
    width:1920,
    height:1080,
    diag: 5.5,
    ppi: 401,
    widthMeters: 0.1216,
    heightMeters: 0.0684,
    bevelMeters: 0
  },
  galaxya9: {
    label: 'Galaxy A9',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-a900') >= 0);
    },
    width:1920,
    height:1080,
    diag: 6,
    ppi: 367,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  htcone: {
    label: 'HTC One',
    detect: function(ua, display, tests) {
      return ((!ua.indexOf('max') >= 0) && /htc.*one/.test(ua));
    },
    width: 1920,
    height: 1080,
    diag: 5,
    ppi: 441,
    pxlr: 3,
    widthMeters: 0.1102,
    heightMeters: 0.0622,
    bevelMeters: 0
  },
  htconemax: {
    label: 'HTC One Max',
    detect: function(ua, display, tests) {
      return /htc.*one.*max/.test(ua);
    },
    width: 1920,
    height: 1080,
    diag: 5.9,
    ppi: 373,
    widthMeters: 0.1307,
    heightMeters: 0.735,
    bevelMeters: 0
  },
  lgg2: {
		label: 'LG G2',
    detect: function(ua, display, tests) {
      return (ua.indexOf('lg-d802 ') >= 0);
    },
		width: 1920,
		height: 1080,
		diag: 5.2,
		ppi: 424,
    widthMeters: 0.1150,
    heightMeters: 0.0639,
    bevelMeters: 0
	},
	lgg3: {
		label: 'LG G3',
    detect: function(ua, display, tests) {
      return /lg-d(850|851)/.test(ua);
    },
		width: 2560,
		height: 1440,
		diag: 5.5,
		ppi: 538,
    widthMeters: 0.1209,
    heightMeters: 0.0680,
    bevelMeters: 0
	},
	lgg4: {
		label: 'LG G4',
    detect: function(ua, display, tests) {
      return (indexOf('lg-h815') >= 0);
    },
		width: 2560,
		height: 1440,
		diag: 5.5,
		ppi: 538,
    widthMeters: 0.1209,
    heightMeters: 0.0680,
    bevelMeters: 0
	},
  oneplusone: {
    label: 'OnePlus One',
    detect: function(ua, display, tests) {
      return (indexOf('mi-oneplus') >= 0);
    },
    width: 1920,
		height: 1080,
		diag: 5.2,
		ppi: 424,
    widthMeters: 0.1150,
    heightMeters: 0.0680,
    bevelMeters: 0
  },
  zenfone6: { // 6"
    label: 'ASUS ZenFone 6',
    detect: function(ua, display, tests) {
      return /'(?:asus_)?(?:t00g|z002)/.test(ua);
    },
    width: 1280,
    height: 720,
    diag: 6,
    ppi: 245,
    widthMeters: 0.1327,
    heightMeters: 0.746,
    bevelMeters: 0
  },
  kindlehdx7: { // 7"
    label: 'Kindle Fire HDX 7"',
    detect: function(ua, display, tests) {
      return (ua.indexOf('kfthwi') >= 0);
    },
    width: 1920,
    height: 1200,
    diag: 7,
    ppi: 339,
    pxlr: 2,
    widthMeters: 0.1438,
    heightMeters: 0.0899,
    bevelMeters: 0
  },
  kindlehdx89: {
    label: 'Kindle Fire HDX 8.9"',
    detect: function(ua, display, tests) {
      return (ua.indexOf('kfapwi') >= 0);
    },
    width: 2560,
    height: 1600,
    diag: 8.9,
    ppi: 339,
    pxlr: 2,
    widthMeters: 0.1918,
    heightMeters: 0.1199,
    bevelMeters: 0
  }
};

  // Windows Phone 8, 10 have WebGL.
  this.list.windowsphone = {

  lumina1520: { // 6" size
    label: 'Lumina 1520',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 1520') >= 0));
    },
    width: 1920,
    height: 1080,
    diag: 6,
    ppi: 367,
    widthMeters: 0.1329,
    heightMeters: 0.0747,
    bevelMeters: 0
  },
  lumina950: { // 950, 950XL, Large Windows 10, 5.7"
    label: 'Lumina 950',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 950') >= 0));
    },
    width: 2560,
    height: 1440,
    diag: 5.2,
    ppi: 565,
    widthMeters: 0.1150,
    heightMeters: 0.0647,
    bevelMeters: 0
  },
  lumina930: { // 4.7"
    label: 'Lumina 930',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 930') >= 0));
    },
    width: 1920,
    height: 1080,
    diag: 4.7,
    ppi: 441,
    pxlr: 2.6,
    widthMeters: 0.1106,
    heightMeters: 0.0622,
    bevelMeters: 0
  },
  lumina550: { // 5"
    label: 'Lumina 550',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 550') >= 0));
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1032,
    heightMeters: 0.058,
    bevelMeters: 0
  },
  lumina530: { // 4" and 245ppi.
    label: 'Lumina 530',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 530') >= 0));
    },
    width: 854,
    height: 480,
    diag: 4,
    ppi: 245,
    widthMeters: 0.0885,
    heightMeters: 0.0498,
    bevelMeters: 0
  },
  lumina520: { // 4" 233ppi, but put here so MS Edge windowsphone emulation is detected.
    label: 'Lumina 520',
    detect: function(ua, display, tests) {
      return ((ua.indexOf('lumina 520') >= 0));
    },
    width: 800,
    height: 480,
    diag: 4,
    ppi: 233,
    pxlr: 1.4,
    widthMeters: 0.0872,
    heightMeters: 0.0523,
    bevelMeters: 0
  }

}; // End of data objects.

this.list.blackberry = {
  //z3, z10 is too small
  blackberryleap: { // 5"
    label: 'Blackberry Leap',
    detect: function(ua, display, tests) {
      return (ua.indexOf('str100') >= 0);
    },
    width: 1280,
    height: 720,
    diag: 5,
    ppi: 294,
    pxlr: 2,
    widthMeters: 0.1105,
    heightMeters: 0.0622,
    bevelMeters: 0
  },

  blackberrypriv: { // 5.4" high-definition
    label: 'Blackberry Priv',
    detect: function(ua, display, tests) {
      return (ua.indexOf('stv100-3') >= 0);
    },
    width: 2560,
    height: 1440,
    diag: 5.4,
    ppi: 544,
    widthMeters: 0.1204,
    heightMeters: 0.0677,
    bevelMeters: 0
  }
}; // End of data object.

this.list.tizen = {
  samsungz: { // 4.8"
    label: 'Samsung Z',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-910f') >= 0);
    },
    width: 1280,
    height: 720,
    diag: 4.8,
    ppi: 306,
    widthMeters: 0.1062,
    heightMeters: 0.0598,
    bevelMeters: 0
  },
  samsungz3: { // 5", Z1 and Z2 too small.
    label: 'Samsung Z3',
    detect: function(ua, display, tests) {
      return (ua.indexOf('sm-z300') >= 0);
    },
    width: 1280,
    height: 720,
    widthMeters: 0.1106,
    heightMeters: 0.0622,
    bevelMeters: 0
  }
}; // End of data object.

this.list.gameConsole = {

}; // End of data object.

this.list.tv = {
// Unlikely.
}; // End of data object.

}; // End of DeviceList

module.exports = DeviceList;
