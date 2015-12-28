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

 // ES 15.2.3.6 Object.defineProperty (O, P, Attributes).
// Partial support for most common case - getters, setters, and values.
(function() {

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

  // DOMTokenList interface and Element.classList / Element.relList
  // Needed for: IE9-
  // Use getClassList(elem) instead of elem.classList() if IE7- support is needed
  // Use getRelList(elem) instead of elem.relList() if IE7- support is needed
    (function() {
      function DOMTokenListShim(o, p) {
        function split(s) { return s.length ? s.split(/\s+/g) : []; }

        // NOTE: This does not exactly match the spec.
        function removeTokenFromString(token, string) {
          var tokens = split(string),
              index = tokens.indexOf(token);
          if (index !== -1) {
            tokens.splice(index, 1);
          }
          return tokens.join(' ');
        }

        Object.defineProperties(
          this,
          {
            length: {
              get: function() { return split(o[p]).length; }
            },

            item: {
              value: function(idx) {
                var tokens = split(o[p]);
                return 0 <= idx && idx < tokens.length ? tokens[idx] : null;
              }
            },

            contains: {
              value: function(token) {
                token = String(token);
                if (token.length === 0) { throw SyntaxError(); }
                if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
                var tokens = split(o[p]);

                return tokens.indexOf(token) !== -1;
              }
            },

            add: {
              value: function(/*tokens...*/) {
                var tokens = Array.prototype.slice.call(arguments).map(String);
                if (tokens.some(function(token) { return token.length === 0; })) {
                  throw SyntaxError();
                }
                if (tokens.some(function(token) { return (/\s/).test(token); })) {
                  throw Error("InvalidCharacterError");
                }

                try {
                  var underlying_string = o[p];
                  var token_list = split(underlying_string);
                  tokens = tokens.filter(function(token) { return token_list.indexOf(token) === -1; });
                  if (tokens.length === 0) {
                    return;
                  }
                  if (underlying_string.length !== 0 && !(/\s$/).test(underlying_string)) {
                    underlying_string += ' ';
                  }
                  underlying_string += tokens.join(' ');
                  o[p] = underlying_string;
                } finally {
                  var length = split(o[p]).length;
                  if (this.length !== length) { this.length = length; }
                }
              }
            },

            remove: {
              value: function(/*tokens...*/) {
                var tokens = Array.prototype.slice.call(arguments).map(String);
                if (tokens.some(function(token) { return token.length === 0; })) {
                  throw SyntaxError();
                }
                if (tokens.some(function(token) { return (/\s/).test(token); })) {
                  throw Error("InvalidCharacterError");
                }

                try {
                  var underlying_string = o[p];
                  tokens.forEach(function(token) {
                    underlying_string = removeTokenFromString(token, underlying_string);
                  });
                  o[p] = underlying_string;
                } finally {
                  var length = split(o[p]).length;
                  if (this.length !== length) { this.length = length; }
                }
              }
            },

            toggle: {
              value: function(token, force) {
                try {
                  token = String(token);
                  if (token.length === 0) { throw SyntaxError(); }
                  if (/\s/.test(token)) { throw Error("InvalidCharacterError"); }
                  var tokens = split(o[p]),
                      index = tokens.indexOf(token);

                  if (index !== -1 && (!force || force === (void 0))) {
                    o[p] = removeTokenFromString(token, o[p]);
                    return false;
                  }
                  if (index !== -1 && force) {
                    return true;
                  }
                  var underlying_string = o[p];
                  if (underlying_string.length !== 0 && !/\s$/.test(underlying_string)) {
                    underlying_string += ' ';
                  }
                  underlying_string += token;
                  o[p] = underlying_string;
                  return true;
                } finally {
                  var length = split(o[p]).length;
                  if (this.length !== length) { this.length = length; }
                }
              }
            },

            toString: {
              value: function() {
                return o[p];
              }
            }
          });
        if (!('length' in this)) {
          // In case getters are not supported
          this.length = split(o[p]).length;
        } else {
          // If they are, shim in index getters (up to 100)
          for (var i = 0; i < 100; ++i) {
            Object.defineProperty(this, String(i), {
              get: (function(n) { return function() { return this.item(n); }; }(i))
            });
          }
        }
      }

      function addToElementPrototype(p, f) {
        if ('Element' in global && Element.prototype && Object.defineProperty) {
          Object.defineProperty(Element.prototype, p, { get: f });
        }
      }

    }());

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

})();
