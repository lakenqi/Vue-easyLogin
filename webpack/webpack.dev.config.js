const path = require('path'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	VueLoaderPlugin = require('vue-loader/lib/plugin'), //vue-load v15.*以后版本，需要导入此插件
	website = {
		publicPath: '/dist/',  //js，css的引用路径前缀
		basePath: path.resolve('./dist'), //基础文件路径
		host: 'localhost', //服务器IP,
		compress: true, //服务端压缩开启
		port: 8888 //端口号
	},
	exclude = /node_modules/;
//配置	
let config = {
	//入口
	entry: {
		main: './src/js/main'
	},
	//出口
	output: {
		path: website.basePath,
		publicPath: website.publicPath,
		filename: 'js/[name].js' //[name]入口什么名字，出口也是什么名字
	},
	//加载器配置
	module: {
		rules: [
			//vue loader
			{
				test:/\.vue$/,
				loader: 'vue-loader',
				options:{
					loaders:{
						css:ExtractTextPlugin.extract({
							use:'css-loader',
							fallback: 'vue-style-loader'
						})
					}
				}
			},
			//js loader
			{
				test:/\.js$/,
				loader:'babel-loader',
				exclude: exclude
			},
			//css loader
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					use: 'css-loader',
					fallback: 'style-loader'
				}),
			}, 
			//font loader
			{
				test:/\.(eot|svg|ttf|woff|woff2)\??.*$/,
				loader:'url-loader?limit=1024&outputPath=font/'
			},
			//pic loader
			{
				test:/\.(gif|jpg|png|jpeg)\??.*$/,
				loader:'url-loader?limit=1024&outputPath=images/',
				//也可以如下配置参数
				/*options:{
					limit:1024,
					outputPath:'images/',
				}*/
			},
			//html img loader
			{
				test:/\.(htm|html)$/,
				loader:'html-withimg-loader'
			},
			
		]
	},
	//插件配置
	plugins: [
		//css插件
		new ExtractTextPlugin('css/main.css'),
		new VueLoaderPlugin(),
	],
	//服务器配置
	devServer: {
		/*contentBase: website.basePath,*/
		host: website.host,
		compress: website.compress,
		port: website.port
	}
};
module.exports = config;