;(function(){
	
	var Utils = function(){};
	
	//根据url参数名称获取参数的值
    Utils.prototype.getUrlParam = function(name){
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    	var r = window.location.search.substr(1).match(reg);
    	if (r != null) return decodeURI(r[2]); 
    	return null;
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
				window.requestAnimationFrame(smoothscroll);  
				window.scrollTo (0, currentScroll - (currentScroll/5));  
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
    
    //检测浏览器，如果是ie7、ie6 显示提示升级浏览器信息
    Utils.prototype.updateIE = function(){
    	var browser = navigator.appName;
        if(browser == "Microsoft Internet Explorer"){
            var b_version = navigator.appVersion;
            var version = b_version.split(";");
            var trim_Version = version[1].replace(/[ ]/g,"");
            if( trim_Version == "MSIE7.0" || trim_Version == "MSIE6.0"){
                window.location.href = "../../system/ie.html";
            }
        }
    }
    
    //是否是PC端
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
    	
    	//按钮防重复提交
		if(param.el){
			if(param.el.hasClass("loadingBtn")) return;
			param.el.addClass("loadingBtn");
		}
		
		let _url = param.url;
		let _data = param.data || {};
		let _type = !!param.type ? param.type : "post";
		let _async = (typeof param.async) != 'undefined' ? param.async : true;
		let _contentType = !!param.contentType ? param.contentType : "application/x-www-form-urlencoded";
		$.ajax({
			url: _url,
			data: _data,
			type: _type,
			dataType: "json",
			cache: false,
			async: _async,
			contentType: _contentType,
			beforeSend: function(request){
				param.beforeSend && param.beforeSend(request);
			},
			success: function(data){
				if(typeof param.success == "function"){
					param.success(data);
				}
			},
			error: function(res){
				if(typeof param.error == "function"){
					param.error(res);
				}
			},
			complete: function() {
				param.complete && param.complete();
				
				//按钮防重复提交
				if(param.el){
					setTimeout(function(){
						param.el.removeClass("loadingBtn");
					}, 1500);
				}
				
			}
		});
	}
    
    //获取随机颜色
    Utils.prototype.getRandomColor = function(){
    	return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
    }
    
    //过滤表情
    Utils.prototype.filteremoji = function(content){
    	var ranges = [  
			'\ud83c[\udf00-\udfff]',  
			'\ud83d[\udc00-\ude4f]',  
			'\ud83d[\ude80-\udeff]'  
		];  
		var emojireg = content.replace(new RegExp(ranges.join('|'), 'g'), '');  
		return emojireg;  
    }
    
    //计算字节
    Utils.prototype.countByte =  function(s){
    	var len = 0;  
		for (var i=0; i<s.length; i++) {   
			var c = s.charCodeAt(i);   
			//单字节加1   
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
				len++;   
			} else {   
				len += 2;   
			}   
		} 
		return len;
    }
    
    //验证url
    Utils.prototype.isUrl = function(str){
    	return /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str);
    }
    
    //加载js
    Utils.prototype.loadScript = function(url, callback){
    	var script = document.createElement("script")
		script.type = "text/javascript";
		if (script.readyState) {
			script.onreadystatechange = function(){
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			}
		} else {
			script.onload = function(){
				callback();
			}
		}
		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
    }
    
    //过滤XSS攻击
    Utils.prototype.escape = function(str){
    	return String(str).replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
    }
    
    //设置cookie
    Utils.prototype.setCookie = function(key, value, exp){
    	var date = new Date();
		date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
		document.cookie = key + "=" + value + expires + "; path=/";
    }
    
    //获取cookie
    Utils.prototype.getCookie = function(key){
    	let nameEQ = key + "=";
		let ca = document.cookie.split(';');
		for (let i = 0, max = ca.length; i < max; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return null;
    }
    
    //去掉2边空格
    Utils.prototype.trim = function(str){
    	str = typeof str === 'string' ? str : '';
		return str.trim
			? str.trim()
			: str.replace(/^\s|\s$/g, '');
    }
    
    //pc端提示
    /*Utils.prototype.alert = function(alertClass, message){
    	var alertWrap = $("#alertWrap");
		if(alertWrap.length == 0){
			$(document.body).append('<div id="alertWrap"></div>');
		}
		var $html = $('<div class="alert alert-' + alertClass + '"><i class="alert-icon-close"></i><div><strong>提示</strong><p>' + message + '</p></div></div>');
		$("#alertWrap").html($html);
		$($html).find(".alert-icon-close").one("click", function(){
			$($html).remove();
		});
		setTimeout(function(){
			$html.queue(function(){
				$($html).addClass('show').dequeue();
			}).delay(3600).queue(function(){
				$($html).removeClass('show').dequeue();
			}).delay(500).queue(function(){
				$($html).remove();
			})
		}, 100);
    }*/
    
    //是否是微信客户端
    Utils.prototype.isWx = function(){
    	var ua = navigator.userAgent.toLowerCase(); 
        if(ua.match(/MicroMessenger/i) == "micromessenger") { 
            return true; 
         } else { 
            return false; 
        }
    }
    
    //对象OBJECT操作
    Utils.prototype.extend = function(obj){
    	var length = arguments.length;
    	if (length < 2 || obj == null) return obj;
    	for (var index = 1; index < length; index++) {
    		var source = arguments[index],
    		keys = this.allKeys(source),
    		l = keys.length;
    		for (var i = 0; i < l; i++) {
    			var key = keys[i];
    			//if (!1 || obj[key] === void 0) obj[key] = source[key];
    			if (!0 || obj[key] === void 0) obj[key] = source[key];
    		}
    	}
  	    return obj;
    }
    
    Utils.prototype.isObject = function(obj){
    	var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    }
    
    Utils.prototype.allKeys = function(obj){
    	if (!this.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        //if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
    }
    
    window.utils = new Utils();
    //module.exports = new Utils();
	
}());


/*
-------------------------------------------------------
日期格式化
示例
alert(new Date().format("yyyy年MM月dd日"));
alert(new Date().format("MM/dd/yyyy"));
alert(new Date().format("yyyyMMdd"));
alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
--------------------------------------------------------
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
*/
/*
-------------------------------------------------------
base64加密解密
-------------------------------------------------------
var _base64 = function(){

    var self = this;

    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = self._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = self._utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    this._utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    this._utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};
//base64加密
function encrypt(str){
	var base64 = new _base64();
    var encrypt = base64.encode(str);
    return encrypt;
}
//base64解密
function decrypt(str){
	var base64 = new _base64();
    var decrypt = base64.decode(str);
    decrypt = escape(decrypt);
    decrypt = decrypt.replace(/%00/g, '');
    decrypt = unescape(decrypt);
    return decrypt;
}
*/
    	
/*
-------------------------------------------------------
解决不支持Object.create
-------------------------------------------------------
if (!Object.create) {
    Object.create = function(o, properties) {
        if (typeof o !== 'object' && typeof o !== 'function') throw new TypeError('Object prototype may only be an Object: ' + o);
    else if (o === null) throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");

    if (typeof properties != 'undefined') throw new Error("This browser's implementation of Object.create is a shim and doesn't support a second argument.");

        function F() {}

        F.prototype = o;

        return new F();
    };
}

(function() {
	var testObject = {};
	if (!(Object.setPrototypeOf || testObject.__proto__)) {
		var nativeGetPrototypeOf = Object.getPrototypeOf;

		Object.getPrototypeOf = function(object) {
			if (object.__proto__) {
				return object.__proto__;
			} else {
				return nativeGetPrototypeOf.call(Object, object);
			}
		}
	}
})();
*/
    	

