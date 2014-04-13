es2pi-inherit.js
========

Just a few of the extensions of js-es2pi.

SYNOPSIS
-----------

````javascript
var parent = {name:"dankogai", lang:"javascript"};
var child = Object.inherit(parent, {name:"mii"});
var extension = Object.extend(child, {lang:"fluidchainjs"});
console.log(parent); // {"name":"dankogai", "lang":"javascript"}
console.log(child); // {"name":"mii", "lang":"fluidchainjs"}
console.log(extension); // {"name":"mii", "lang":"fluidchainjs"}
console.log(child.parent()); // undefined

var parent = {name:"dankogai", lang:"javascript"};
var child = Object.inherit2(parent, {name:"mii"});
var extension = Object.extend2(child, {lang:"fluidchainjs"});
Object.extend(parent, {lang:"rust"});
console.log(parent); // {"name":"dankogai", "lang":"rust"}
console.log(child); // {"name":"mii", "lang":"javascript"}
console.log(extension); // {"name":"mii", "lang":"fluidchainjs"}
console.log(child.parent()); // {name:"dankogai", lang:"javascript"}
````

REQUIREMENT
-----------

+ EcmaScript 5 compliance.
+ https://github.com/dankogai/js-es2pi

See Also
--------
+ https://github.com/dankogai/js-es2pi
