/**
 * 网易前端微专业大作业
 * @author fohui
 * @date 2015.8.15-2015.8.24
 * @note 8.25 提取出util.js
 */

(function(){
    /**
     * 课程列表和热门课程排行模块
     * 
     */
    (function(){
        /**
         * 获取课程列表，作为get请求的回调函数
         * @param  {Object} get请求获得的数据
         * @return {Void}
         */
        function courseList(data,options){
            var list = $.getEleByClass('m-list-1')[0];
            var val = '';
            for (var i = 0,l = data.list.length; i < l; i++) {
                var course = data.list[i];
                val += '<li class="course">'
                        +    '<img src='+course.middlePhotoUrl+' alt='+course.name+'>'
                        +    '<div class="component">'
                        +        '<p class="f-ellipsis">'+course.name+'</p>'
                        +        '<p>'+course.provider+'</p>'
                        +        '<p class="learner f-inbl"><span class="u-icon u-icon-people"></span> '+course.learnerCount+'</p>'
                        +    '<p class="price">¥ '+course.price+'</p></div>'
                        +    '<div class="detail" style="display:none;">'
                        +        '<div class="head"><img src='+course.middlePhotoUrl+' alt='+course.name+'>'
                        +            '<div class="right f-cb">'
                        +                '<p class="f-ellipsis">'+course.name+'</p>'
                        +                '<p class="learner f-inbl"><span class="u-icon u-icon-people"></span> '+course.learnerCount+'人在学</p>'
                        +            '<p class="provider">发布者：'+course.provider+'</p>'
                        +        '<p class="category">分类：'+course.categoryName+'</p></div></div>'
                        +        '<div class="body"><p class="description">'+course.description+'</p></div>'
                        +    '</div></li>'
            };
            list.innerHTML = val;
            //课程详情卡片的展示
            coursehover();

            var paging = $.getEleByClass('u-paging-list')[0];
            var pagingval ="";
            pagingval = makePaging(data.pagination.totlePageCount,data.pagination.pageIndex,options); 
            pagingval = '<span class="pagingNav"> < </span>'+ pagingval + '<span class="pagingNav" style="font-weight:blod;"> > </span>'
            paging.innerHTML = pagingval;
        }
        /**
         * 获取热门课程列表，作为get请求的回调函数
         * @param  {Object} get请求获得的数据
         * @return {Void}
         */
        function hotList(data){
            var list = $.getEleByClass('m-list-2')[0];
            var val = '';
            for (var i = 0,l = data.length; i < l; i++) {
                var hotcourse = data[i];
                val += '<li class="hotcourse">'
                        +    '<img src='+hotcourse.smallPhotoUrl+' alt='+hotcourse.name+'>'
                        +    '<div class="component">'
                        +    '<p class="f-ellipsis">'+hotcourse.name+'</p>'
                        +    '<p class="learner"><span class="u-icon u-icon-people"></span> '+hotcourse.learnerCount+'</p></div></li>'
            };
            list.innerHTML = val;
            //为热门课程列表无缝滚动
            clone.innerHTML = val;
        }
         /**
         * 分页列表的构建
         * @param  {Number} 总页数
         * @param  {Number} 当前页码，从1开始
         * @param  {Object} get请求课程列表时的参数，为了获取type属性
         * @return {Void}  返回一个组装好的分页器HTML字符串
         */
        function makePaging(totalPages, pageIndex,options) {
            // pageIndex是从1开始的
            var oPaging, i, j, k, oBefore, oAfter;
            var totalPages = parseInt(totalPages); 
            console.log(pageIndex);
            i = pageIndex;
            j = pageIndex - 1; //上一页
            k = pageIndex + 1; //下一页
            oBefore = ""; 
            oAfter = ""; 
           
            while (j != 0 && j != i - 4){ // 最多循环3次
                oBefore = '<a data-type="'+options.type+'">' + j + '</a>' + oBefore;
                j--;
            }
            for (; k < totalPages + 1 && k < i + 3; k++){ //最多循环2次
                oAfter += '<a data-type="'+options.type+'">' + k + '</a>';
            }

            oPaging = oBefore + '<a data-type="'+options.type+'" style="color:#fff;background-color:#99cc99">' + i.toString() + '</a>'+ oAfter
            if(i == 5) oPaging = '<a data-type="'+options.type+'">1</a>' + oPaging;
            if(i > 5) oPaging = '<a data-type="'+options.type+'">1</a><a>...</a>'+oPaging;
            if(i + 3 < totalPages) oPaging = oPaging + '<a>...</a><a data-type="'+options.type+'">' + totalPages + '</a>';
            if(i + 3 == totalPages) oPaging = oPaging + '<a data-type="'+options.type+'">' + totalPages + '</a>';

            return oPaging;
        }


        //课程详情卡片的展示
        function coursehover(){
            var courses = $.getEleByClass("course");
            for(var i=0,l=courses.length; i<l; i++){
                courses[i].onmouseenter = function(e){
                    var courseDetail = this.getElementsByClassName("detail")[0];
                    courseDetail.style.display = "block";
                }
                courses[i].onmouseleave = function(e){
                    var courseDetail = this.getElementsByClassName("detail")[0];
                    courseDetail.style.display = "none";
                }
            }
        }
        //产品设计和编程语言的切换
        var btnprogram = $.getEleByClass("js-btnprogramlist")[0];
        var btnproduct = $.getEleByClass("js-btnproductlist")[0];
        //分页器切换数据
        var btnpaging = $.getEleByClass("js-btnpaging")[0]; //事件代理元素
        btnproduct.onclick = function(){
            $.addClassName(btnproduct,"z-crt-tab");
            $.removeClassName(btnprogram,"z-crt-tab");
            $.ajaxGet("http://study.163.com/webDev/couresByCategory.htm",courseList,{pageNo:1,psize: 15,type:10});
        };
        btnprogram.onclick = function(){
            $.addClassName(btnprogram,"z-crt-tab");
            $.removeClassName(btnproduct,"z-crt-tab");
            $.ajaxGet("http://study.163.com/webDev/couresByCategory.htm",courseList,{pageNo:1,psize: 15,type:20});
        };
        btnpaging.onclick = function(e){
            if(e.target.tagName === "A"){
                var listtype = $.getDataSet(e.target)["type"];
                $.ajaxGet("http://study.163.com/webDev/couresByCategory.htm",
                    courseList,
                    {
                        pageNo:parseInt(e.target.innerText),
                        psize: 15,
                        type:listtype
                    });
            }
        }
        
        //课程列表和热门课程排行模块 初始化
        btnproduct.click();
        $.ajaxGet("http://study.163.com/webDev/hotcouresByCategory.htm",hotList);


        //热门课程排行节点获取
        var container = $.getEleByClass("listcontainer")[0];
        var hotlistbox = $.getEleByClass("m-list-2")[0];
        var clone = $.getEleByClass("listclone")[0];  
        var hotlistTimer;
        clone.innerHTML = hotlistbox.innerHTML;
        function rolling(){
            if(container.scrollTop == clone.offsetTop){
                container.scrollTop = '0';
            }else {
                container.scrollTop += 72;
            }
        }
        hotlistTimer = setInterval(rolling,5000);
        
    })(); //END 课程列表和热门课程排行模块



    /**
     * 轮播图模块
     * 
     */
    (function(){
        /**
         * 轮播图-淡入动画效果
         * @param  {element} 元素节点
         * @param  {callback} 回调函数，淡入效果完成后执行的函数
         * @return {Void}
         */
        function fadeIn(element,callback) {
            //-----优化！ 要判断ele是一个元素节点？？
            var stepLength = 1/50;
            if (!parseFloat(element.style.opacity)) {
                element.style.opacity = 0;
            }
            function step(){
                if (parseFloat(element.style.opacity)+stepLength < 1) {
                    element.style.opacity = parseFloat(element.style.opacity)+stepLength;
                } else {
                    element.style.opacity = 1;
                    clearInterval(setIntervalId);
                    if(typeof callback == 'function') {
                        callback(data,options); 
                    }
                }
            }
            var setIntervalId = setInterval(step, 20);
        };
        /**
         * 获取某个类名在节点列表中的索引值
         * @param  {NodeList} 节点列表
         * @param  {ClassName} 需要搜寻类名
         * @return {Void} 需要搜寻类名
         */
        function getCurrentIndex(nodeList,className){
            for(var i=0,l=nodeList.length;i<l;i++){
                if($.hasClassName(nodeList[i],className)){
                    return i;
                }
            }
        }

        //给下一张图片进行淡入淡出的配置
        function dofadeIn(){
            var current,next;
            current = getCurrentIndex(indicatorlist,"current"); //指示器当是所在节点的索引值
            next = current==photolist.length-1 ? 0 : current+1;
            //next淡入前的一些样式设置
            photolist[next].style.opacity = 0;
            photolist[current].style.zIndex = 0;
            photolist[next].style.zIndex = 1;
            //指示器的样式调整
            $.removeClassName(indicatorlist[current],"current");
            $.addClassName(indicatorlist[next],"current");
            //next淡入
            fadeIn(photolist[next]);
        }


        //轮播图节点获取
        var indicatorlist = $.getEleByClass("indicatorlist")[0].children; //指示器的节点列表
        var photolistParent= $.getEleByClass("photolistParent")[0]; //照片节点列表的父节点
        var photolist = photolistParent.children;
        var carouselTimer;
        

        //轮播初始化
        $.addClassName(indicatorlist[0],"current");
        photolist[0].style.opacity = 1;
        photolist[0].style.zIndex = 1;
        carouselTimer = setInterval(dofadeIn,3000);
        //鼠标悬停，轮播停止
        photolistParent.onmouseover = function(e){
            if(e.target.tagName === "IMG"){
                clearInterval(carouselTimer);
            }
        }
        photolistParent.onmouseout = function(e){
            if(e.target.tagName === "IMG"){
                carouselTimer = setInterval(dofadeIn,3000);
            }
        }
    })(); //END 轮播图模块


    //globalDom
    var globalDom = {};
    globalDom.layers= $.getEleByClass("u-toplayer"); //关注登录模块也需要操作这个节点

    /**
     * 弹出层模块
     * 
     */
    (function(){
        //视频播放图层
        var movielayer = $.getEleByClass("m-movie")[0];
        var btnmovie = $.getEleByClass("js-movie")[0];
        btnmovie.onclick = function(){
            globalDom.layers[1].style.display = "block";
        }
        //两个弹出图层的关闭
        var btnlayerclose = $.getEleByClass("u-icon-close");
        var layerhelper = function(i){
            return function(e){
                e.preventDefault();
                globalDom.layers[i].style.display = "none";
            }
        }
        for(var i=0,l=btnlayerclose.length;i<l;i++){
            //对每个关闭按钮设置事件
            btnlayerclose[i].onclick = layerhelper(i);
        }
    })(); //END 弹出层模块


    /**
     * 登入模块、cookie相关
     * 
     */
    (function(){
        //改变 关注/登录 按钮的click事件处理函数
        function changeHander(){
            if(!!document.cookie && $.getCookie('loginSuc') == 1){
                btnloginAndfollow.onclick = function(e){ //如果已经登入
                    $.ajaxGet("http://study.163.com/webDev/attention.htm",function(data){ 
                        loginAndfollow.innerHTML = hasFollowValue;
                        $.setCookie('followSuc',data);
                        loginAndfollow.getElementsByClassName("wrap")[0].style.border = "1px solid #efefef";
                    });
                }
            } else { //如果没有登入
                btnloginAndfollow.onclick = function(e){
                    globalDom.layers[0].style.display = "block";
                };
            }
        }


        //有cookie-notips后，不再显示
        var toptips = $.getEleByClass("u-toptips")[0];
        var btnnotips = $.getEleByClass("js-notips")[0];
        if(!!document.cookie && $.getCookie("notips") == 1) {
            toptips.style.display = "none";
        }else {
            btnnotips.onclick= function(){
                $.setCookie("notips","1");
                toptips.style.display = "none";
            }
        }
        //有cookie-loginSuc、cookie-followSuc后，改变关注部分的样式
        var btnloginAndfollow = $.getEleByClass("js-btnloginAndfollow")[0]; //关注按钮
        var loginAndfollow = $.getEleByClass("loginAndfollow")[0]; //关注部分
        var hasFollowValue = '<span class="wrap"><span class="follow">√ 已关注 </span><a class="js-donofollow">取消</a></span>';
        if(!!document.cookie && $.getCookie("loginSuc") == 1 && $.getCookie("followSuc") == 1){
            loginAndfollow.innerHTML = hasFollowValue;
        }else {
            changeHander();
        }


        //表单部分
        var webform = $.getEleByClass("js-webform")[0];
        var msg = $.getEleByClass("loginMessage")[0];
        //表单提交
        function loginCallback(data){
            if(!!data){
                msg.innerText = '登入成功';
                msg.style.color = '#39a030';
                $.setCookie('loginSuc','1');
                changeHander();  //改变 关注/登录 按钮的click事件处理函数

                //清空表单，并关闭弹出层
                webform.username.value = '';
                webform.password.value = '';
                setTimeout(function(){
                    globalDom.layers[0].style.display = 'none';
                },1000);
            }else {
                msg.innerText = '登入失败';
                msg.style.color = '#ff3f00';
            }
        }
        webform.onsubmit = function(e){
            var username = md5(webform.username.value);
            var password = md5(webform.password.value);
            e.preventDefault();
            //表单验证是否为空
            if(webform.username.value == '' || webform.password.value == ''){
                msg.innerText = '帐号密码均不能为空';
                msg.style.color = '#ff3f00';
                return;
            }
            // 表单提交 studyOnline，study.163.com
            $.ajaxGet("http://study.163.com/webDev/login.htm",
                loginCallback,
                {'userName':username,'password':password});
            
        };
    })();//END 登入模块、cookie相关

})(); //END