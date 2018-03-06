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
	
    var Utils = function(){};
    
    //根据url参数名称获取参数的值
    Utils.prototype.getUrlParam = function(name){
    	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return decodeURI(r[2]);
		}
		return "";
    }
    
    //iframe下载文件
    Utils.prototype.download = function(filepath){
    	var iframe = document.getElementById("downloadframe");
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
    
    //请求模板html
    Utils.prototype.template = function(url){
    	var template = null;
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
    Utils.prototype.getIEVersion = function(){
    	var ua = navigator.userAgent, matches, tridentMap = {'4': 8, '5': 9, '6': 10, '7': 11};
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
    Utils.prototype.ajax = function(param){
    	var _url = param.url;
		var _data = param.data || {};
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
		var _type = !!param.type ? param.type : "post";
		var _async = (typeof param.async) != 'undefined' ? param.async : true;
		var _contentType = !!param.contentType ? param.contentType : "application/x-www-form-urlencoded";
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
					
					if(data.errorCode == "30006"){
						//window.location.href = config.domain + "workspace/login";
                        var protocol = (("https:" == window.document.location.protocol) ? "https://" : "http://");
                        var host = window.location.host;
                        window.location.href = protocol + host + "/scsw/login";
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
    Utils.prototype.countByte = function(s){
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
    
    //过滤XSS攻击
    Utils.prototype.escape = function(str){
    	return String(str).replace(/&(?!\w+;)/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
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
    
    //设置cookie
    Utils.prototype.setCookie = function(key, value, exp){
    	var date = new Date();
		date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
		document.cookie = key + "=" + value + expires + "; path=/";
    }
    
    //获取cookie
    Utils.prototype.getCookie = function(key){
    	var nameEQ = key + "=";
		var ca = document.cookie.split(';');
		for (var i = 0, max = ca.length; i < max; i++) {
			var c = ca[i];
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
    
    //提示
    Utils.prototype.alert = function(alertClass, message){
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
    }
    
    //base64加密
    Utils.prototype.encrypt = function(str){
    	var base64 = new _base64();
        var encrypt = base64.encode(str);
        return encrypt;
    }
    
    //base64解密
    Utils.prototype.decrypt = function(str){
    	 var base64 = new _base64();
         var decrypt = base64.decode(str);
         decrypt = escape(decrypt);
         decrypt = decrypt.replace(/%00/g, '');
         decrypt = unescape(decrypt);
         return decrypt;
    }
    
    //获取textarea光标位置
    Utils.prototype.getTextareaPosition = function(textarea){
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
    Utils.prototype.setTextareaPosition = function(textarea, rangeData){
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
    
    Utils.prototype.addTextareaText = function(textarea, rangeData, text){
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
    
    Utils.prototype.datagrid = function(options){
    	var el=options.el?options.el: "#datagrid";
    	$(el).datagrid({
    		//properties
    		columns:options.columns?options.columns:undefined,
    		frozenColumns:options.frozenColumns?options.frozenColumns:undefined,
    		fitColumns:options.fitColumns?options.fitColumns:false,
    		resizeHandle:options.resizeHandle?options.resizeHandle:"right",
    		autoRowHeight:options.autoRowHeight?options.autoRowHeight:true,
    		toolbar:options.toolbar?options.toolbar:null,
    		striped:options.striped?options.striped:true,
    		method:options.method?options.method:"post",
    		nowrap:options.nowrap?options.nowrap:true,
    		idField:options.idField?options.idField:null,
    		url:options.url?options.url:null,
    	    data:options.data?options.data:null,
    		pagination:options.pagination?options.pagination:true,
    		rownumbers:options.rownumbers?options.rownumbers:true,
    		singleSelect:options.singleSelect?options.singleSelect:false,
    		ctrlSelect:options.ctrlSelect?options.ctrlSelect:false,
    		checkOnSelect:options.checkOnSelect?options.checkOnSelect:true,
    		selectOnCheck:options.selectOnCheck?options.selectOnCheck:true,
    		pagePosition:options.pagePosition?options.pagePosition:"bottom",
    		pageNumber:options.pageNumber?options.pageNumber:1,
    		pageSize:options.pageSize?options.pageSize:10,
    		pageList:options.pageList?options.pageList:[10,20,30,40,50],
    		queryParams:options.queryParams?options.queryParams:{},
    		sortName:options.sortName?options.sortName:null,
    		sortOrder:options.sortOrder?options.sortOrder:"asc",
    		multiSort:options.multiSort?options.multiSort:false,
    		remoteSort:options.remoteSort?options.remoteSort:true,
    		showHeader:options.showHeader?options.showHeader:true,
    		showFooter:options.showFooter?options.showFooter:false,
    		scrollbarSize:options.scrollbarSize?options.scrollbarSize:18,
    		//rowStyler:options.rowStyler?options.rowStyler:function(index,row){},
    		//loader:options.loader?options.loader:function(){},
    		//loadFilter:options.loadFilter?options.loadFilter:function(data){},
    		//editors:options.editors?options.editors:{},
    		//view:options.view?options.view:{},
    		//event
    		onLoadSuccess:function(data){
    			if(data.logoutFlag){
    				$.messager.alert('提示',data.message,'warning',function(){
    					if(window.top==window.self){
    						window.location.href=basePath+"cloud-ms-new/login.html";
    					}else{
    						window.parent.location.href=basePath+"cloud-ms-new/login.html";
    					}
    				});
    			}
    			if(options.onLoadSuccess){
    				options.onLoadSuccess(data);
    			}
    		},
    		onLoadError:function(){
    			if(options.onLoadError){
    				options.onLoadError();
    			}
    		},
    		onBeforeLoad:function(param){
    			if(options.onBeforeLoad){
    				options.onBeforeLoad(param);
    			}
    		},
    		onClickRow:function(index,row){
    			if(options.onClickRow){
    				options.onClickRow(index,row);
    			}
    		},
    		onDblClickRow:function(index,row){
    			if(options.onDblClickRow){
    				options.onDblClickRow(index,row);
    			}
    		},
    		onClickCell:function(index,field,value){
    			if(options.onClickCell){
    				options.onClickCell(index,field,value);
    			}
    		},
    		onDblClickCell:function(index,field,value){
    			if(options.onDblClickCell){
    				options.onDblClickCell(index,field,value);
    			}
    		},
    		onBeforeSortColumn:function(sort,order){
    			if(options.onBeforeSortColumn){
    				options.onBeforeSortColumn(sort,order);
    			}
    		},
    		onSortColumn:function(sort,order){
    			if(options.onSortColumn){
    				options.onSortColumn(sort,order);
    			}
    		},
    		onResizeColumn:function(field,width){
    			if(options.onResizeColumn){
    				options.onResizeColumn(field,width);
    			}
    		},
    		onBeforeSelect:function(index,row){
    			if(options.onBeforeSelect){
    				options.onBeforeSelect(index,row);
    			}
    		},
    		onSelect:function(index,row){
    			if(options.onSelect){
    				options.onSelect(index,row);
    			}
    		},
    		onBeforeUnselect:function(index,row){
    			if(options.onBeforeUnselect){
    				options.onBeforeUnselect(index,row);
    			}
    		},
    		onUnselect:function(index,row){
    			if(options.onUnselect){
    				options.onUnselect(index,row);
    			}
    		},
    		onSelectAll:function(rows){
    			if(options.onSelectAll){
    				options.onSelectAll(rows);
    			}
    		},
    		onUnselectAll:function(rows){
    			if(options.onUnselectAll){
    				options.onUnselectAll(rows);
    			}
    		},
    		onBeforeCheck:function(index,row){
    			if(options.onBeforeCheck){
    				options.onBeforeCheck(index,row);
    			}
    		},
    		onCheck:function(index,row){
    			if(options.onCheck){
    				options.onCheck(index,row);
    			}
    		},
    		onBeforeUncheck:function(index,row){
    			if(options.onBeforeUncheck){
    				options.onBeforeUncheck(index,row);
    			}
    		},
    		onUncheck:function(index,row){
    			if(options.onUncheck){
    				options.onUncheck(index,row);
    			}
    		},
    		onCheckAll:function(rows){
    			if(options.onCheckAll){
    				options.onCheckAll(rows);
    			}
    		},
    		onUncheckAll:function(rows){
    			if(options.onUncheckAll){
    				options.onUncheckAll(rows);
    			}
    		},
    		onBeforeEdit:function(index,row){
    			if(options.onBeforeEdit){
    				options.onBeforeEdit(index,row);
    			}
    		},
    		onBeginEdit:function(index,row){
    			if(options.onBeginEdit){
    				options.onBeginEdit(index,row);
    			}
    		},
    		onEndEdit:function(index,row,changes){
    			if(options.onEndEdit){
    				options.onEndEdit(index,row,changes);
    			}
    		},
    		onAfterEdit:function(index,row,changes){
    			if(options.onAfterEdit){
    				options.onAfterEdit(index,row,changes);
    			}
    		},
    		onCancelEdit:function(index,row){
    			if(options.onCancelEdit){
    				options.onCancelEdit(index,row);
    			}
    		},
    		onHeaderContextMenu:function(e,field){
    			if(options.onHeaderContextMenu){
    				options.onHeaderContextMenu(e,field);
    			}
    		},
    		onRowContextMenu:function(e,index,row){
    			if(options.onRowContextMenu){
    				options.onRowContextMenu(e,index,row);
    			}
    		}
    	});
    	
    	var pager = $(el).datagrid('getPager');	
    	
    	pager.pagination({
    		buttons:options.buttons?options.buttons:null
    	});
    }
    
    //添加页签方法
    Utils.prototype.addTab = function(params){
    	//如果当前id的tab不存在则创建一个tab  
        if($(window.parent.document.body).find("iframe#"+params.tabId).length < 1){  
            var name  = 'iframe_'+params.tabId;  
            window.parent.tab.tabs('add',{  
                title: params.title,           
                closable:true,  
                cache : false,  
                //注：使用iframe即可防止同一个页面出现js和css冲突的问题  
                content : '<iframe name="'+name+'" id="'+params.tabId+'" src="'+params.url+'" width="100%" height="100%" frameborder="0" scrolling="auto" ></iframe>'  
            });  
        }else{
        	window.parent.tab.tabs('select', params.title);
        	var tab =window.parent.tab.tabs('getSelected');
    		var name=$(tab).find("iframe").attr("name");
    		window.parent.window.document.getElementById(params.tabId).src=params.url;
        }  
    }
    
    /*
    	图片预览
    	<div class="preWrap">
    		<div>
    			<img src="">
    			<input type="file" name="img1" onchange="preview(this)">
    		</div>
    		<a class="ui-label-blue">选择<a>&ensp;
    		<a class="ui-label-yellow">清除</a>
    	</div>
    */
    Utils.prototype.preview = function(self){
    	
    	//.jpg,.bmp,.gif,.png,允许上传文件的后缀名
        var allowExtention = self.value; 
        
        if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(allowExtention)){
        	self.value = "";
        	$.messager.alert('提示', '图片格式错误！', 'info');
        	return;
    	}
    	if(self.files && self.files[0]){
        	if (window.FileReader) {
                var reader = new FileReader();
                reader.onload = function(e) {
                	var imgel= document.createElement("img");
                    imgel.setAttribute("src", e.target.result);
                    imgel.onload=function(){
                    	$(self).siblings("img").attr("src", e.target.result)
                    }
                }
                reader.readAsDataURL(self.files[0]);
            }
    	}
        
    }
    
	window.utils = new Utils()
	
}());
    	
//日期格式化
/*
 * 	示例
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

$(function(){
	
	$(document).on("click.f-radio", ".f-radio", function(e){
		
		//radio
		e.preventDefault();
	    e.stopPropagation();
		var self = $(e.currentTarget);
		if(self.hasClass("disabled")) return;
		if(!self.hasClass("checked")){
			var name = self.find("input").attr("name");
			$(".f-radio input[name='" + name + "']").each(function(){
				var input = $(this);
				if(input.parents(".f-radio").hasClass("checked")){
					input.parents(".f-radio").removeClass("checked");
					input.parents(".f-radio").find("input").prop("checked", true);
				}
			});
			self.addClass("checked");
			self.find("input").prop("checked", true);
		}
		
	}).on("click.f-checkbox", ".f-checkbox", function(e){
		
		//checkbox
		e.preventDefault();
	    e.stopPropagation();
		var self = $(e.currentTarget);
		if(self.hasClass("disabled")) return;
		if(!self.hasClass("checked")){
			self.addClass("checked");
			self.find("input").prop("checked", true);
		}else{
			self.removeClass("checked");
			self.find("input").prop("checked", false);
		}
		
	})
	
})


