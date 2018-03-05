/*
 	日期格式化
	示例
    alert(new Date().format("yyyy年MM月dd日"));
    alert(new Date().format("MM/dd/yyyy"));
    alert(new Date().format("yyyyMMdd"));
    alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
*/
Date.prototype.format = function(format){
    var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(), //day
    "h+" : this.getHours(), //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter
    "S" : this.getMilliseconds() //millisecond
    }

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
}

;(function($){

    root = this;
    
    var Utils = function(){};

    //根据url参数名称获取参数的值
    Utils.prototype.getUrlParam = function(name,url){
        var reg = new RegExp('(^|&|#|\\?)' + name + '=([^&]*)(&|$)', 'i');
        var r = (url || root.location.search).substr(1).match(reg);
        if(r != null){
            return decodeURI(r[2]);
        }
        return "";
    }
    
    //iframe下载文件
    Utils.prototype.download = function(filepath){
        var iframe = document.getElementById("downloadframe");
        if(iframe){
            iframe.src = filepath;
        }else{
            iframe = document.createElement("iframe");
            iframe.src = filepath;
            iframe.style.display = "none";
            iframe.id = "downloadframe";
            document.body.appendChild(iframe);
        }
    }
    
    //返回顶部
    Utils.prototype.goTop = function(){
        /*(function smoothscroll(){  
            var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;  
            if(currentScroll > 0){  
                root.requestAnimationFrame(smoothscroll);  
                root.scrollTo (0, currentScroll - (currentScroll/5));  
            }  
        })();  */
        
        $("html, body").stop().animate({
            scrollTop: 0
        }, 300);
         
    }
    
    //请求模板
    Utils.prototype.template = function(url, callback){
        var template = null;
        $.ajax({
            url: url,
            async: false,
            success: function(data){
                template = data;
                callback && callback(data);
            },
            error: function(data){
                alert("系统繁忙,请稍后！");
            }
        });
        return template;
    }
    
    //获取IE版本
    Utils.prototype.getIEVersion = function(){
        var ua = navigator.userAgent, matches, tridentMap = {'4': 8, '5': 9, '6': 10, '7': 11};
        matches = ua.match(/MSIE (\d+)/i);
        if(matches && matches[1]){
            return +matches[1];
        }
        matches = ua.match(/Trident\/(\d+)/i);
        if(matches && matches[1]){
            return tridentMap[matches[1]] || null;
        }
        return null;
    }
    
    Utils.prototype.isPc = function(){  
        var userAgentInfo = navigator.userAgent;  
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = true;  
        for (var v = 0; v < Agents.length; v++) {  
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
        }  
        return flag;  
    }
    
    //封装ajax
    Utils.prototype.ajax = function(param){
        var _url = param.url;
        var _data = !!param.data ? param.data : {};
        var _type = !!param.type?param.type:"post";
        var _async = (typeof param.async)!='undefined'?param.async:true;
        var _contentType = !!param.contentType?param.contentType:"application/x-www-form-urlencoded";
        $.ajax({
            url: _url,
            data: _data,
            type: _type,
            dataType: "json",
            cache: false,
            async: _async,
            contentType: _contentType,
            beforeSend: function(request){
                //util.loading("show");
            },
            success: function(data){
                //if(data.errorCode == 0){
                    if(param.success) {
                        param.success(data);
                    }
                //}
                // }else{
                //     //alert(!!data.errorMsg ? data.errorMsg : "开小差了~");
                // }
                
            },
            error: function(res){
                var warning = $.parseJSON(res.responseText);
                //console.log(!!warning.errorMsg ? warning.errorMsg : "开小差了~");
                if(typeof param.error == "function"){
                    param.error(res);
                }
            },
            complete: function() {
                //util.loading("hide");
            }
        });
    }

    root.util = new Utils();
    
})(jQuery);

 

