# WebVR Page
#### A DOM-Friendly Fork of WebVR-Boilerplate

Developed from WebVR Boilerplate, with additions allowing multiple VR scenes
to work well in a web page DOM, and a more sophisticated Ui player.

WebVR [Boilerplate] is a a [THREE.js](http://threejs.org) and [webvr-boilerplate](https://github.com/borismus/webvr-polyfill)- based starting point for VR experiences that work well in both Google Cardboard and other VR headsets. The goal of this project is to add a display mode for 3D scenes that allows them to be embedded in a standard web page. Current VR boilerplates grab the entire browser window. WebVR Page plays nice with other VR scenes embedded on the same page. This allows creating web pages with animated image galleries showing VR scenes for users to select. By contrast, most 3D browser frameworks use a static image on the web page, which links to a "fullwindow" version of the 3D scene. WebVR Page is therefore, an attempt to improve User Experience.

The project also defines a minimal semantically-coded HTML5 player for the VR scene, which will validate when embedded in a web page along with other DOM content and play nice with text readers and search engines. This differs from other current VR boilerplates, are non-validating and unfriendly to text readers in their fullscreen and VR modes.

Finally, the adaptation is not restricted to THREE.js, but potentially could be modified to work with other libraries, e.g. Babylon.js.

*Sample pages using the boilerplate:*

* [Plyojump](http://plyojump.com/projects/webvr-player)

-------------------------------------
### Building 3D applications:
This boilerplate simply "manages" the VR application. To actually build 3D applications accessible in Virtual Reality, you will have to learn to use THREE.js, a WebGL drawing and rendering library.

* [three](http://threejs.org/)

### Polyfills for desktops:
Desktops can't create a true VR experience (you'd have to put your screen into a VR headset). This boilerplate includes an install for webvr-polyfill, which addes VR functions to desktop browsers, and provides stereo views of your 3D scene on your desktop browser.

* [webvr-polyfill](https://github.com/borismus/webvr-polyfill)

### Other Polyfills:
These polyfills allow greater compatibility with older browsers, so the web page will render correctly even if VR mode or WebGL is not available.
* [Promise](https://github.com/taylorhakes/promise-polyfill/blob/master/Promise.js)

### Development libraries
This boilerplate uses command-line tools in a NodeJS environment. To work with it, you'll need to become comfortable with issuing some commands via the command-prompt (Windows) or Terminal (Mac).

The install script adds the libraries listed below to your system, but to actually make changes in the boilerplate itself you'll need to understand how command-line tools work.

*Development libraries installed by the boilerplate*
* [jshint](https://www.npmjs.com/package/jshint)
* [browserify](https://www.npmjs.com/package/browserify)
* [mocha](https://www.npmjs.com/package/mocha)
* [express](https://www.npmjs.com/package/express)
* [grunt](https://www.npmjs.com/package/grunt)
* [grunt-cli](https://www.npmjs.com/package/grunt-cli)
* [grunt-ftp-push]("latest")

*Some global libraries needed for development*
* [bower](https://www.npmjs.com/package/bower)
* [copyfiles](https://www.npmjs.com/package/copyfiles)
* [uglify](https://www.npmjs.com/package/uglify)

*Global libraries for better Windows support*
* [rimraf](https://www.npmjs.com/package/rimraf)
* [mkdirp](https://www.npmjs.com/package/mkdirp)

-------------------------------------
## Installation
To make the boilerplate ready for use, you need to install several libraries. The boilerplate relies heavily on Node-based tools (npm and bower) to do the installs.

### Installation on Mac/Unix:
1. Make sure you've installed Node (from http://nodejs.org)
2. Clone from GitHub, or get the ZIP file.
3. Open Terminal, and cd over to the directory you put the project in.
type the following command:
>`npm install`

4. After this completes, type the following command:
>`npm run buildall`

If this fails, run the scripts under "preinstall" in the package.json file manually.

Alternately, you can use the sudo command to go to Administrator (you'll need the password).

### Installation on Windows:
1. Make sure you've installed Node (from http://nodejs.org)
2. Clone from GitHub, or get the ZIP file.
3. Open the command prompt
4. Navigate to the directory you put the project in
5. Type the following command:
>`npm install`
6. After this runs, type the following command:
>`npm run buildall`

-------------------------------------
## Editing the Boilerplate:
Index.html contains sample code showing how the boilerplate works. You can edit this file, or replace it with another one for your own project.

If you need to change files in the boilerplate itself (other than images or media assets), you need to use the [browserify](https://www.npmjs.com/package/browserify) tool to rebuild the boilerplate files after editing.

The following npm command runs browserify after you've installed the boilerplate, and copies the compiled boilerplate JavaScript to the distribution directory:

>`npm run build`

### More Build commands in package.json file:
* `npm install` - installs modules via npm and bower, also pre-installs some modules that need to be global.
* `npm run build-three` - use bower to install [webvr-polyfill] and [three] libraries in js/lib directory.
* `npm run build-lib` - copy [THREE.js](http://threejs.org/), THREE helpers for VR, and [webvr-polyfill](https://github.com/borismus/webvr-polyfill) for non-VR browsers.
* `npm run build-app` - use the [browserify](http://browserify.org/) compiler to compile modules of the application, minify, and copy a concatenated file to js/ directory.
* `npm run build` - standard development build of manager and THREE libraries.
* `npm run buildall` - download newest three.js and webvr-polyfill, and build library and app.
* `npm run lint` - check files in /src directory for the correct code syntax. Learn how it works at the [jshint site](https://www.npmjs.com/package/jshint)
* `npm run test` - run mocha unit tests. Learn how at the [mocha site](https://mochajs.org/).
* `npm run start` - run a Node server locally at port 3000.
* `npm run clean` - remove the js/directory.

Check this article for more build methods for npm that
[work on windows](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)

-------------------------------------
## Running the boilerplate:
You can test the boilerplate simply by double-clicking on index.html, after installation. It is a good idea to have your console tools open to look for problems.

The file 'server.js' creates a simple Node-based web server. To run it, just open a new command-prompt or Terminal window, navigate to the default directory for the install, and type:
>`node server.js`

Access the server at http://localhost:3000

This boilerplate a couple of default scenes in a simple player application in index.html, demonstrating that
you can add VR scenes as elements in a larger web page.
* Click on the 'fullscreen' icon to go fullscreen
* Click on the 'vr' icon to go into VR (which is stereo view on a desktop)
* Press the escape key on your keyboard to exit fullscreen or VR mode
* On a mobile, rotate the mobile to landscape to get a VR view suitable for Google Cardboard or Samsung Gear

### Stereo view on a desktop computer
If you don't have an HMD, you can still experiment with the VR system (though you won't
see the true VR, obviously). This only works if you enable the webvr-polyfill library,
which provides VR functions to web browsers which lack it or have it turned off by
default

Best desktop browsers:
* Microsoft Edge (no, this won't work with old versions of Internet Explorer).
* Google Chrome
* Firefox (get the Nightly version for best performance)

1. Edit index.html to un-comment the following line in the [webvr-polyfill](https://github.com/borismus/webvr-polyfill) configuration.
>`WebVRPageConfig = {
  ...
  FORCE_ENABLE_VR: true, // Default: false.
  ...
  };`

2. Reload the page
3. Click on one of the default scenes in index.html
4. You will see the stereo images
5. If you can cross your eyes, you can see in 3D(!)

### Running VR with an Oculus or other Head-Mounted Device (HMD):
If you have an HMD, it should be detected (that is what WebVR do!).

## Running the boilerplate VR on a mobile device:
The newest browsers on iOS (iPhone/iPad) and Android systems support VR by default.

*Best Mobile Browsers:*
* Firefox for Mobile
* Google Chrome
* Mobile Safari (installed on iOS by default)

Older versions of Android may have problems, especially if you try to use the
default Android browser. In this case, your best bet is to download Google Chrome
for your device.

Older Featurephones are NOT going to work.

-------------------------------------
## Seeing in VR:

To see the VR, you need to grab a VR viewer with the correct lenses.
* Google Cardboard https://www.google.com/get/cardboard/get-cardboard/
* Samsung Gear VR (only if you have a compatible Samsung smartphone) sold online
and in brick and mortar stores.

Running the Boilerplate on Mobile:
1. Click on one of the default scenes in index.html
2. You will see the stereo images in a distorted form, with an arrow indicating that you
need to view in landscape mode
3. If you turn the device to 'landscape' mode (on its side) you should be a VR view.
