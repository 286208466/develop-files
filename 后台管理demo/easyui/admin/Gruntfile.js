module.exports = function(grunt){

	//var imgUrl = "http://127.0.0.1:8002/dist/img/";
	var imgUrl = "../../dist/img/";
	
	grunt.initConfig({
 
        pkg: grunt.file.readJSON('package.json'),
        
        //Auto sprite
		sprite: {
			options: {
				// sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
				imagepath: 'src/img/sprite/',
				// 映射CSS中背景路径，支持函数和数组，默认为 null
				imagepath_map: null,
				// 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
				spritedest: 'dist/img/',
				// 替换后的背景路径，默认为 file.dest 和 spritedest 的相对路径
				spritepath: imgUrl,
				// 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
				padding: 2,
				// 是否使用 image-set 作为2x图片实现，默认不使用
				useimageset: false,
				// 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
				newsprite: false,
				// 给雪碧图追加时间戳，默认不追加
				spritestamp: false,
				// 在CSS文件末尾追加时间戳，默认不追加
				cssstamp: false,
				// 默认使用二叉树最优排列算法
				algorithm: 'binary-tree',
				// 默认使用`pixelsmith`图像处理引擎
				engine: 'pixelsmith'
			},
			autoSprite: {
				files: [{
					// 启用动态扩展
					expand: true,
					// css文件源的文件夹
					cwd: 'src/css/',
					// 匹配规则
					src: 'icon.css',
					// 导出css和sprite的路径地址
					dest: 'src/css/',
					// 导出的css名
					ext: '.sprite.css'
				}]
			}
		},
        
        //压缩js
        uglify:{
            options: {
            	//合并时允许输出头部信息
                stripBanners: true, 
                banner: '/*!<%= pkg.name %> - <%= pkg.version %> */\n'
            },
            //按原文件结构压缩js文件夹内所有JS文件
            my_target: {
	            files: [{
	            	expand: true,
	            	cwd: 'src/js',
	            	src: '**/*.js',
	            	dest: 'dist/js'
	            }]
            },
            //合并压缩a.js和b.js
            release: {
                files: {
                	'dist/js/lib.min.js': ['src/js/jquery-1.12.4.js', 'src/js/doT.js', 'src/js/util.js']
                }
            }
        },
        
        //less插件配置
        /*less: {
        	production: {
        		options: {
        			paths: ['src/less'],
        			plugins: [
        				new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]})
        				//,new (require('less-plugin-clean-css'))(cleanCssOptions)
        			],
    				modifyVars: {
    					imgPath: null
    				},
    				ieCompat: true
        		},
        		files: {
        			'src/css/style.css': 'src/less/style.less',
        			'src/css/icon.css': 'src/less/icon.less'
        		}
        	}
    	},*/
        
        //压缩css
        cssmin:{
            options:{
                stripBanners:true,
                banner:'/*!<%= pkg.name %> - <%= pkg.version %> */\n'
            },
            target: {
	            files: [{
	                expand: true,
	                cwd: 'src/css',
	                src: ['*.css', '!*.min.css'],
	                dest: 'dist/css',
	                ext: '.min.css'
	            }]
            }
        },
        
        //watch插件的配置信息(监控js,css文件,如改变自动压缩,语法检查)
        watch: {
            build:{
                files:['src/js/*.js', 'src/css/*.css'],
                tasks:['uglify', 'sprite', 'cssmin'],
                options:{
                	spawn: false
                }
            }
        }
        
 
    });
    
    //grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-css-sprite');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerInitTask('default', ['uglify', 'sprite', 'cssmin', 'watch']);
};