var http = require('http');
var qs = require('querystring');
var settings = require("./settings");

module.exports = {
    json: function(res, ret){
        if(typeof ret === 'undefined'){
            res.status(200).json({
                code:'0',
                message: '系统繁忙！'
            });
        }else{
            res.status(200).json(ret);
        }
    },
    // 遍历对象
    objForEach: function (obj, fn) {
        let key, result
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                result = fn.call(obj, key, obj[key])
                if (result === false) {
                    break
                }
            }
        }
    },
    /*
                        发起get请求
        param.data 发起get请求提交的数据
        param.url 路径
        param.success  回调
    */
    get: function(param){
    	
    	var path = param.url;
    	if(!!param.data){
    		var arr = [];
    		for(var k in param.data){
    			arr.push( k + "=" + param.data[k]);
    		}
    		path = path + "?" + arr.join("&");
    	}
    	console.info("调用接口：" + path);
    	var options = {
            hostname: settings.server.name,
            port: settings.server.port,
            path: path,
            method: 'GET'
        };

        var req = http.request(options, function (res) {
            console.info('STATUS: ' + res.statusCode);
            console.info('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function() {
            	console.info("调用接口：" + path + "结束----" + new Date());
            	param.success && param.success(data);
            });
        });

        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });

        req.end();
    },
    /*
		发起post请求
		param.data 发起post请求提交的数据
		param.url 路径
		param.success  回调
	*/
    post: function(param){
    	var path = param.url;
    	var data = param.data || {};
    	var contents = querystring.stringify(data);
    	var options = {
    		hostname: settings.server.name,
            port: settings.server.port,
		    path: path,
		    method: 'POST',
		    headers:{
		        'Content-Type':'application/x-www-form-urlendcoded',
		        'Content-Length':contents.length
		    }
		}
    		 
		var req = http.request(options, function(res){
		    res.setEncoding('utf8');
		    var data = '';
		    res.on('data',function(chunk){
		    	data += chunk;
		    });
		    res.on('end', function() {
            	console.info("调用接口：" + path + "结束----" + new Date());
            	param.success && param.success(data);
            });
		});
		 
		req.write(contents);
		req.end;
    }

};
