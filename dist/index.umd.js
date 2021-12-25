!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(t="undefined"!=typeof globalThis?globalThis:t||self).Barrage=i()}(this,function(){"use strict";function t(t){this.list=[],this.rId=0,this.isListen=!1,this.listenerTimer=null,this.cvs=document.createElement("canvas");t=document.querySelector(t);if(!t)throw new Error("ReferenceError: selector is not exist.");this.target=t,this.init()}return t.prototype.run=function(){this.handleListenr()},t.prototype.addMessage=function(t){var i=t.style||{},e=i.fontSize,s=void 0===e?"20px":e,n=i.fontFamily,r=void 0===n?"Microsoft YaHei":n,e=i.color,n=void 0===e?"#fff":e;t.speed||(t.speed=3);i=this.getPositoin(parseInt(s)),e=i[0],i=i[1];return this.list.push({x:e,y:i,id:String(Math.ceil(1e3*Math.random()))+i+t.speed*i,text:t.text,speed:t.speed,style:{color:n,fontSize:s,fontFamily:r}}),this},t.prototype.addMessages=function(t){var i=this;return t.forEach(function(t){return i.addMessage(t)}),this},t.prototype.clear=function(){this.list=[],this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height)},t.prototype.stop=function(){this.listenerTimer&&clearInterval(this.listenerTimer),this.listenerTimer=null,this.rId&&cancelAnimationFrame(this.rId)},t.prototype.init=function(){var t=this.target.offsetWidth,i=this.target.offsetHeight;this.cvs.width=t,this.cvs.height=i,this.target.setAttribute("style","position: relative;"),this.cvs.setAttribute("style","position: absolute; pointer-events: none; left: 0; top: 0; z-index: 9999;"),this.ctx=this.cvs.getContext("2d"),this.target.appendChild(this.cvs)},t.prototype.getPositoin=function(t){var i=this.cvs.width,t=Math.random()*(this.cvs.height-t);return[Math.floor(i),Math.floor(t)]},t.prototype.handleListenr=function(){var t=this;this.isListen||(this.isListen=!0,this.list.length?this.handleAnimate():this.listenerTimer=setInterval(function(){t.handleAnimate()},1e3))},t.prototype.handleAnimate=function(){0<this.list.length&&(this.rId&&cancelAnimationFrame(this.rId),this.animate(),this.isListen=!1,this.listenerTimer&&clearInterval(this.listenerTimer))},t.prototype.animate=function(){if(!this.list.length)return this.rId&&cancelAnimationFrame(this.rId),void this.handleListenr();this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);for(var i=[],t=0,e=this.list;t<e.length;t++){var s,n,r,h=e[t];h.x-=h.speed,h.x>=this.cvs.width||(r=(n=h.style).color,s=n.fontSize,n=n.fontFamily,this.ctx.beginPath(),this.ctx.font="".concat(s," ").concat(n),this.ctx.fillStyle=r,this.ctx.fillText(h.text,h.x,h.y+parseInt(h.style.fontSize)),r=this.ctx.measureText(h.text).width,h.x<=-r&&i.push(h.id))}this.list=this.list.filter(function(t){return!i.includes(t.id)}),this.rId=requestAnimationFrame(this.animate.bind(this))},t});
