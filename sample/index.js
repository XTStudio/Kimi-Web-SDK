(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";var __extends=this&&this.__extends||function(){var o=function(t,e){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(o,t){o.__proto__=t}||function(o,t){for(var e in t)t.hasOwnProperty(e)&&(o[e]=t[e])})(t,e)};return function(t,e){function r(){this.constructor=t}o(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}}(),FooViewController=function(o){function t(){var t=null!==o&&o.apply(this,arguments)||this;return t.fooLabel=new UILabel,t}return __extends(t,o),t.prototype.viewDidLoad=function(){var t;o.prototype.viewDidLoad.call(this);var e=new UIParagraphStyle;e.alignment=UITextAlignment.center;var r=new UIAttributedString("Hello, World!Hello, World!Hello, World!Hello, World!Hello, World!",((t={})[UIAttributedStringKey.font]=new UIFont(18),t[UIAttributedStringKey.foregroundColor]=UIColor.gray,t[UIAttributedStringKey.backgroundColor]=UIColor.yellow,t[UIAttributedStringKey.kern]=4,t[UIAttributedStringKey.paragraphStyle]=e,t)).mutable();this.fooLabel.numberOfLines=0,console.log(r.measure({width:UIScreen.main.bounds.width,height:1/0})),this.fooLabel.attributedText=r,this.view.addSubview(this.fooLabel)},t.prototype.viewWillLayoutSubviews=function(){o.prototype.viewWillLayoutSubviews.call(this),this.fooLabel.frame=this.view.bounds},t}(UIViewController),fooWindow=new UIWindow;fooWindow.rootViewController=new FooViewController,global.fooWindow=fooWindow;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
