import { hot } from 'react-hot-loader/root';	// first load
import "whatwg-fetch";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";

import GlobalStyle from "./common/global_style";

// store
import { getContext, resetContext } from "kea";
import { routerPlugin } from "kea-router";
import { loadersPlugin } from 'kea-loaders';
import { waitForPlugin } from 'kea-waitfor';

resetContext({
	debug: process.env.NODE_ENV !== "production",
	createStore: {
		middleware: [],
		// 初始化时需要的特殊 state
		reducers: {
		},
	},
	plugins: [
		loadersPlugin({
		}),
		routerPlugin({
		}),
		waitForPlugin,
	]
});

// 测试 HMR
var App = () => <div>都吃完</div>;
var HotApp = hot(App);

// entry
ReactDOM.render(
	<Provider store={ getContext().store }>
		<GlobalStyle />
		<HotApp />
	</Provider>,
	document.getElementById("root")
);
