!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Barrage=e()}(this,function(){"use strict";function t(t){this.cvs=document.createElement("canvas");t=document.querySelector(t);if(!t)throw new Error("ReferenceError: selector is not exist.");this.target=t,this.list=[],this.init()}return t.prototype.run=function(){this.rId&&cancelAnimationFrame(this.rId),this.animate()},t.prototype.addMessage=function(t){var e=t.style||{},i=e.fontSize,s=void 0===i?"20px":i,o=e.fontFamily,n=void 0===o?"Microsoft YaHei":o,i=e.color,o=void 0===i?"#fff":i;t.speed||(t.speed=3);e=this.getPositoin(parseInt(s)),i=e[0],e=e[1];return this.list.push({x:i,y:e,id:String(Math.ceil(1e3*Math.random()))+e+t.speed*e,text:t.text,speed:t.speed,style:{color:o,fontSize:s,fontFamily:n}}),this},t.prototype.addMessages=function(t){var e=this;return t.forEach(function(t){return e.addMessage(t)}),this},t.prototype.init=function(){var t=this.target.offsetWidth,e=this.target.offsetHeight;this.cvs.width=t,this.cvs.height=e,this.target.setAttribute("style","position: relative;"),this.cvs.setAttribute("style","position: absolute; pointer-events: none; left: 0; top: 0; z-index: 9999;"),this.ctx=this.cvs.getContext("2d"),this.target.appendChild(this.cvs)},t.prototype.getPositoin=function(t){var e=this.cvs.width,t=Math.random()*(this.cvs.height-t);return[Math.floor(e),Math.floor(t)]},t.prototype.animate=function(){if(this.list.length){this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);for(var e=[],t=0,i=this.list;t<i.length;t++){var s,o,n,r=i[t];r.x-=r.speed,r.x>=this.cvs.width||(n=(o=r.style).color,s=o.fontSize,o=o.fontFamily,this.ctx.beginPath(),this.ctx.font="".concat(s," ").concat(o),this.ctx.fillStyle=n,this.ctx.fillText(r.text,r.x,r.y+parseInt(r.style.fontSize)),n=this.ctx.measureText(r.text).width,r.x<=-n&&e.push(r.id))}this.list=this.list.filter(function(t){return!e.includes(t.id)}),this.rId=requestAnimationFrame(this.animate.bind(this))}else this.rId&&cancelAnimationFrame(this.rId)},t});