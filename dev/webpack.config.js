const HtmlWebpackPlugin = require("html-webpack-plugin");
const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");

const tmpVersion = "local_" + (Math.floor(Math.random() * 1e6)).toString();
const VERSION = process.env.TAG_NAME || tmpVersion;		// 传自定义参数
const argv = require("yargs").argv;
const isPrd = argv.env === "production";


module.exports = function(envcfg){
	let setEnvVariable = (key, value) => {
		const env = {};
		env[key] = JSON.stringify(value);
		return {
			plugins: [new webpack.DefinePlugin(env)],
		};
	};

	let setHtmlBuilder = ({
		filename,
		template,
		inject = false,
	}) => {
		return {
			plugins: [
				new HtmlWebpackPlugin({
					filename,		// 输出地址
					template,		// 模板路径
					// hash: true,
					cache: true,	// 确定文件变更才更新 hash
					inject: inject,	// 是否注入 js

					// 不能用 true，文档有误！
					minify: isPrd
						? {
							removeComments: true,
							collapseWhitespace: true,
							minifyJS: true,
							minifyCSS: true
						}
						: false,

					// 自定义 opt
					version: VERSION,
					isPrd,
				})
			]
		};
	};

	var setFonts = ({ publicPath }) => {
		var options = {
			// 相对本文件路径
			outputPath: "../dist/font/",
			name: "[name].[hash:6].[ext]"
		};
		publicPath && (options.publicPath = publicPath);
		return {
			test: /\.(eot|ttf|woff|woff2|svg)$/,
			use: [
				// "url-loader",    // 这个也能解决，不如 file-loader 贴切
				{
					loader: "file-loader",
					options
				}
			]
		};
	};

	var setImages = () => {
		var options = {
			// 相对本文件路径
			outputPath: "../dist/img/",
			name: "[name].[hash:6].[ext]"
		};
		return {
			module: {
				rules: [{
					test: /\.(png|jpg|gif)$/,
					use: {
						loader: "file-loader",
						options
					},
				}]
			}
		};
	};

	let commonCfg = merge([
		setImages(),
		{
			mode: argv.env,
			bail: true,

			resolve: {
				alias: {
					"@": path.resolve("./src/"),	// 相对运行目录，不是本 js 目录
					// 防止多个运行时
					"styled-components": path.resolve('./node_modules/styled-components'),
					"react": path.resolve('./node_modules/react'),
					"react-dom": path.resolve('./node_modules/react-dom'),
				}
			},

			//
			module: {
				rules: [
					// HtmlWebpackPlugin 需要此 loader
					{
						test: /\.html$/,
						use: [ "html-loader" ]
					},
					{
						test: /\.(js|jsx)$/,
						use: "babel-loader",
					}
					// 变量注入
					// {
					// 	test: [
					// 		path.resolve("src/jsfile"),
					// 	],
					// 	use: [
					// 		"imports-loader",
					// 		"?__VERSION__=>\"" + VERSION + "\"",
					// 	].join("")
					// },
				],
			},

			plugins: [
				// 特别蠢，只能注入文件
				// 按需注入的
				new webpack.ProvidePlugin({
					_: "underscore",
				}),
				new webpack.NamedModulesPlugin(),
			],
		},
	]);

	let devCfg = merge([
		commonCfg,
		{
			devtool: "source-map",
			module: {
				rules: [
					setFonts({
					}),
				]
			},
			plugins: [
				new webpack.HotModuleReplacementPlugin(),
			]
		}
	]);

	// production 才执行，以免影响速度
	let prdCfg = merge([
		commonCfg,
		setEnvVariable("process.env.NODE_ENV", "production"),
		{
			// 关闭
			// devtool: "source-map",
			// plugins: [
			// 	new webpack.optimize.UglifyJsPlugin({
			// 		test: /\.js$/i,
			// 		compress: false,
			// 		// compress: {
			// 		// 	warnings: false,
			// 		// 	properties: false,		// false 不使用 . 访问属性
			// 		// },
			// 		output: {
			// 			screw_ie8: true,		// true 支持 ie8
			// 			comments: true,
			// 			beautify: true,			// true 不压缩
			// 			quote_keys: true,		// true 保留属性 key 定义时的引号
			// 			source_map: "eval",
			// 		},
			// 	})
			// ],
			module: {
				rules: [
					// 不加 publicPath
					setFonts({}),
				]
			}
		}
	]);

	let app = merge([
		setHtmlBuilder({
			template: "./src/index.html",	// 输入相对执行路径
			filename: "../dist/index.html",	// 输出相对本文件路径
			inject: true,	// "head" "body" true false
		}),
		{
			name: "app",	// 匹配 client?name=app
			entry: ["react-hot-loader/patch", "./src/index.js"],	// 相对执行路径
			output: {
				filename: "index.js",		// 将写入 html src
				publicPath: "/",			// 将写入 html src
				path: path.resolve("../dist/"),		// 相对本文件路径
			}
		}
	]);
	app = isPrd
		? app
		: merge([
			app,
			{ entry: ["webpack-hot-middleware/client?name=app"] }
		]);

	return isPrd
		? [ merge([app, prdCfg]) ]
		: [ merge([app, devCfg]) ];
};
