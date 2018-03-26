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


###Html书写规范###   

1、推荐使用html5的文档声明。  

    <!DOCTYPE HTML>  
    
2、必须申明文档的编码charset，且与文件本身编码保持一致，推荐使用UTF-8编码。  

    <meta charset="utf-8">  
    
3、title 不可缺少，控制在25个字、50个字节以内。“二级栏目 - 一级栏目 - 网站名称”。  

4、keywords很重要，关键词，针对SEO。  

> 5个左右,单个8汉字以内；禁忌堆砌，与网站主题无关。  

5、description网站描述，字数尽量空制在80个汉字，160个字符以内。  

6、建议采用响应式栅格化处理，兼容多个平台设备。  

7、书写注释，方便程序开发嵌套。注释方式：  

    开始注释：<!-- 注释 -->
    结束注释：<!-- /注释文案 -->
    允许只有开始注释

>浮动的地方不要加注释，可能导致布局错位或文字的BUG。  

8、img添加alt属性，增加可访问性。  

    <img src="" alt="图片描述" title="图片描述">  
    
9、带有实体名称的 ASCII 实体或特殊字符要使用实体名。  

    字符：©    实体： &copy;  
    
10、标签一定要正确嵌套，标签一定要闭合。  

11、用div等标签布局；表格型数据，table首选。  

12、代码风格采用树形结构，提高可读性；避免冗余嵌套。  

13、模块之间必须保持独立，区块化布局，方便随意增删改，多人协作维护。  

14、非特殊情况下，css采用外链，加在<head>之间；js文件放在页面底部</body>之前。  

15、自定义标签或者属性，用data-开头。  

16、需要程序单独赋值或者控制的地方尽量用独立的标签包括起来，方便添加id和其他自定义属性。  

17、可能程序在套用时候标签之间会出现空数据，产生（冗余标签）造成多余空白间距，请一定注释声明给后端程序员注意一下，将判断包住标签。  

18、避免元素的滚动条和body的滚动条同时出现，影响体验。  

19、需要异步加载的地方给出加载中（loading）状态效果。  


###CSS Hack###  

    1. _          IE6
    2. *          IE6/7
    3. !important IE7/Firefox
    4. *+         IE7
    5. \9         IE6/7/8
    6. \0         IE8
    7. 条件hack
      <!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]--> IE7以下版本
      <!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]--> IE7
      <!--[if IE 8]> <html class="no-js lt-ie9"><![endif]--> IE8
      <!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]--> IE8以上

