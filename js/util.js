var $ = (function(){
	/**
     * haslassName-判断类名字符串是否在元素原有类名中
     * @param  {element} 元素节点
     * @param  {string} 类名字符串，支持有空格隔开的多个类名字符串
     * @return {Boolean}
     */
    function hasClassName(element,names){
        var classNameStr,flag;
        classNameStr = element.className + " ";
        flag = true;
        names = names.split(" ");
        for (var j = 0, name; name = names[j]; j++) {
            //没有包含其中
            if(classNameStr.indexOf(name + " ") == -1){
                flag = false;
                break;
            }
        };
        return flag;
    }
    /**
     * getElementsByClassName的兼容性方法
     * @param  {element} 元素节点
     * @param  {string} 类名字符串，支持有空格隔开的多个类名字符串
     * @return {Array}
     */
    function getElementsByClassName(element,names){
        if(element.getElementsByClassName){
            return element.getElementsByClassName(names);
        }else{
            var elements = element.getElementsByTagName("*");
            var result = [];
            for (var i = 0,element;element = elements[i]; i++) {
                if(hasClassName(element,names)){
                    result.push(element);
                }
            };
            return result;
        }
    }
    //document.getElementsByClassName的省略用法
    var getEleByClass = function(elementClassName){
        return getElementsByClassName(document,elementClassName);
    }
    /**
     * Element.dataset 的兼容性方法
     * 考虑了data-wo-shi-shui类似的情况
     * @param  {element} 元素节点
     * @return {Array} 返回名值对数组
     */
    function getDataSet(element){
        if(element.dataset) return element.dataset;
        var attrs = element.attributes;
        var data = {};
        var nodeName,nodeNames;
        for(var i = 0,attr;attr = attrs[i];i++){
            nodeName = attr.nodeName;
            if(nodeName.indexOf('data-')!==-1){
                nodeNames = nodeName.slice(5).split('-');
                nodeName = nodeNames[0];
                for(var j = 1,name;name = nodeNames[j];j++){
                    nodeName += nodeNames[j].slice(0,1).toUpperCase()+nodeNames[j].slice(1);
                }
                data[nodeName] = attr.nodeValue;
            }
        }
        return data;
    }
    /**
     * 对get请求的参数进行序列号
     * @param  {Object} 配置信息
     * @return {Void}
     */
    function serialize(data) {
        if(!data) return " ";
        var items = [];
        for (var name in data) {
            if(!data.hasOwnProperty(name)) continue;
            if(typeof data[name] === "function") continue;
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            items.push(name + "=" + value);
        };
        return items.join("&");
    }

    /**
     * GET封装
     * @param  {url} 请求地址
     * @param  {callback} 成功返回data后执行的回调参数     
     * @param  {Object} get请求的参数配置
     * @return {Void}
     */
    function ajaxGet(url,callback,options) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
                    /*将responseText作为参数传入callback函数*/
                    var data = JSON.parse(xhr.responseText);
                    //将options也传过去，为了分页器能区分产品设计和编程语言
                    if(typeof callback == 'function') {
                        callback(data,options); 
                    }
                } else {
                    alert("请求失败:-( \n 状态码："+ xhr.status);
                }
            }
        }
        xhr.open("get",url + "?" + serialize(options),true);
        xhr.send(null);
    }
    /**
     * addClassName-给元素添加类名
     * @param  {element} 元素节点
     * @param  {string} 类名字符串，支持有空格隔开的多个类名字符串
     * @return {void}
     */
     function addClassName(element,names){
        if(!element.className) element.className=" ";
        var originClass = element.className.split(" ");
        //获取新增的class
        var addClass = names.split(" ");
        var newClass = originClass;
        if(!addClass.length) return;
        for (var i =0, l =addClass.length; i < l; i++) {
            if(!hasClassName(element,addClass[i])) newClass.push(addClass[i]);
        };
        element.className = newClass.join(" ").trim();
    }
    /**
     * removeClassName-从一个元素中移除类名
     * @param  {element} 元素节点
     * @param  {string} 类名字符串，支持有空格隔开的多个类名字符串
     * @return {void}
     */
    function removeClassName(element,names){
        if(!element.className) return;
        var originClass = element.className.trim().split(" ")
        //如果originClass有多余的空格，也会单独被提取出来作为一个数据项，需要过滤掉
        originClass.forEach(function(element,index,array){
            if(array[index] == "") array.splice(index,1);
        });
        var removeClass = names.trim().split(" ");
        var newClass = originClass;
        if(!originClass.length || !removeClass.length) return;
        //
        for(var i=0,l=removeClass.length;i<l;i++){
            for(var j=0,len=originClass.length;j<len;j++){
                if(originClass[j] == removeClass[i]) newClass.splice(j,1);
            }
        }
        element.className = !newClass.length ? " ":newClass.join(" ");
    }

    /**
     * setCookie-设置cookie，获取指定cookie值，支持expires、path、domain和secure的设置
     * @param  {String} cookie名
     * @param {value} cookie值
     * @param {Object} cookie配置信息
     * @return {void}
     */
    function setCookie(name,value,options){
        //如果第二个参数存在
        if(typeof value != 'undefined'){
            options = options || {};
            //可以通过value==null，使cookie失效
            if (value === null) {
                //value不存在则即刻失效
                options.expires = -1;
            }
            var expires = "";
            if(options.expires &&(typeof options.expires == 'number' || options.expires.toTICString)){
                if(typeof options.expires == "number"){
                    date = new Date();
                    //options.expires 以天为单位
                    date.setTime(date.getTime()+(options.expires*24*60*60*1000));
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path='+options.path:'',
                domain = options.domain ? '; domain='+ options.domain:'',
                secure = options.secure? '; secure' : ''; //为true则直接设置，否为为空
           document.cookie = [name,'=',encodeURIComponent(value),expires,path,domain,secure].join('');
        }  
    }
    /**
     * getCookie-获取指定cookie名的值
     * @param  {String} cookie名
     * @return {String} cookie值
     */
    function getCookie(name){
    	var cookie = {};
        var all = document.cookie;
        if(all === '') return cookie;
        var list = all.split(';');
        //将cookie信息格式化为数据对象
        for (var i = 0; i<list.length; i++) {
            var item = list[i];
            item = item.trim().split('=');
            var itemname = decodeURIComponent(item[0]);
            var itemvalue = decodeURIComponent(item[1]);
            cookie[itemname] = itemvalue;
        };
        if(!cookie[name]) return false ;
        return cookie[name];
    }

    return {
    	getEleByClass  :  getEleByClass,
    	getDataSet     :  getDataSet,
    	hasClassName   :  hasClassName,
    	addClassName   :  addClassName,
    	removeClassName:  removeClassName,
    	setCookie      :  setCookie,
    	getCookie      :  getCookie,
    	ajaxGet        :  ajaxGet
    }
    
})(); // END $