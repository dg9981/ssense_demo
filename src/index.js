import "whatwg-fetch";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import React from "react";

import GlobalStyle from "./common/global_style";
import Layout from "./common/layout";

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
			onStart({ logic, reducerKey, actionKey }){
			},
			onSuccess({ response, logic, reducerKey, actionKey }){
			},
			onFailure({ error, logic, reducerKey, actionKey }){
			},
		}),
		routerPlugin,
		waitForPlugin,
	]
});

// entry
ReactDOM.render(
	<Provider store={ getContext().store }>
		<GlobalStyle />
		<Layout />
	</Provider>,
	document.getElementById("root")
);
