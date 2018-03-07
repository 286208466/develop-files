##gitbook使用教程  

###gitbook安装

GitBook 是一个基于 Node.js 的命令行工具，可使用 Github/Git 和 Markdown 来制作精美的电子书。通过Node.js命令安装GitBook

1、NMP安装Gitbook  

    npm install gitbook -g

2、安装gitbook CLI  

想在系统上的任何地方的gitbook命令，需要安装“gitbook CLI”，执行以下命令  

    //安装命令
    npm install -g gitbook-cli
    //卸载命令
    npm uninstall gitbook-cli -g

3、检验下是否安装成功  

    gitbook -V //显示0.4.2  

###开始使用  

1、创建doc文件夹，并切换到doc目录，运行gitbook init

    mkdir doc && cd doc  
    gitbook init

然后会初始化 GitBook 目录，创建两个 md 格式的文件 README.md 和 SUMMARY.md  

README.md - 项目的介绍都写在这个文件里。  
SUMMARY.md - GitBook 的目录结构在这里配置。

2、定义目录结构  

（1）先定义好目录结构，通过 gitbook init 自动生成目录结构对应的文件夹和 Markdown 文件。  

（2）先创建好文件夹和 Markdown 文件再来编辑目录结构。  

    # Summary  
    * [Introduction](README.md)  
    * [开发指南](README.md) 
    * [工具类utils.js](utils.md)  
    * [基础组件]  
        * [Layout布局](ui/layout.md)  
        * [Color色彩](ui/color.md)  

编辑好SUMMARY.md后执行下面命令  

    gitbook init  

注意： gitbook init 只支持生成两级目录  

3、启动服务  

    gitbook serve  

在浏览器中输入http://localhost:4000/ 查看API文档
