/*1.兼容性的element.dataset*/
    function getDataSet(element){
        if(element.dataset){
            return element.dataset;
        }
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

/*2.兼容性的getElementsByClassName*/
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

    function hasClassName(element,names){
        var classNameStr,flag;
        //元素的所有类名组成的字符串
        classNameStr = element.className + " ";
        flag = true;
        //将names字符串转换为数组
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

/*3.兼容性的监测方法*/
    function match1() {
        var example = document.getElementById('example');
        var t = getElementsByClassName(example, 'aaa');
        var msg = "";
        for (var i = 0; i < t.length; i++) {
            msg +="匹配的元素id:" + t[i].id+"\n";
        }
        window.alert(msg);
    }

/*4.任意级联，老师版本*/
    function cascade(selectList,data){
        // 取第n级的数据列表，这个很多同学也已经完成了，非常好
        var getList = function(n){
            var ret = data;
            for(var i=0,it;i<n;i++){
                // 默认选中第一项
                it = Math.max(0,selectList[i].selectedIndex);
                ret = (ret[it]||{}).list;
            }
            return ret;
        };
         
        // 选择器填充，这个在课程里已经有介绍
        var fillSelector = function(select,list){
            for(var i=select.length-1;i>=0;i--){
                select.remove(i);
            }
            if (!list||!list.length){
                return;
            }
            for(var i=0,l=list.length,it;i<l;i++){
                it = list[i];
                select.add(new Option(it.text,it.value));
            }
        };
 
        // 第几级选择器变化事件
        var onSelectChange = function(i){
            // 1. 填充第i+1级选择器
            // 2. 触发第i+1级选择器的change逻辑
            var next = i+1;
            if (next>=selectList.length){
                return;
            }
            fillAndChange(next);
        };
        // 填充第几级选择器并触发该级选择器的change逻辑
        var fillAndChange = function(index){
            fillSelector(
                selectList[index],
                getList(index)
            );
            onSelectChange(index);
        };
 
        // 事件辅助函数，保存索引，这个在JS课程中已经介绍
        var helper = function(index){
            return function(){
                onSelectChange(index);
            };
        };
        for(var i=0,l=selectList.length-1;i<l;i++){
            // 这里可以实践一下前面学的闭包的知识
            // 或者针对高版本用bind，如 onSelectChange.bind(null,i)
            selectList[i].onchange = helper(i);
        }
 
        // 初始化数据
        fillAndChange(0);
    }
    function getCookies(){
        var cookieObj = {};
        var cookieStr = document.cookie;
        if (cookieStr === '' ) return cookieStr;
        var cookies = cookieStr.split('; ');
        for (var i = cookies.length - 1; i >= 0; i--) {
            var item = cookies[i].split('=');
            var name = decodeURIComponent(item[0]);
            cookieObj[name] = decodeURIComponent(item[1]);
        };
        return cookieObj;
    }

    /*ajax,get方法封装，options为Object，callback为function*/
    function get(url,options,callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(callback) {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 ) {
                    /*将responseText作为参数传入callback函数*/
                    callback(xhr.responseText);
                } else {
                    alert('请求失败:-( \n 状态码：'+ xhr.status);
                }
            }
        }
        var url_opt = options ;
        if(typeof url_opt === 'object') {
            url = url + '?' + serialize(url_opt);
        } else if(typeof url_opt === 'string'){
            url = url + '?' + options;
        } else {
            alert('只接受正确的字符串或对象类型的查询参数 :-)')
        }
        xhr.open('get',url,true);
        xhr.send(null);
    }
    function serialize(data) {
        if(!data) return '';
        var items = [];
        for (var name in data) {
            if(!data.hasOwnProperty(name)) continue;
            if(typeof data[name] === 'function') continue;
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            items.push(name + '=' + value);
        };
        return items.join('&');
    }
    