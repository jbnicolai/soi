/** Oslo JavaScript Framework. */
define(["../util/util","../events/eventbase"],function(a,b){"use strict";var c=function(c,d,e,f,g,h,i,j){b.call(this,c),this.clientX=e,this.clientY=f,this.browserEvent=g,this.left=a.isDef(h)?h:d.deltaX,this.top=a.isDef(i)?i:d.deltaY,this.dragger=d,this.dragCanceled=!!j};return a.inherits(c,b),c});