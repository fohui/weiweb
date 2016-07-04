var $ = (function(){

	//节点相关
	var getElement = function(id){
		return document.getElementById(id);
	};



	//事件相关

	/*--------------------------------------------------
	 *事件绑定函数
	 *@param ele {object | node} 元素节点或对象
	 *@param type {string} 事件类型
	 *@param handler {function} 事件处理程序
	 *--------------------------------------------------
	 */
	var addEvent = function(ele, type, handler){
		if (ele.addEventListener) {
			ele.addEventListener(type, handler, false);
		} else if (ele.attachEvent) {
			ele.attachEvent('on' + type, handler);
		} else {
			ele['on' + type] = handler;
		}
	};

	/*------------------------------------------------------
     *获得事件对象
     *@param event(object)  自动传入的事件对象
     *@return event(object) 事件对象
     *------------------------------------------------------
	 */
	var getEvent = function(event){
		return event ? event : window.event;
	};

	/*------------------------------------------------------
     *获得事件目标
     *@param event(object) 事件对象
     *@return target(object) 事件目标
     *------------------------------------------------------
	 */
	var getTarget = function(event){
		return event.target || event.srcElement;
	};

	/*------------------------------------------------------
     *阻止默认行为
     *@param event(object) 事件对象
     *------------------------------------------------------
	 */
	var preventDefault = function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	};
	//---------------------------------- event end --------------------------------------------------------------




	//动画相关
	var moveAnimate =function(ele, attr, from, to, time, callback){
		var distance = Math.abs(to - from);
		var time = time || 1000;
		var trigger = 10; //间隔时间
		var stepLength = distance/time*trigger;
		var symbol = (to - from)/distance;
		var offset = 0;
		var step = function(){
			var tmpOffset = offset + stepLength;
			if (tmpOffset < distance) {
				ele.style[attr] = from + tmpOffset*symbol + 'px';
				offset = tmpOffset;
			} else {
				ele.style[attr] = to + 'px';
				clearInterval(intervalId);
				if(callback) callback();
			}
		};
		ele.style[attr] = from + 'px';
		var intervalId = setInterval(step, trigger);
	};

	var fadeAnimate =function(ele, from, to, time){
		var distance = Math.abs(to - from);
		var time = time || 500;
		var trigger = 10; //间隔时间
		var stepLength = distance/time*trigger;
		var symbol = (to - from)/distance;
		var offset = 0;
		var alpha ;
		var step = function(){
			var tmpOffset = offset + stepLength;
			if (tmpOffset < distance) {
				alpha = from + tmpOffset*symbol;
				ele.style.opacity = alpha;
				var opacity = alpha*100;
				ele.style.filter = 'alpha(opacity:' + opacity + ')';
				offset = tmpOffset;
			} else {
				ele.style.opacity = to;
				var opacity = to*100;
				ele.style.filter = 'alpha(opacity:' + opacity + ')';
				clearInterval(intervalId);
			}
		};
		ele.style.opacity = from;
		var opacity = from*100;
		ele.style.filter = 'alpha(opacity:' + opacity + ')';
		var intervalId = setInterval(step, trigger);
	};
	//操作cookie

	/*-------------------------------------------
 	 *获取cookie
 	 *@return cookie {object} 
 	 *可以通过cookie[name]获得对应的value值
 	 *--------------------------------------------
	 */
	var getCookie = function(){
		var cookie = {};
		var all = document.cookie;
		if(!all) return cookie;
		var arr = all.split('; ');
		for(var i = 0, l = arr.length; i < l; i++){
			var item = arr[i];
			var p = item.indexOf('=');
			var name = item.slice(0, p);
			name = decodeURIComponent(name);
			var value = item.slice(p + 1);
			value = decodeURIComponent(value);
			cookie[name] = value;
		}
		return cookie;
	};
	
	/*-----------------------------------------------
	 *设置cookie
	 *
	 *-----------------------------------------------
	 */
	var setCookie = function(name, value, expires, path, domain, secure){
		var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
		if(expires instanceof Date) {
			cookie += '; expires=' + expires.toGMTString();
		}
		if(path){
			cookie += '; path=' + path;
		}
		if(domain){
			cookie += '; domain=' + domain;
		}
		if(secure){
			cookie += '; secure';
		}
		document.cookie = cookie;
	};

	//打开新窗口
	var openWin = function(url){
		window.open(url);
	};

	//ajax
	var get = function(url,options,callback){
	    var createXHR=function(url){
	        var xhr = new XMLHttpRequest();
	        if('withCredentials' in xhr){
	        	xhr.open('GET', url, true);
	        }else if(typeof XDomainRequest != 'undefined'){
	        	var xhr = new XDomainRequest();
	        	xhr.open('GET', url);
	        }else{
	        	xhr = null;
	        }
	        return xhr;
	    };

	    var serialize=function(data){
	        if(!data) return '';
	        var pairs = [];
	        for(var name in data){
	            if(!data.hasOwnProperty(name)) continue;
	            if(typeof data[name] === 'function') continue;
	            var value=data[name].toString();
	            name = encodeURIComponent(name);
	            value = encodeURIComponent(value);
	            pairs.push(name +'='+ value);
	        }
	        return pairs.join('&');
	    };
	    var requestURL = url + '?' +serialize(options);
	    var xhr=createXHR(requestURL);
	   	if(xhr){
	   		xhr.onload=function(){ //如果传入参数，该参数是事件对象？
	             if(callback) 
	             	callback(xhr.responseText);       
	    	};
	     xhr.send(null);
	   	}

	   
    };

    var getPage = function(totalPage, size, pageNow){
	    var prevIndex,  startIndex, lastIndex, nextIndex;
		var pageGroup = Math.ceil(totalPage/size);
		for(var i = 1; i < pageGroup; i++){
			if(pageNow <= i*size){
				startIndex = (i - 1)*size + 1;
				break;
			}
		}
	    lastIndex = startIndex + size - 1;
	    lastIndex = (lastIndex > totalPage) ? totalPage : lastIndex;

	    if(startIndex === 1){
	    	prevIndex = 0;
	    }else{
			prevIndex = startIndex - 1;
	    }

	    if(lastIndex === totalPage){
	    	nextIndex = 0;
	    }else{
			nextIndex = lastIndex + 1;
	    }
	     
	   
	   	return {
	   		prevIndex : prevIndex,
	   		nextIndex : nextIndex,
    		startIndex : startIndex,
       		lastIndex : lastIndex
	    };
    };

    
	return {
		getElement     :     getElement,
		addEvent       :     addEvent,
		getEvent       :     getEvent,
		preventDefault :     preventDefault,
		getTarget      :     getTarget,
		getCookie      :     getCookie, 
		setCookie      :     setCookie,
		fadeAnimate    :     fadeAnimate,
		moveAnimate    :     moveAnimate,
		openWin        :     openWin,
		get            :     get,
		getPage        :     getPage

	};

})();