;(function(){
	
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
	
    let config = require("./config.js");
    
    let Emoji = require("./emoji.js");
    
	class Utils {
		
		constructor () {
			
			this.dom = {
				loading: '<div class="loading-container"><div><div></div></div></div>',
				datagridLoading: '<div class="datagrid-loading" style=""><div><svg viewBox="25 25 50 50" class="circular"><circle cx="50" cy="50" r="20" fill="none" class="path"></circle></svg><p class="loading-text">拼命加载中</p></div></div>',
				datagridNull: '<div class="datagrid-nodata"><p><i class="iconfont icon-cry"></i>暂无数据</p></div>',
				nullSession: '<div class="nosession"><i class="icon icon-coreNoSession"></i><p>暂无会话接入</p></div>'
			};
			
		}
		
		//根据url参数名称获取参数的值
		getUrlParam (name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r != null) {
				return decodeURI(r[2]);
			}
			return "";
		}
		
		//iframe下载文件
		download (filepath) {
			let iframe = document.getElementById("downloadframe");
			if (iframe) {
				iframe.src = filepath;
			} else {
				iframe = document.createElement("iframe");
				iframe.src = filepath;
				iframe.style.display = "none";
				iframe.id = "downloadframe";
				document.body.appendChild(iframe);
			}
		}
		
		//返回顶部
		goTop () {
			/*(function smoothscroll(){  
				let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;  
				if(currentScroll > 0){  
					window.requestAnimationFrame(smoothscroll);  
					window.scrollTo (0, currentScroll - (currentScroll/5));  
				}  
			})();  */
			$("html, body").stop().animate({
				scrollTop: 0
			}, 300);
		}
		
		//请求模板html
		template (url) {
			let template = null;
			$.ajax({
				url: url,
				async: false,
				success: function(data){
					template = data;
				},
				error: function(data){
					if (console) {
						console.log("请求模板失败！");
					}		
				}
			});
			return template;
		}
		
		//获取IE版本
		getIEVersion () {
			let ua = navigator.userAgent, matches, tridentMap = {'4': 8, '5': 9, '6': 10, '7': 11};
			matches = ua.match(/MSIE (\d+)/i);
			if (matches && matches[1]) {
				return +matches[1];
			}
			matches = ua.match(/Trident\/(\d+)/i);
			if (matches && matches[1]) {
				return tridentMap[matches[1]] || null;
			}
			return null;
		}
		
		//封装ajax
		ajax (param) {
			
			let _url = param.url;
			let _data = param.data || {};
			if(typeof _data == "object"){
				if(!!this.getCookie("companyCode")){
					_data.companyCode = this.getCookie("companyCode");
				}
				if(!!this.getCookie("token")){
					_data.token = this.getCookie("token");
				}
				if(!!this.getCookie("userId")){
					_data.userId = this.getCookie("userId");
				}
			}
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
						
                        let protocol = (("https:" == window.document.location.protocol) ? "https://" : "http://");
                        let host = window.location.host;
                        if(data.errorCode == "30006"){
                            window.location.href = protocol + host + "/manage/login?workspace";
                        }else if(data.errorCode == "30008"){
                            window.location.href = protocol + host + "/scsw/index";
                        }
                        param.success(data);

					}
				},
				error: function(res){
					//var warning = $.parseJSON(res.responseText);
					//var message = !!warning.errorMsg ? warning.errorMsg : "开小差了~";
					//utils.alert("danger", message);
					if(typeof param.error == "function"){
						param.error(res);
					}
				},
				complete: function() {
					param.complete && param.complete();
				}
			});
		}
		
		//过滤表情
		filteremoji (content) {
			let ranges = [  
				'\ud83c[\udf00-\udfff]',  
				'\ud83d[\udc00-\ude4f]',  
				'\ud83d[\ude80-\udeff]'  
			];  
			let emojireg = content.replace(new RegExp(ranges.join('|'), 'g'), '');  
			return emojireg;  
		}
		
		//计算字节
		countByte (s) {
			let len = 0;  
			for (let i=0; i<s.length; i++) {   
				let c = s.charCodeAt(i);   
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
		isUrl (str) {
			return /(http|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(str);
		}
		
		//过滤XSS攻击
		escape (str) {
			return String(str).replace(/&(?!\w+;)/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&#039;');
		}
		
		//加载js
		loadScript (url, callback) {
			let script = document.createElement("script")
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
		
		//设置cookie
		setCookie (key, value, exp) {
			let date = new Date();
			date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
			let expires = "; expires=" + date.toGMTString();
			document.cookie = key + "=" + value + expires + "; path=/";
		}
		
		//获取cookie
		getCookie (key) {
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
		trim (str) {
			str = typeof str === 'string' ? str : '';
			return str.trim
				? str.trim()
				: str.replace(/^\s|\s$/g, '');
		}
		
		//提示
		alert (alertClass, message) {
			
			let alertWrap = $("#alertWrap");
			if(alertWrap.length == 0){
				$(document.body).append('<div id="alertWrap"></div>');
			}
			let $html = $('<div class="alert alert-' + alertClass + '"><i class="alert-icon-close"></i><div><strong>提示</strong><p>' + message + '</p></div></div>');
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
			
		}
		
		//base64加密
		encrypt (str) {
            var base64 = new _base64();
            var encrypt = base64.encode(str);
            return encrypt;
        }
        
        //base64解密
        decrypt (str) {
            var base64 = new _base64();
            var decrypt = base64.decode(str);
            decrypt = escape(decrypt);
            decrypt = decrypt.replace(/%00/g, '');
            decrypt = unescape(decrypt);
            return decrypt;
        }
		
		//获取textarea光标位置
		getTextareaPosition (textarea) {
			var rangeData = {text: "", start: 0, end: 0 };
			if(textarea.setSelectionRange){ // W3C	
				textarea.focus();
				rangeData.start= textarea.selectionStart;
				rangeData.end = textarea.selectionEnd;
				rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
			}else if(document.selection){ // IE
				textarea.focus();
				var i,
					oS = document.selection.createRange(),
					// Don't: oR = textarea.createTextRange()
					oR = document.body.createTextRange();
				oR.moveToElementText(textarea);
				
				rangeData.text = oS.text;
				rangeData.bookmark = oS.getBookmark();
				
				// object.moveStart(sUnit [, iCount]) 
				// Return Value: Integer that returns the number of units moved.
				for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i ++) {
					// Why? You can alert(textarea.value.length)
					if (textarea.value.charAt(i) == '\r' ) {
						i ++;
					}
				}
				rangeData.start = i;
				rangeData.end = rangeData.text.length + rangeData.start;
			}
			
			return rangeData;
			
		}
		//设置光标位置
		setTextareaPosition (textarea, rangeData) {
			var oR, start, end;
			if(!rangeData){
				alert("You must get cursor position first.")
			}
			textarea.focus();
			if(textarea.setSelectionRange){ // W3C
				textarea.setSelectionRange(rangeData.start, rangeData.end);
			}else if(textarea.createTextRange){ // IE
				oR = textarea.createTextRange();
				
				// Fixbug : ues moveToBookmark()
				// In IE, if cursor position at the end of textarea, the set function don't work
				if(textarea.value.length === rangeData.start) {
					//alert('hello')
					oR.collapse(false);
					oR.select();
				} else {
					oR.moveToBookmark(rangeData.bookmark);
					oR.select();
				}
			}
			
		}
		addTextareaText (textarea, rangeData, text) {
			
			var oValue, nValue, oR, sR, nStart, nEnd, st;
			this.setTextareaPosition(textarea, rangeData);
			
			if (textarea.setSelectionRange) { // W3C
				oValue = textarea.value;
				nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
				nStart = nEnd = rangeData.start + text.length;
				st = textarea.scrollTop;
				textarea.value = nValue;
				// Fixbug:
				// After textarea.values = nValue, scrollTop value to 0
				if(textarea.scrollTop != st) {
					textarea.scrollTop = st;
				}
				textarea.setSelectionRange(nStart, nEnd);
			} else if (textarea.createTextRange) { // IE
				sR = document.selection.createRange();
				sR.text = text;
				sR.setEndPoint('StartToEnd', sR);
				sR.select();
			}
			
		}
		
		//绑定页面离开提示事件
		bindUnload () {
			if((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
				//IE
				
			}else if(navigator.userAgent.indexOf('Firefox') >= 0){
				//火狐
				
			}else if(navigator.userAgent.indexOf("Chrome") !== -1){
				//谷歌
				
			}
			$(window).bind("beforeunload", function(){
				return '您输入的内容尚未保存，确定离开此页面吗？';
			})
		}
		
		unbindUnload () {
			$(window).unbind("beforeunload");
		}
		
		//会话列表设置未读消息数量
		setUnread () {
			if(window.sessionStorage){
				let unread = {};
				if(sessionStorage.getItem("unread")){
					unread = JSON.parse(sessionStorage.getItem("unread"));
				}
				for(let k in unread){
					if($(".onWrap li[sessionId='" + k + "']").length > 0){
						let li = $(".onWrap li[sessionId='" + k + "']");
						let badge = li.find(".badge");
						let num = unread[k];
						if(badge.is(":hidden")){
							badge.show();
						}
						badge.text(num);
					}
				}
			}
		}
		
		//清除未读消息数量
		clearUnread (sessionId) {
			if(window.sessionStorage){
				let unread = {};
				if(sessionStorage.getItem("unread")){
					unread = JSON.parse(sessionStorage.getItem("unread"));
				}
				delete unread[sessionId];
				sessionStorage.setItem("unread", JSON.stringify(unread));
			}
		}
		
		//未读消息总数
		getUnreadCount () {
			let count = 0;
			if(window.sessionStorage){
				if(sessionStorage.getItem("unread")){
					let unread = JSON.parse(sessionStorage.getItem("unread"));
					for(let k in unread){
						count += parseInt(unread[k]);
					}
					
				}
			}
			return count;
			
		}
		
		//更新菜单栏未读消息数
		updateUnreadCount () {
			let root = this;
			let unreadCount = root.getUnreadCount();
			root.formatMenuCount($("#unreadCount"), unreadCount);
			
		}
		
		//启动消息通知
		flashTitle () {
			if(!!window.g_flashTimer){
				window.clearInterval(window.g_flashTimer);
				window.g_flashTimer = null;
				//window.clearTimeout(window.g_flashTimer2);
				//window.g_flashTimer2 = null;
			}
			window.g_flashTimer = setInterval(function() {
			    let title = document.title;
			    if(/新/.test(title) == false){
		            document.title = '【你有一条新的消息】';    
		        }else{
		            document.title = '【                                 】';
		        }
			}, 1000);
			/*window.g_flashTimer2 = setTimeout(function(){
				window.clearInterval(window.g_flashTimer);
				window.g_flashTimer = null;
				document.title = window.g_title;
			}, 5000);*/
			
		}
		
		//消息提示
		notification (options) {
			let root = this;
			let title = options.title || "提示";
			let message = options.message || "";
			let touristId = options.touristId || "0";
			if('Notification' in window){
				//获取权限
				Notification.requestPermission();
				let notification = new Notification(title, {
			        body: message,
			        icon: config.domain + 'workspace/dist/img/kefu.png'
			    });
				notification.onclick = function(){
					root.unbindUnload();
					window.focus();
					//window.location.href = "../../view/core/index?touristId=" + touristId;
					notification.close();
				}
				setTimeout(function(){
				    notification.close();
				}, 5000);
            } 
			
		}
		
		playNoticeAudio () {
			//播放消息提示声音
			if($("#switchVoiceBtn").find("input").prop("checked")){
				return;
			}
			let audio = document.getElementById("noticeAudio");
			if(!audio.paused){
				audio.pause();
			}
			audio.play();
			
		}
		
		//格式化消息内容
		formatReceiveMsg (msg) {
			if(typeof msg == "object"){
				if(msg.itp == 0){
					let wds = JSON.parse(msg.wds);
					wds = wds.wds[0];
					
					for(var face in Emoji.map){
				        if(Emoji.map.hasOwnProperty(face)){
				            while(wds.indexOf(face) > -1){
				            	wds = wds.replace(face, Emoji.map[face].text);
				            }
				        }
				    }
					
					if(wds.length > 15){
						wds = wds.substring(0, 15) + "...";
					}
                    //wds = String(wds).replace(/&lt/g, '<').replace(/;/g, '').replace(/&gt/g, '>');
					return wds;
				}else if(msg.itp == 1){
					return "【图片】";
				}else if(msg.itp == 2){
					return "【文件】";
				}else if(msg.itp == 3){
					return "【语音】";
				}else if(msg.itp == 4){
					return "【语音】";
				}else if(msg.itp == 5){
					return "【评价】";
				}
			}
			return msg;
		}
		
		parseContent (content, itp) {
			try{
                var contentObj = typeof content === "string" ? JSON.parse(content) : content;
                if(contentObj.content){
                    content = contentObj.content;
                }else{
                    var tmp = contentObj.wds || content ,content = "";
                    if(typeof tmp === "string" || !tmp.length){
                        content = tmp;
                    }else{
                        for ( var i=0;i<tmp.length;i++) {
                            content += tmp[i];
                            if(i+1 != tmp.length){
                                content += "<br/>";
                            }
                        }
                    }
                }
            }catch(e){
            	
            }
            return content;
			
		}
		
        //处理undefined数据
        undefinedInit (str) {
            if(!str || str == '' || str == "null" || str == "undefined"){
                str = "--";
            }
            return str;
        }

        //处理360极速浏览器title兼容问题
        titleCompatibility() {
            if((document.title == "undefined")){
                let titleArray = ["会话中心","会话评估","历史会话","实时访客","工单中心","呼叫中心"];
                let menuArray = ["core","evaluate","history","visitor","order","call"];
                let url = window.location.href;
                for(let i=0;i<titleArray.length;i++){
                    if(url.indexOf(menuArray[i])>-1){
                        document.title=titleArray[i];
                    }
                }
            }
        }
        
        //未读消息数，会话评估数，工单数量  格式化： 超过99显示99+
        formatMenuCount (el, count) {
        	if(count > 0){
        		if(el.hasClass("hide")){
        			el.removeClass("hide");
        		}
        	}else{
        		el.addClass("hide");
        	}
        	if(count > 99){
        		el.text("99+").attr("count", count);
        	}else{
        		el.text(count).attr("count", count);
        	}
        }
        
        //回话中心重置聊天内容
        resetChatContent () {
        	$(".rightPanel .customerInfo, .rightPanel .baseInfo, .rightPanel .recordInfo").html("");
			$(".chat-container").html(this.dom.nullSession);
			$(".rightPanel .customerInfoWrap>.nano").addClass("hide");
			$(".rightNav li[data-target='.iframeWrap']").addClass("hide");
			if(!$(".rightPanel .iframeWrap").hasClass("hide")){
				$(".rightPanel .iframeWrap").addClass("hide");
			}
        }
		
	}
	
	module.exports = new Utils()

}());