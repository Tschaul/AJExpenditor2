/* */ 
module.exports=function(n){function r(e){if(t[e])return t[e].exports;var o=t[e]={exports:{},id:e,loaded:!1};return n[e].call(o.exports,o,o.exports,r),o.loaded=!0,o.exports}var t={};return r.m=n,r.c=t,r.p="",r(0)}([function(n,r,t){"use strict";var e=t(1);"undefined"!=typeof Immutable&&(Immutable.installDevTools=install.bind(null,Immutable));var o=!1;n.exports=function(n){if("undefined"==typeof window)throw new Error("Can only install immutable-devtools in a browser environment.");o!==!0&&(window.devtoolsFormatters=window.devtoolsFormatters||[],window.devtoolsFormatters.push(e(n)),o=!0)}},function(n,r){"use strict";function t(n){if(Array.isArray(n)){for(var r=0,t=Array(n.length);r<n.length;r++)t[r]=n[r];return t}return Array.from(n)}var e={style:"list-style-type: none; padding: 0; margin: 0 0 0 12px"},o={style:"color:#881391"};n.exports=function(n){function r(n,r){return["object",{object:n,config:r}]}function u(n){return n.size>0}function a(n){return["span",o,n+": "]}function i(n){var o=n.map(function(n,t){return["li",a(t),r(n)]}).toList().toJS();return["ol",e].concat(t(o))}function d(n){var o=n.map(function(n){return["li",r(n)]}).toJS();return["ol",e].concat(t(o))}function s(r){return r instanceof n.Record?v:Object.keys(w).filter(function(t){return n[t]["is"+t](r)}).map(function(n){return w[n]}).concat(f)[0]}var c={},f={header:function(n,t){return t===c?null:r(n,c)},hasBody:function(n,r){return!1},body:function(n,r){return null}},l={header:function(){return["span","Map"]},hasBody:u,body:i},y={header:function(){return["span","OrderedMap"]},hasBody:u,body:i},p={header:function(){return["span","List"]},hasBody:u,body:i},h={header:function(){return["span","Stack"]},hasBody:u,body:d},m={header:function(){return["span","Set"]},hasBody:u,body:d},b={header:function(){return["span","OrderedSet"]},hasBody:u,body:d},v={header:function(){return["span","Record"]},hasBody:u,body:function(n){var o=n.keySeq().map(function(t){return["li",a(t),r(n.get(t))]}).toJS();return["ol",e].concat(t(o))}},w={OrderedMap:y,OrderedSet:b,List:p,Map:l,Set:m,Stack:h};return{header:function(n,r){return s(n).header(n,r)},hasBody:function(n,r){return s(n).hasBody(n,r)},body:function(n,r){return s(n).body(n,r)}}}}]);