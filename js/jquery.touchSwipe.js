!function(a){"function"==typeof define&&define.amd&&define.amd.jQuery?define(["jquery"],a):a("undefined"!=typeof module&&module.exports?require("jquery"):jQuery)}(function($){"use strict";function init(b){return!b||void 0!==b.allowPageScroll||void 0===b.swipe&&void 0===b.swipeStatus||(b.allowPageScroll=NONE),void 0!==b.click&&void 0===b.tap&&(b.tap=b.click),b||(b={}),b=$.extend({},$.fn.swipe.defaults,b),this.each(function(){var a=$(this),plugin=a.data(PLUGIN_NS);plugin||(plugin=new TouchSwipe(this,b),a.data(PLUGIN_NS,plugin))})}function TouchSwipe(g,h){function touchStart(a){if(!(getTouchInProgress()||$(a.target).closest(h.excludedElements,$element).length>0)){var b=a.originalEvent?a.originalEvent:a;if(!b.pointerType||"mouse"!=b.pointerType||0!=h.fallbackToMouseEvents){var c,touches=b.touches,evt=touches?touches[0]:b;return phase=PHASE_START,touches?fingerCount=touches.length:h.preventDefaultEvents!==!1&&a.preventDefault(),distance=0,direction=null,currentDirection=null,pinchDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,maximumsMap=createMaximumsData(),cancelMultiFingerRelease(),createFingerData(0,evt),!touches||fingerCount===h.fingers||h.fingers===ALL_FINGERS||hasPinches()?(startTime=getTimeStamp(),2==fingerCount&&(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)),(h.swipeStatus||h.pinchStatus)&&(c=triggerHandler(b,phase))):c=!1,c===!1?(phase=PHASE_CANCEL,triggerHandler(b,phase),c):(h.hold&&(holdTimeout=setTimeout($.proxy(function(){$element.trigger("hold",[b.target]),h.hold&&(c=h.hold.call($element,b,b.target))},this),h.longTapThreshold)),setTouchInProgress(!0),null)}}}function touchMove(a){var b=a.originalEvent?a.originalEvent:a;if(phase!==PHASE_END&&phase!==PHASE_CANCEL&&!inMultiFingerRelease()){var c,touches=b.touches,evt=touches?touches[0]:b,currentFinger=updateFingerData(evt);if(endTime=getTimeStamp(),touches&&(fingerCount=touches.length),h.hold&&clearTimeout(holdTimeout),phase=PHASE_MOVE,2==fingerCount&&(0==startTouchesDistance?(createFingerData(1,touches[1]),startTouchesDistance=endTouchesDistance=calculateTouchesDistance(fingerData[0].start,fingerData[1].start)):(updateFingerData(touches[1]),endTouchesDistance=calculateTouchesDistance(fingerData[0].end,fingerData[1].end),pinchDirection=calculatePinchDirection(fingerData[0].end,fingerData[1].end)),pinchZoom=calculatePinchZoom(startTouchesDistance,endTouchesDistance),pinchDistance=Math.abs(startTouchesDistance-endTouchesDistance)),fingerCount===h.fingers||h.fingers===ALL_FINGERS||!touches||hasPinches()){if(direction=calculateDirection(currentFinger.start,currentFinger.end),currentDirection=calculateDirection(currentFinger.last,currentFinger.end),validateDefaultEvent(a,currentDirection),distance=calculateDistance(currentFinger.start,currentFinger.end),duration=calculateDuration(),setMaxDistance(direction,distance),c=triggerHandler(b,phase),!h.triggerOnTouchEnd||h.triggerOnTouchLeave){var d=!0;if(h.triggerOnTouchLeave){var e=getbounds(this);d=isInBounds(currentFinger.end,e)}!h.triggerOnTouchEnd&&d?phase=getNextPhase(PHASE_MOVE):h.triggerOnTouchLeave&&!d&&(phase=getNextPhase(PHASE_END)),phase!=PHASE_CANCEL&&phase!=PHASE_END||triggerHandler(b,phase)}}else phase=PHASE_CANCEL,triggerHandler(b,phase);c===!1&&(phase=PHASE_CANCEL,triggerHandler(b,phase))}}function touchEnd(a){var b=a.originalEvent?a.originalEvent:a,touches=b.touches;if(touches){if(touches.length&&!inMultiFingerRelease())return startMultiFingerRelease(b),!0;if(touches.length&&inMultiFingerRelease())return!0}return inMultiFingerRelease()&&(fingerCount=fingerCountAtRelease),endTime=getTimeStamp(),duration=calculateDuration(),didSwipeBackToCancel()||!validateSwipeDistance()?(phase=PHASE_CANCEL,triggerHandler(b,phase)):h.triggerOnTouchEnd||h.triggerOnTouchEnd===!1&&phase===PHASE_MOVE?(h.preventDefaultEvents!==!1&&a.cancelable!==!1&&a.preventDefault(),phase=PHASE_END,triggerHandler(b,phase)):!h.triggerOnTouchEnd&&hasTap()?(phase=PHASE_END,triggerHandlerForGesture(b,phase,TAP)):phase===PHASE_MOVE&&(phase=PHASE_CANCEL,triggerHandler(b,phase)),setTouchInProgress(!1),null}function touchCancel(){fingerCount=0,endTime=0,startTime=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,cancelMultiFingerRelease(),setTouchInProgress(!1)}function touchLeave(a){var b=a.originalEvent?a.originalEvent:a;h.triggerOnTouchLeave&&(phase=getNextPhase(PHASE_END),triggerHandler(b,phase))}function removeListeners(){$element.unbind(START_EV,touchStart),$element.unbind(CANCEL_EV,touchCancel),$element.unbind(MOVE_EV,touchMove),$element.unbind(END_EV,touchEnd),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave),setTouchInProgress(!1)}function getNextPhase(a){var b=a,validTime=validateSwipeTime(),validDistance=validateSwipeDistance(),didCancel=didSwipeBackToCancel();return!validTime||didCancel?b=PHASE_CANCEL:!validDistance||a!=PHASE_MOVE||h.triggerOnTouchEnd&&!h.triggerOnTouchLeave?!validDistance&&a==PHASE_END&&h.triggerOnTouchLeave&&(b=PHASE_CANCEL):b=PHASE_END,b}function triggerHandler(a,b){var c,touches=a.touches;return(didSwipe()||hasSwipes())&&(c=triggerHandlerForGesture(a,b,SWIPE)),(didPinch()||hasPinches())&&c!==!1&&(c=triggerHandlerForGesture(a,b,PINCH)),didDoubleTap()&&c!==!1?c=triggerHandlerForGesture(a,b,DOUBLE_TAP):didLongTap()&&c!==!1?c=triggerHandlerForGesture(a,b,LONG_TAP):didTap()&&c!==!1&&(c=triggerHandlerForGesture(a,b,TAP)),b===PHASE_CANCEL&&touchCancel(a),b===PHASE_END&&(touches?touches.length||touchCancel(a):touchCancel(a)),c}function triggerHandlerForGesture(a,b,c){var d;if(c==SWIPE){if($element.trigger("swipeStatus",[b,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection]),h.swipeStatus&&(d=h.swipeStatus.call($element,a,b,direction||null,distance||0,duration||0,fingerCount,fingerData,currentDirection),d===!1))return!1;if(b==PHASE_END&&validateSwipe()){if(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),$element.trigger("swipe",[direction,distance,duration,fingerCount,fingerData,currentDirection]),h.swipe&&(d=h.swipe.call($element,a,direction,distance,duration,fingerCount,fingerData,currentDirection),d===!1))return!1;switch(direction){case LEFT:$element.trigger("swipeLeft",[direction,distance,duration,fingerCount,fingerData,currentDirection]),h.swipeLeft&&(d=h.swipeLeft.call($element,a,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case RIGHT:$element.trigger("swipeRight",[direction,distance,duration,fingerCount,fingerData,currentDirection]),h.swipeRight&&(d=h.swipeRight.call($element,a,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case UP:$element.trigger("swipeUp",[direction,distance,duration,fingerCount,fingerData,currentDirection]),h.swipeUp&&(d=h.swipeUp.call($element,a,direction,distance,duration,fingerCount,fingerData,currentDirection));break;case DOWN:$element.trigger("swipeDown",[direction,distance,duration,fingerCount,fingerData,currentDirection]),h.swipeDown&&(d=h.swipeDown.call($element,a,direction,distance,duration,fingerCount,fingerData,currentDirection))}}}if(c==PINCH){if($element.trigger("pinchStatus",[b,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),h.pinchStatus&&(d=h.pinchStatus.call($element,a,b,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData),d===!1))return!1;if(b==PHASE_END&&validatePinch())switch(pinchDirection){case IN:$element.trigger("pinchIn",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),h.pinchIn&&(d=h.pinchIn.call($element,a,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData));break;case OUT:$element.trigger("pinchOut",[pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData]),h.pinchOut&&(d=h.pinchOut.call($element,a,pinchDirection||null,pinchDistance||0,duration||0,fingerCount,pinchZoom,fingerData))}}return c==TAP?b!==PHASE_CANCEL&&b!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),hasDoubleTap()&&!inDoubleTap()?(doubleTapStartTime=getTimeStamp(),singleTapTimeout=setTimeout($.proxy(function(){doubleTapStartTime=null,$element.trigger("tap",[a.target]),h.tap&&(d=h.tap.call($element,a,a.target))},this),h.doubleTapThreshold)):(doubleTapStartTime=null,$element.trigger("tap",[a.target]),h.tap&&(d=h.tap.call($element,a,a.target)))):c==DOUBLE_TAP?b!==PHASE_CANCEL&&b!==PHASE_END||(clearTimeout(singleTapTimeout),clearTimeout(holdTimeout),doubleTapStartTime=null,$element.trigger("doubletap",[a.target]),h.doubleTap&&(d=h.doubleTap.call($element,a,a.target))):c==LONG_TAP&&(b!==PHASE_CANCEL&&b!==PHASE_END||(clearTimeout(singleTapTimeout),doubleTapStartTime=null,$element.trigger("longtap",[a.target]),h.longTap&&(d=h.longTap.call($element,a,a.target)))),d}function validateSwipeDistance(){var a=!0;return null!==h.threshold&&(a=distance>=h.threshold),a}function didSwipeBackToCancel(){var a=!1;return null!==h.cancelThreshold&&null!==direction&&(a=getMaxDistance(direction)-distance>=h.cancelThreshold),a}function validatePinchDistance(){return null===h.pinchThreshold||pinchDistance>=h.pinchThreshold}function validateSwipeTime(){var a;return a=!h.maxTimeThreshold||!(duration>=h.maxTimeThreshold)}function validateDefaultEvent(a,b){if(h.preventDefaultEvents!==!1)if(h.allowPageScroll===NONE)a.preventDefault();else{var c=h.allowPageScroll===AUTO;switch(b){case LEFT:(h.swipeLeft&&c||!c&&h.allowPageScroll!=HORIZONTAL)&&a.preventDefault();break;case RIGHT:(h.swipeRight&&c||!c&&h.allowPageScroll!=HORIZONTAL)&&a.preventDefault();break;case UP:(h.swipeUp&&c||!c&&h.allowPageScroll!=VERTICAL)&&a.preventDefault();break;case DOWN:(h.swipeDown&&c||!c&&h.allowPageScroll!=VERTICAL)&&a.preventDefault();break;case NONE:}}}function validatePinch(){var a=validateFingers(),hasEndPoint=validateEndPoint(),hasCorrectDistance=validatePinchDistance();return a&&hasEndPoint&&hasCorrectDistance}function hasPinches(){return!!(h.pinchStatus||h.pinchIn||h.pinchOut)}function didPinch(){return!(!validatePinch()||!hasPinches())}function validateSwipe(){var a=validateSwipeTime(),hasValidDistance=validateSwipeDistance(),hasCorrectFingerCount=validateFingers(),hasEndPoint=validateEndPoint(),didCancel=didSwipeBackToCancel(),valid=!didCancel&&hasEndPoint&&hasCorrectFingerCount&&hasValidDistance&&a;return valid}function hasSwipes(){return!!(h.swipe||h.swipeStatus||h.swipeLeft||h.swipeRight||h.swipeUp||h.swipeDown)}function didSwipe(){return!(!validateSwipe()||!hasSwipes())}function validateFingers(){return fingerCount===h.fingers||h.fingers===ALL_FINGERS||!SUPPORTS_TOUCH}function validateEndPoint(){return 0!==fingerData[0].end.x}function hasTap(){return!!h.tap}function hasDoubleTap(){return!!h.doubleTap}function hasLongTap(){return!!h.longTap}function validateDoubleTap(){if(null==doubleTapStartTime)return!1;var a=getTimeStamp();return hasDoubleTap()&&a-doubleTapStartTime<=h.doubleTapThreshold}function inDoubleTap(){return validateDoubleTap()}function validateTap(){return(1===fingerCount||!SUPPORTS_TOUCH)&&(isNaN(distance)||distance<h.threshold)}function validateLongTap(){return duration>h.longTapThreshold&&distance<DOUBLE_TAP_THRESHOLD}function didTap(){return!(!validateTap()||!hasTap())}function didDoubleTap(){return!(!validateDoubleTap()||!hasDoubleTap())}function didLongTap(){return!(!validateLongTap()||!hasLongTap())}function startMultiFingerRelease(a){previousTouchEndTime=getTimeStamp(),fingerCountAtRelease=a.touches.length+1}function cancelMultiFingerRelease(){previousTouchEndTime=0,fingerCountAtRelease=0}function inMultiFingerRelease(){var a=!1;if(previousTouchEndTime){var b=getTimeStamp()-previousTouchEndTime;b<=h.fingerReleaseThreshold&&(a=!0)}return a}function getTouchInProgress(){return!($element.data(PLUGIN_NS+"_intouch")!==!0)}function setTouchInProgress(a){$element&&(a===!0?($element.bind(MOVE_EV,touchMove),$element.bind(END_EV,touchEnd),LEAVE_EV&&$element.bind(LEAVE_EV,touchLeave)):($element.unbind(MOVE_EV,touchMove,!1),$element.unbind(END_EV,touchEnd,!1),LEAVE_EV&&$element.unbind(LEAVE_EV,touchLeave,!1)),$element.data(PLUGIN_NS+"_intouch",a===!0))}function createFingerData(a,b){var f={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};return f.start.x=f.last.x=f.end.x=b.pageX||b.clientX,f.start.y=f.last.y=f.end.y=b.pageY||b.clientY,fingerData[a]=f,f}function updateFingerData(a){var b=void 0!==a.identifier?a.identifier:0,f=getFingerData(b);return null===f&&(f=createFingerData(b,a)),f.last.x=f.end.x,f.last.y=f.end.y,f.end.x=a.pageX||a.clientX,f.end.y=a.pageY||a.clientY,f}function getFingerData(a){return fingerData[a]||null}function setMaxDistance(a,b){a!=NONE&&(b=Math.max(b,getMaxDistance(a)),maximumsMap[a].distance=b)}function getMaxDistance(a){if(maximumsMap[a])return maximumsMap[a].distance}function createMaximumsData(){var a={};return a[LEFT]=createMaximumVO(LEFT),a[RIGHT]=createMaximumVO(RIGHT),a[UP]=createMaximumVO(UP),a[DOWN]=createMaximumVO(DOWN),a}function createMaximumVO(a){return{direction:a,distance:0}}function calculateDuration(){return endTime-startTime}function calculateTouchesDistance(a,b){var c=Math.abs(a.x-b.x),diffY=Math.abs(a.y-b.y);return Math.round(Math.sqrt(c*c+diffY*diffY))}function calculatePinchZoom(a,b){var c=b/a*1;return c.toFixed(2)}function calculatePinchDirection(){return pinchZoom<1?OUT:IN}function calculateDistance(a,b){return Math.round(Math.sqrt(Math.pow(b.x-a.x,2)+Math.pow(b.y-a.y,2)))}function calculateAngle(a,b){var x=a.x-b.x,y=b.y-a.y,r=Math.atan2(y,x),angle=Math.round(180*r/Math.PI);return angle<0&&(angle=360-Math.abs(angle)),angle}function calculateDirection(a,b){if(comparePoints(a,b))return NONE;var c=calculateAngle(a,b);return c<=45&&c>=0?LEFT:c<=360&&c>=315?LEFT:c>=135&&c<=225?RIGHT:c>45&&c<135?DOWN:UP}function getTimeStamp(){var a=new Date;return a.getTime()}function getbounds(a){a=$(a);var b=a.offset(),bounds={left:b.left,right:b.left+a.outerWidth(),top:b.top,bottom:b.top+a.outerHeight()};return bounds}function isInBounds(a,b){return a.x>b.left&&a.x<b.right&&a.y>b.top&&a.y<b.bottom}function comparePoints(a,b){return a.x==b.x&&a.y==b.y}var h=$.extend({},h),useTouchEvents=SUPPORTS_TOUCH||SUPPORTS_POINTER||!h.fallbackToMouseEvents,START_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerDown":"pointerdown":"touchstart":"mousedown",MOVE_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerMove":"pointermove":"touchmove":"mousemove",END_EV=useTouchEvents?SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerUp":"pointerup":"touchend":"mouseup",LEAVE_EV=useTouchEvents?SUPPORTS_POINTER?"mouseleave":null:"mouseleave",CANCEL_EV=SUPPORTS_POINTER?SUPPORTS_POINTER_IE10?"MSPointerCancel":"pointercancel":"touchcancel",distance=0,direction=null,currentDirection=null,duration=0,startTouchesDistance=0,endTouchesDistance=0,pinchZoom=1,pinchDistance=0,pinchDirection=0,maximumsMap=null,$element=$(g),phase="start",fingerCount=0,fingerData={},startTime=0,endTime=0,previousTouchEndTime=0,fingerCountAtRelease=0,doubleTapStartTime=0,singleTapTimeout=null,holdTimeout=null;try{$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel)}catch(e){$.error("events not supported "+START_EV+","+CANCEL_EV+" on jQuery.swipe")}this.enable=function(){return this.disable(),$element.bind(START_EV,touchStart),$element.bind(CANCEL_EV,touchCancel),$element},this.disable=function(){return removeListeners(),$element},this.destroy=function(){removeListeners(),$element.data(PLUGIN_NS,null),$element=null},this.option=function(a,b){if("object"==typeof a)h=$.extend(h,a);else if(void 0!==h[a]){if(void 0===b)return h[a];h[a]=b}else{if(!a)return h;$.error("Option "+a+" does not exist on jQuery.swipe.options")}return null}}var i="1.6.18",LEFT="left",RIGHT="right",UP="up",DOWN="down",IN="in",OUT="out",NONE="none",AUTO="auto",SWIPE="swipe",PINCH="pinch",TAP="tap",DOUBLE_TAP="doubletap",LONG_TAP="longtap",HORIZONTAL="horizontal",VERTICAL="vertical",ALL_FINGERS="all",DOUBLE_TAP_THRESHOLD=10,PHASE_START="start",PHASE_MOVE="move",PHASE_END="end",PHASE_CANCEL="cancel",SUPPORTS_TOUCH="ontouchstart"in window,SUPPORTS_POINTER_IE10=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!SUPPORTS_TOUCH,SUPPORTS_POINTER=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!SUPPORTS_TOUCH,PLUGIN_NS="TouchSwipe",defaults={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:!0,triggerOnTouchLeave:!1,allowPageScroll:"auto",fallbackToMouseEvents:!0,excludedElements:".noSwipe",preventDefaultEvents:!0};$.fn.swipe=function(a){var b=$(this),plugin=b.data(PLUGIN_NS);if(plugin&&"string"==typeof a){if(plugin[a])return plugin[a].apply(plugin,Array.prototype.slice.call(arguments,1));$.error("Method "+a+" does not exist on jQuery.swipe")}else if(plugin&&"object"==typeof a)plugin.option.apply(plugin,arguments);else if(!(plugin||"object"!=typeof a&&a))return init.apply(this,arguments);return b},$.fn.swipe.version=i,$.fn.swipe.defaults=defaults,$.fn.swipe.phases={PHASE_START:PHASE_START,PHASE_MOVE:PHASE_MOVE,PHASE_END:PHASE_END,PHASE_CANCEL:PHASE_CANCEL},$.fn.swipe.directions={LEFT:LEFT,RIGHT:RIGHT,UP:UP,DOWN:DOWN,IN:IN,OUT:OUT},$.fn.swipe.pageScroll={NONE:NONE,HORIZONTAL:HORIZONTAL,VERTICAL:VERTICAL,AUTO:AUTO},$.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:ALL_FINGERS}});