/** Oslo JavaScript Framework. */
define("@fx.Fade",["@util","@style.util","@fx.effectBase"],function(a,b,c){"use strict";var d=function(b,d,e,f,g){if(a.isNumber(d)&&(d=[d]),a.isNumber(e)&&(e=[e]),c.call(this,b,d,e,f,g),1!==d.length||1!==e.length)throw Error("Start and end points must be 1D")};return a.inherits(d,c),d.prototype.updateStyle=function(){b.setOpacity(this.element,this.coords[0])},d.prototype.show=function(){this.element.style.display=""},d.prototype.hide=function(){this.element.style.display="none"},d});