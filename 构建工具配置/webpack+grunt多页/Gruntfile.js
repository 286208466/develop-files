var webpack = require("webpack");
var webpackconfig = require("./webpack.config.js");

module.exports = function(grunt) {
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	    webpack: {
	    	options: {
	    		stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
	    	}
	    	,prod: webpackconfig
	        //,dev: Object.assign({ watch: true }, webpackconfig)
	    },
	    
    	//压缩js
        uglify:{
            options: {
            	//合并时允许输出头部信息y
                stripBanners: true, 
                ie8: true,
                banner: '/*!<%= pkg.name %> - <%= pkg.version %> */\n'
            },
            //按原文件结构压缩js文件夹内所有JS文件
            // my_target: {
	           // files: [{
	           // 	expand: true,
	           // 	cwd: 'src/js',
	           // 	src: '**/*.js',
	           // 	dest: 'dist/js'
	           // }]
            // },
            //合并压缩a.js和b.js
            release: {
                files: {
                	'dist/js/lib.js': [
                        //'src/js/plugins/jquery-1.9.1.min.js', 
                        'src/js/plugins/config.js', 
                        'src/js/plugins/doT.js', 
                        'src/js/plugins/jquery.pagination.js', 
                        'src/js/plugins/jquery.singlePageNav.min.js', 
                        'src/js/plugins/slick.min.js',
                        'src/js/plugins/util.js', 
                        'src/js/plugins/wow.js'
                    ]
                }
            }
        },
        
        //删除css文件夹下的js
        clean: {
        	js: ['dist/css/*.js']
    	},
	    
	    //watch插件的配置信息(监控js,css文件,如改变自动压缩,语法检查)
        watch: {
            build:{
                files:['src/less/*.less', 'src/js/*.js', 'src/css/*.css'],
                tasks:['webpack', 'less'],
                options:{
                	spawn: false
                }
            }
        }
	    
	});
 
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    
    grunt.registerInitTask('default', ['webpack', 'uglify', 'clean', 'watch']);
    
};