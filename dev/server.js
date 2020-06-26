const express = require("express");
const httpProxy = require("http-proxy");
const path = require("path");
const argv = require("yargs").argv;
const http = require("http");

const colors = require("colors/safe");
const debug = require("debug");
const logProxy = debug("ssdemo:proxy");
const logErr = debug("ssdemo:error");

var webpack = require("webpack");
var devmidware = require("webpack-dev-middleware");
var hotmidware = require("webpack-hot-middleware");
var compiler;
const envcfg = 	{
	servercfg: {
		port: 5100,
		proxyto: "fake-google.com",
		secure: false,
	},
};
// 需要放行的 URL 匹配
const PROXY_REGEX = [
	/^\/socket/i,
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
hmr(webpackDef);
routing();
mocking();
proxying();









//
function hmr(webpackDef){
	compiler = webpack(webpackDef);
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
	app.use(express.static(__dirname + "/../dist"));
}
function proxying(){
}
function mocking(){

}
