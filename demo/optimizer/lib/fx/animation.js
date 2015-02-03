/** Oslo JavaScript Framework. */
define(["../util/util","./transitionbase","./eventtype","./util","./event"],function(a,b,c,d,e){"use strict";var f=function(c,d,e,f){if(b.call(this),!a.isArray(c)||!a.isArray(d))throw Error("Start and end parameters must be arrays");if(c.length!==d.length)throw Error("Start and end points must be the same length");this.startPoint=c,this.endPoint=d,this.duration=e,this.accel_=f,this.coords=[],this.useRightPositioningForRtl_=!1};return a.inherits(f,b),a.mixin(f.prototype,{enableRightPositioningForRtl:function(a){this.useRightPositioningForRtl_=a},isRightPositioningForRtlEnabled:function(){return this.useRightPositioningForRtl_},fps_:0,progress:0,lastFrame:null,play:function(b){if(b||this.isStopped())this.progress=0,this.coords=this.startPoint;else if(this.isPlaying())return!1;d.unregisterAnimation(this);var c=a.now();return this.startTime=c,this.isPaused()&&(this.startTime-=this.duration*this.progress),this.endTime=this.startTime+this.duration,this.lastFrame=this.startTime,this.progress||this.onBegin(),this.onPlay(),this.isPaused()&&this.onResume(),this.setStatePlaying(),d.registerAnimation(this),this.cycle(c),!0},stop:function(a){d.unregisterAnimation(this),this.setStateStopped(),a&&(this.progress=1),this.updateCoords_(this.progress),this.onStop(),this.onEnd()},pause:function(){this.isPlaying()&&(d.unregisterAnimation(this),this.setStatePaused(),this.onPause())},getProgress:function(){return this.progress},setProgress:function(b){if(this.progress=b,this.isPlaying()){var c=a.now();this.startTime=c-this.duration*this.progress,this.endTime=this.startTime+this.duration}},disposeInternal:function(){this.isStopped()||this.stop(!1),this.onDestroy(),f.superClass_.disposeInternal.call(this)},onAnimationFrame:function(a){this.cycle(a)},cycle:function(a){this.progress=(a-this.startTime)/(this.endTime-this.startTime),this.progress>=1&&(this.progress=1),this.fps_=1e3/(a-this.lastFrame),this.lastFrame=a,this.updateCoords_(this.progress),1===this.progress?(this.setStateStopped(),d.unregisterAnimation(this),this.onFinish(),this.onEnd()):this.isPlaying()&&this.onAnimate()},updateCoords_:function(b){a.isFunction(this.accel_)&&(b=this.accel_(b)),this.coords=new Array(this.startPoint.length);for(var c=0;c<this.startPoint.length;c++)this.coords[c]=(this.endPoint[c]-this.startPoint[c])*b+this.startPoint[c]},onAnimate:function(){this.dispatchAnimationEvent(c.ANIMATE)},onDestroy:function(){this.dispatchAnimationEvent(c.DESTROY)},dispatchAnimationEvent:function(a){this.dispatchEvent(new e(a,this))}}),f});