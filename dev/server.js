const express = require("express");
// const MemoryFileSystem = require("memory-fs");
const httpProxy = require("http-proxy");
const path = require("path");
const argv = require("yargs").argv;
const http = require("http");
const fetch = require("node-fetch");

const colors = require("colors/safe");
const debug = require("debug");
const logProxy = debug("ssdemo:proxy");
const logErr = debug("ssdemo:error");

var webpack = require("webpack");
var devmidware = require("webpack-dev-middleware");
var hotmidware = require("webpack-hot-middleware");
var compiler;
var memfs;
const envcfg = 	{
	servercfg: {
		port: 5100,
		proxyto: "fake-google.com",
		secure: false,
	},
};
// 需要放行的 URL 匹配
const PROXY_REGEX = [
	/^\/v1/i,
];

const targetHost = envcfg.servercfg.proxyto;
const proxyTarget = `http://${targetHost}`;		// server to server 不搞 secure
console.log(`\nbackend: ${proxyTarget}`);
const proxy = httpProxy.createProxyServer();
proxy.on("error", e => logErr(e));

const app = express();
const port = envcfg.servercfg.port;
let server = http.createServer(app).listen(
	port,
	() => {
		console.log(`http SERVER running @: http://localhost:${port}/\n`);
	}
);
server.on("error", e => logErr(e));

console.log(colors.cyan("\nBUILDING...\n"));
const getWebpackTasks = require("./webpack.config");
const webpackDef = getWebpackTasks(envcfg);
// 在 dev server 之前，否则就被她们拦截了
// 放前端吧
// app.get(["/"], (req, res, next) => {
// 	res.redirect("/zh/welcome");
// });
hmr(webpackDef);
routing();
mocking();
proxying();









//
function hmr(webpackDef){
	compiler = webpack(webpackDef);
	// memfs = new MemoryFileSystem();
	// compiler.outputFileSystem = memfs;
	app.use(devmidware(compiler, {
		watchOptions: {
			ignored: /node_modules/
		},
	}));
	app.use(hotmidware(compiler, {
		// log: console.log,
		// path: "/__webpack_hmr",
		// heartbeat: 2000
	}));
}
function routing(){
	// 静态目录
	app.use(express.static(__dirname + "/../dist"));	// dir 相对本文件路径
	// 合法路由
	app.get([
		"/:lang/category/:sex",
		"/:lang/welcome",
	], function(req, res, next){
		// webpack 内存文件 memfs 竟然读取不到，原因不明
		fetch(req.protocol + "://" + req.headers.host + "/index.html")
		.then(res => res.text())
		.then(content => {
			res.setHeader("Content-Type", "text/html;charset=utf-8");
			res.end(content);
		});
	});
	// 非法路径
	app.get(["*"], (req, res, next) => {
		res.redirect("/zh/welcome");
	});
}
function proxying(){
}
function mocking(){
	app.get("/v1/welcome-list", function(req, res, next){
		var data = [{
			pic: "",
			title: {
				zh:"",
				en:"",
			},
		}, {
			pic: "",
			title: {
				zh:"",
				en:"",
			},
		}];
		res.setHeader("Content-Type", "application/json;charset=utf-8");
		res.end(JSON.stringify(data));
	});
}
