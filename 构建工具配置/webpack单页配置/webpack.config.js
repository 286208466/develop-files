var path = require('path');
var webpack = require('webpack');
//JS压缩
var uglifyJsPlugin = require('uglifyjs-webpack-plugin');
//雪碧图
var SpritesmithPlugin = require('webpack-spritesmith');

//css生成新文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
	entry: {
		'spring': './src/js/spring.js',
		'springstyle': ['./src/css/common.css', './src/css/spring.css']
		//'jquery': ['./src/js/jquery-3.2.1.min.js']
	}
	,output: {
		path: __dirname + '/dist',
		filename: '[name].js'
	}
	,module: {
		rules: [
			{ 
				test: /\.css$/, 
				loader:ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' })
			},
			{
		        test: /\.(png|jpg|gif)$/,
		        use: [
		          {
		            loader: 'file-loader',
		            options: {
		            	name: 'img/[name].[ext]',
		            	//useRelativePath: true,
		            	publicPath: '/h5/dist/'
		            }  
		          }
		        ]
		    }
        ]
	}
	,plugins: [
		new SpritesmithPlugin({
            // 目标小图标
            src: {
                cwd: path.resolve(__dirname, './src/img/sprite'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件
            target: {
                image: path.resolve(__dirname, './dist/img/sprite/sprite.png'),
                css: path.resolve(__dirname, './src/css/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: './dist/img/sprite/sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        })
		,new uglifyJsPlugin({
			uglifyOptions: {
				ie8: true,
				comments: false,
				compress: {
					drop_console: true
				},
				warnings: false
		    }
	    })
		/*,new webpack.optimize.CommonsChunkPlugin({
		    name: 'jquery',
		    filename: 'common.bundle.js',
		    minChunks: Infinity
		})*/
		,new ExtractTextPlugin("[name].css")
		,new OptimizeCssAssetsPlugin({
	        cssProcessor: require('cssnano'),
	        cssProcessorOptions: { discardComments: {removeAll: true } },
	        canPrint: true
		})
	]
};