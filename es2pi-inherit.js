/*
 * js-es2pi-inherit
 * https://github.com/c9iim/js-es2pi-inherit
 *
 *  just a few of the extensions of js-es2pi.
 *  about js-es2pi, see: https://github.com/dankogai/js-es2pi
 *
 *  VERSION: 0.0.1
 *
 *  (c) 2014 io.github.c9iim
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */
(function(root) {
    'use strict';
    var O = Object;
    var OP = O.prototype;
    var create = O.create;
    var extend = O.extend;
    var clone = O.clone;
    var installProperty = O.installProperty;
    var getOwnPropertyNames = O.getOwnPropertyNames;
    var getPrototypeOf = O.getPrototypeOf;
    var defineProperty = O.defineProperty;
    var toString = OP.toString;
    var hasOwnProperty = ''.hasOwnProperty;
    var nameOfSafe = '__previousProperties__';
    var nameOfParent = '__parent__';
    // exported functions: function public(...){...}
    // private  functions: var private = function(...){...}
    var has = function(o, k) {
        return hasOwnProperty.call(o, k);
    };
    var defaultProperty = function(target, prop, desc) {
        return has(target, prop) ? false : installProperty(target, prop, desc);
    };
    var defaultProperties = function(target, descs) {
        getOwnPropertyNames(descs)
            .filter(function(k) {
                return k !== nameOfSafe;
            })
            .forEach(function(name) {
                defaultProperty(target, name, descs[name]);
            });
        return target;
    };
    var obj2specs = function(src) {
        var specs = create(null);
        getOwnPropertyNames(src).forEach(function(k) {
            specs[k] = {
                value: src[k],
                configurable: true,
                writable: true,
                enumerable: false
            };
        });
        return specs;
    };
    // relationships
    function buildRelationships(obj, namesOfSkip) {
        var rgx;
        namesOfSkip = namesOfSkip ? [nameOfSafe, nameOfParent].concat(namesOfSkip) : [nameOfSafe, nameOfParent];
        rgx = new RegExp(namesOfSkip.join('|'));
        return (function _buildRelationships(o) {
            getOwnPropertyNames(o)
                .filter(function(k) {
                    return !k.match(rgx);
                })
                .forEach(function(n) {
                    var t = toString.call(o[n]);
                    if (t === '[object Object]' || t === '[object Array]') {
                        _buildRelationships(o[n]);
                        defineProperty(o[n], nameOfParent, {
                            value: o,
                            configurable: true,
                            writable: false,
                            enumerable: false
                        });
                    }
                });
            return o;
        })(obj);
    }
    function eraseRelationships(obj, namesOfSkip) {
        var rgx;
        namesOfSkip = namesOfSkip ? [nameOfSafe].concat(namesOfSkip) : [nameOfSafe];
        rgx = new RegExp(namesOfSkip.join('|'));
        return (function _eraseRelationships(o) {
            getOwnPropertyNames(o)
                .filter(function(k) {
                    return !k.match(rgx);
                })
                .forEach(function(n) {
                    var t = toString.call(o[n]);
                    if (t === '[object Object]' || t === '[object Array]') {
                        delete o[n][nameOfParent];
                        _eraseRelationships(o[n]);
                    }
                });
            return o;
        })(obj, rgx);
    }
    // extend
    function extend2(dst, src) {
        var f;
        function F() {}
        F.prototype = dst;
        f = extend(new F(), src);
        return f;
    }
    // inherit
    function inherit(dst, src) {
        return extend(clone(dst, true), src);
    }
    function inherit2(dst, src) {
        return extend2(clone(dst, true), src);
    }
    // prototype
    function parent() {
        return this[nameOfParent];
    }
    function previous() {
        return getPrototypeOf(this);
    }
    defaultProperties(O, obj2specs({
        buildRelationships: buildRelationships,
        eraseRelationships: eraseRelationships,
        extend2: extend2,
        inherit: inherit,
        inherit2: inherit2
    }));
    defaultProperties(OP, obj2specs({
        parent: parent,
        previous: previous
    }));
})(this);
