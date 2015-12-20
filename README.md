# WebVR Page - A DOM-Friendly Fork of WebVR-Boilerplate

Developed from WebVR Boilerplate, with additions allowing multiple VR scenes
to work well in a web page DOM, and a more sophisticated Ui player.

WebVR [Boilerplate] is a a [THREE.js][three]-based starting point for VR experiences
that work well in both Google Cardboard and other VR headsets. The goal of this
project is to move the generic display (which fills an entire browser window) so
it plays nice with other VR scenes on the same page.

[three]: http://threejs.org/
[webvr-polyfill]: https://github.com/borismus/webvr-polyfill

The project also defines a semantic HTML coded player for the VR scene, with
better opportunities for extension.

Finally, the adaptation is not restricted to THREE.js, but should work with other
libraries, e.g. Babylon.js.

[![Sample Page](http://plyojump.com/projects/webvr-player)

## Projects that use the boilerplate

## Getting started

Adapted to use npm and bower.

Libraries used by the application.
[three]: https://libraries.io/bower/threejs

Dev global libraries.
[jshint]: https://www.npmjs.com/package/jshint
[browserify]: https://www.npmjs.com/package/browserify
[mocha]: https://www.npmjs.com/package/mocha
[express]: https://www.npmjs.com/package/express
[grunt]: https://www.npmjs.com/package/grunt
[grunt-cli]: https://www.npmjs.com/package/grunt-cli
[grunt-ftp-push]: "latest",

Some global libraries added for better Windows support.
[bower]: https://www.npmjs.com/package/bower
[copyfiles]: https://www.npmjs.com/package/copyfiles
[rimraf]: https://www.npmjs.com/package/rimraf
[mkdirp]: https://www.npmjs.com/package/mkdirp
[uglify]: https://www.npmjs.com/package/uglify

Build commands in package.json file:
npm install - installs modules via npm and bower, also pre-installs some modules that need to be global.
npm run build-three - use bower to install [webvr-polyfill] and [three] libraries in js/lib directory.
npm run build-lib - copy THREE.js, THREE helpers for VR, and [webvr-polyfill[] for non-VR browsers.
npm run build-app - use browserify to compile modules of the application, minify, and copy to js/ directory.
npm run build - standard development build of manager and THREE libraries.
npm run buildall - download newest three.js and webvr-polyfill, and build library and app.
npm run lint - check files in /src directory for rules.
npm run test - run moca unit tests
npm run start - run a Node server locally at port 3000.
npm run clean - remove the js/directory.

Push the final site (without dev directories) to a remote server:
[grunt-ftp-push]: https://www.npmjs.com/package/grunt-ftp-push
grunt

Check this list for more build methods for npm that
[work on windows]: http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

The easiest way to start is to fork this repository or copy its contents into a
new directory.

Alternatively, you can start from scratch. The key parts that the boilerplate
provides are:
