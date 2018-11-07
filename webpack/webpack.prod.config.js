const webpack = require('webpack'),
	VueLoaderPlugin = require('vue-loader/lib/plugin'), 
	HtmlwebpackPlugin = require('html-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	merge = require('webpack-merge'),  //融合
	webpackBaseConfig = require('./webpack.dev.config.js');
//清空插件
webpackBaseConfig.plugins = [];

//融合配置
module.exports = merge(webpackBaseConfig,{
	output:{
		publicPath:'../',
		filename: 'js/[name].[hash].min.js'
	},
	plugins:[
		//css
		new ExtractTextPlugin({
			filename: 'css/[name].[hash].css',
			allChunks : true
		}),
		new webpack.DefinePlugin({
			'process.env':{
				NODE_ENV:'"production"'
			}
		}),
		//vue
		new VueLoaderPlugin(),
		//html提取
		new HtmlwebpackPlugin({
			filename:'./page/demo.html',
			template:'./src/demo.html'
		})
		
	]
})
