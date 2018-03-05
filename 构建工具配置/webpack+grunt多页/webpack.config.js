var path = require('path');
var webpack = require('webpack');
//JS压缩
var uglifyJsPlugin = require('uglifyjs-webpack-plugin');
//css生成新文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//入口配置
var entry = require('./entry');
//雪碧图
var SpritesmithPlugin = require('webpack-spritesmith');

var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

//雪碧图地址
var env = "test"
var config = {
	dev: {
		domain: "http://127.0.0.1:9010/"
	},
	test: {
		domain: "http://test.kefu.com/"
	},
	pre: {
		domain: "https://demo-www.71chat.com/"
	},
	pro: {
		domain: "https://71chat.com/"
	}
}

module.exports = {
	entry: entry
	,output: {
		path: __dirname + '/dist',
		filename: '[name].js'
	}
	,module: {
		rules: [
	        {
	            loader: 'babel-loader',
	            test: path.join(__dirname, 'src/js'),
	            query: {
	              presets: 'es2015',
	            }
	        },
	        {
	        	test: /\.less$/,
	        	loader:ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' })
	        },
	        {
	            test: /\.art$/,
	            loader: "art-template-loader",
	            options: {
	                // art-template options (if necessary)
	                // @see https://github.com/aui/art-template
	            }
	        },
            {
                test: /\.(png|jpe?g|gif|ico)(\?\S*)?$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    publicPath: '/',
                    emitFile: false
                }
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
                cssImageRef: config[env].domain + 'dist/img/sprite/sprite.png'
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
					drop_console: true,
                    computed_props: false
				},
				warnings: false
		    }
	    })
		,new ExtractTextPlugin("[name].css")
		,new OptimizeCssAssetsPlugin({
	        cssProcessor: require('cssnano'),
	        cssProcessorOptions: { discardComments: {removeAll: true } },
	        canPrint: true
		})
    ]
};