/*
 * Various polyfills enabling webvr-level operation.
 *
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

(function(global) {

  if (!('window' in global && 'document' in global))
    return;

  // Not used but could be valuable:
  // https://github.com/Financial-Times/polyfill-service/tree/0585a1713c9102c7b3b75bfcf015a60f1d934557

  // ES5 polyfills.
  // https://github.com/inexorabletash/polyfill/tree/5c070ddef1b7ecf741567a37ffd3ac5658dd9683

  // ES 15.2.3.6 Object.defineProperty (O, P, Attributes).
  // Partial support for most common case - getters, setters, and values.
  if (!Object.defineProperty ||
      !(function () { try { Object.defineProperty({}, 'x', {}); return true; } catch (e) { return false; } } ())) {
    var orig = Object.defineProperty;
    Object.defineProperty = function (o, prop, desc) {
      // In IE8 try built-in implementation for defining properties on DOM prototypes.
      if (orig) { try { return orig(o, prop, desc); } catch (e) {} }

      if (o !== Object(o)) { throw TypeError("Object.defineProperty called on non-object"); }
      if (Object.prototype.__defineGetter__ && ('get' in desc)) {
        Object.prototype.__defineGetter__.call(o, prop, desc.get);
      }
      if (Object.prototype.__defineSetter__ && ('set' in desc)) {
        Object.prototype.__defineSetter__.call(o, prop, desc.set);
      }
      if ('value' in desc) {
        o[prop] = desc.value;
      }
      return o;
    };
  }

  // ES 15.2.3.7 Object.defineProperties ( O, Properties )
  if (typeof Object.defineProperties !== "function") {
    Object.defineProperties = function (o, properties) {
      if (o !== Object(o)) { throw TypeError("Object.defineProperties called on non-object"); }
      var name;
      for (name in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, name)) {
          Object.defineProperty(o, name, properties[name]);
        }
      }
      return o;
    };
  }

  // Polyfill Array.filter (MDN)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun/*, thisArg*/) {
      'use strict';

      if (this === void 0 || this === null) {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function') {
        throw new TypeError();
      }

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];

          // NOTE: Technically this should Object.defineProperty at
          //       the next index, as push can be affected by
          //       properties on Object.prototype and Array.prototype.
          //       But that method's new, and collisions should be
          //       rare, so use the more-compatible alternative.
          if (fun.call(thisArg, val, i, t)) {
            res.push(val);
          }
        }
      }
    return res;
    };
  }


    /**
     * https://github.com/moagrius/classList
     *
     * uses work by
     * https://github.com/remy/polyfills/blob/master/classList.js
     * https://github.com/eligrey/classList.js/blob/master/classList.js
     */

    // if we don't even support Element.prototype, quit now
    if(!('Element' in this || !Element.prototype)){
      return;
    }
    var tester = document.createElement('span');

    if(!('classList' in tester)){ // no support at all, polyfill entire API

      // IE8 doesn't have Array.indexOf
      var indexOf = function(list, element){
        for(var i = list.length - 1; i >= 0; i--){
          if(list[i] == element){
            break;
          }
        }
        return i;
      };

      // scope it so it's not hoisted, otherwise IE10 will fail to patch
      (function(){

        var DOMTokenList = function(element){
          this.element = element;
        };
        DOMTokenList.prototype.contains = function(name){
          var classes = this.element.className.split(/\s+/);
          return indexOf(classes, name) != -1;
        };
        DOMTokenList.prototype.add = function(){
          var classes = this.element.className.split(/\s+/);
          for(var i = arguments.length - 1; i >= 0; i--) {
            var name = arguments[i];
            if(indexOf(classes, name) == -1){
              classes.push(name);
            }
          }
          this.element.className = classes.join(' ');
        };
        DOMTokenList.prototype.remove = function(name){
          var classes = this.element.className.split(/\s+/);
          for(var i = arguments.length - 1; i >= 0; i--) {
            var index = indexOf(classes, name);
            if(index != -1){
              classes.splice(index, 1);
            }
          }
          this.element.className = classes.join(' ');
        };
        DOMTokenList.prototype.item = function(index){
          var classes = this.element.className.split(/\s+/);
          return classes[index];
        };
        DOMTokenList.prototype.toggle = function(name, force){
          var exists = this.contains(name);
          if(exists === force){
            return force;
          }
          if(exists){
            this.remove(name);
          } else {
            this.add(name);
          }
          return !exists;
        };
        // replaced with getter, not supported in IE8, will always return 0
        DOMTokenList.prototype.length = 0;

        if(Object.defineProperty) {
          Object.defineProperty(Element.prototype, 'classList',{
            get : function(){
              return new DOMTokenList(this);
            }
          });
          Object.defineProperty(DOMTokenList.prototype, 'length', function(){
            var classes = this.element.className.split(/\s+/);
            return classes.length;
          });
        } else if(Element.prototype.__defineGetter__){
          Element.prototype.__defineGetter__('classList', function(){
            return new DOMTokenList(this);
          });
        }

      })();

    } else {  // we have support, just patch methods as needed

      if('DOMTokenList' in this){  // this should be true if classList is detected

        // test and patch multiple argument support
        tester.classList.add('a', 'b');
        if(!tester.classList.contains('b')){
          var methods = ['add', 'remove'];
          var patch = function(definition, method){
            var historic = definition[method];
            definition[method] = function(){
              for(var i = arguments.length - 1; i >= 0; i--){
                var token = arguments[i];
                historic.call(this, token);
              }
            };
          };
          for(var i = methods.length - 1; i >= 0; i--){
            var method = methods[i];
            patch(DOMTokenList.prototype, method);
          }
        }

        // test and patch toggle with force
        tester.classList.toggle('c', false);
        if(tester.classList.contains('c')){
          var historic = DOMTokenList.prototype.toggle;
          DOMTokenList.prototype.toggle = function(token, force){
            if (arguments.length > 0 && this.contains(token) === force) {
              return force;
            }
            return historic.call(this, token);
          };
        }

      }

    }

  // Polyfill CustomEvent for IE 9, 10, 11.
  // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

  // IE11 gives a false positive for CustomEvent, so detect it here so we don't replace native CustomEvent in other browsers.
  //if (!window.CustomEvent || Object.hasOwnProperty.call(window, 'ActiveXObject') && !window.ActiveXObject) {
  if (window.location.hash = !!window.MSInputMethodContext && !!document.documentMode) {
    // is IE11
    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  }

})(this);
