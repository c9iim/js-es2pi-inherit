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
(function(root){
    'use strict';
    var O = Object;
    var OP = O.prototype;
    var create = O.create;
    var extend = O.extend;
    var clone = O.clone;
    var installProperty = O.installProperty;
    var getOwnPropertyNames = O.getOwnPropertyNames;
    var defineProperty = O.defineProperty;
    var hasOwnProperty = ''.hasOwnProperty;
    var nameOfSafe = '__previousProperties__';
    // exported functions: function public(...){...}
    // private  functions: var private = function(...){...}
    var has = function(o, k) {
        return hasOwnProperty.call(o, k);
    };
    var defaultProperty = function(target, prop, desc) {
        return has(target, prop) 
            ? false : installProperty(target, prop, desc);
    };
    var defaultProperties = function(target, descs) {
        getOwnPropertyNames(descs)
            .filter(function(k) {return k !== nameOfSafe})
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
    function extend2(dst, src) {
        var f;
        function F(){}
        F.prototype = dst;
        f = extend(new F(), src);
        defineProperty(f, '__parent__', {
            enumerable: false,
            configurable: false,
            writable: false,
            value: dst
        });
        return f;
    };
    function inherit(dst, src) {
        return extend(clone(dst, true), src);
    };
    function inherit2(dst, src) {
        return extend2(clone(dst, true), src);
    };
    function parent() {
        return this.__parent__;
    };
    defaultProperties(O, obj2specs({
        extend2: extend2,
        inherit: inherit,
        inherit2: inherit2
    }));
    defaultProperties(OP, obj2specs({
        parent: parent
    }));
})(this);