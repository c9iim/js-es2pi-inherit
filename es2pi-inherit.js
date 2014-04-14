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
    function buildRelationships(obj) {
        getOwnPropertyNames(obj)
            .filter(function(k) {
                return k !== nameOfSafe;
            })
            .forEach(function(name) {
                var type = toString.call(obj[name]);
                if (type === '[object Object]' || type === '[object Array]') {
                    buildRelationships(obj[name]);
                    defineProperty(obj[name], '__parent__', {
                        value: obj,
                        configurable: true,
                        writable: false,
                        enumerable: false
                    });
                }
            });
        return obj;
    }
    function eraseRelationships(obj) {
        getOwnPropertyNames(obj)
            .filter(function(k) {
                return k !== nameOfSafe;
            })
            .forEach(function(name) {
                var type = toString.call(obj[name]);
                if (type === '[object Object]' || type === '[object Array]') {
                    delete obj[name].__parent__;
                    eraseRelationships(obj[name]);
                }
            });
        return obj;
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
        return this.__parent__;
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
