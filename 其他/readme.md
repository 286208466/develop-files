###nginx配置###  

    server {
        listen       80;
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
        server_name localhost.com;
        root D:\workspace\kf_web;
        #官网
        location / {
			proxy_pass http://localhost.com:9010;
        }
        #管理中心
        location ^~ /manage {
            if (!-f $request_filename){
              	rewrite ^(.*)/(.*)$ $1/$2.html last;
              	break;
	    	}
        }        
        #客服工作台配置
        location ^~ /workspace {
            if (!-f $request_filename){
              	rewrite ^(.*)/(.*)$ $1/$2.html last;
              	break;
	    	}
        }
        #新版访客端
        location /web_client/ {
            alias /workspace/kf_web/web_client/;
            if (!-f $request_filename){
              	rewrite ^(.*)/(.*)$ $1/$2.html last;
              	break;
	    	}
        }
        #超管
        location /admin/ {
            if (!-f $request_filename){
              	rewrite ^(.*)/(.*)$ $1/$2.html last;
              	break;
	    	}
        }
        location  /scsw {
			#测试环境
			#proxy_pass http://test.kefu.com/scsw/;
			#开发环境
			proxy_pass http://dev.kefu.com/scsw/;
            proxy_set_header X-Forwarded-For $remote_addr;
        }
        location  /kf-sccs {
        	#测试环境
        	#proxy_pass http://test.kefu.com:8326/kf-sccs/;
        	#开发环境
			proxy_pass http://dev.kefu.com:8326/kf-sccs/;
            proxy_set_header X-Forwarded-For $remote_addr;
        }
        location  /scsf {
        	#测试环境
            #proxy_pass http://test.kefu.com/scsf/;
            #开发环境
            proxy_pass http://dev.kefu.com/scsf/;
            proxy_set_header X-Forwarded-For $remote_addr;
        } 	
        location  /kf-scsm {
        	#测试环境
            #proxy_pass http://test.kefu.com/scsf/;
            #开发环境
            proxy_pass http://dev.kefu.com/kf-scsm/;
            proxy_set_header X-Forwarded-For $remote_addr;
        }
    }
    #移动官网
	server {
        listen 80;
        server_name m.localhost.com;
		location / {
			proxy_pass http://localhost.com:9011;
		}
	}
	  
修改hosts文件添加如下配置  

    127.0.0.1 localhost.com
    127.0.0.1 m.localhost.com	 
	  
###构建工具使用###  

在manage目录下运行  

    webpack -w

如果没有node_modules 文件夹，必须先进行安装  
    
    npm install  
    
    
###项目说明###  

iconfont图标命名规则：  

    （图标所属的模块名称）-（图标名称：以峰陀式规则命名）  
    
比如：  
 菜单图标: menu-core  
头部的图标： header-user,header-help等等  

本地图片图标命名规则：  

    以峰陀式规则命名（图标所属的模块名称+图标名称：）  
  
比如：  
 菜单图标: menuCore  
头部的图标： headerUser,headerHelp等等    

代码规范：http://alloyteam.github.io/CodeGuide/#project-naming


###项目上线发布###   

1、修改config.js里的配置(按照环境修改变量env)      

2、运行webpack -w(如果lib.js包含的js文件有修改，需要gruntfile.js里dev和pro模式切换运行)  

3、css、js版本号修改(只有上线的时候才全局替换)

4、删除不要的文件  node_modules  

