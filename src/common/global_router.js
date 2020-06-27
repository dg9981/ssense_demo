import { hot } from 'react-hot-loader/root';	// first load
import { kea, useActions, useValues, encodeParams, decodeParams, combineUrl } from "kea";
import { router } from "kea-router";
import Welcome from "../pages/welcome";
import Category from "../pages/category";
import React, { Suspense } from "react";

// 1. 测试 kea 路由
// 2. 强转 / 和 /index.html


// 后续可以做供 lazy 调用的拆分模块函数
const scenes = {
	welcome: () => Welcome,
	category: () => Category,
};
// 路由映射模块
// 静态服务强制转换非法路由到 welcome
// 404 仅限于需要查询的 URL
const routes = {
	"/:lang/welcome": "welcome",
	"/:lang/category/:sex": "category",
};
// 路由逻辑
const sceneLogic = kea({
	// 为每个 routes 设定一个 action
	// 自动调用
	urlToAction: ({ actions }) => {
		const mapping = {};
		for(const [path, scene] of Object.entries(routes)){
			mapping[path] = params => actions.setScene(scene, params);
		}
		// 强转两个特殊路由
		mapping["/"] = () => actions.toDefault();
		mapping["/index.html"] = () => actions.toDefault();
		return mapping;
	},
	// 定义可跳转路由的操作
	// 自动监听对应的 actions
	actionToUrl: ({ values }) => ({
		openCategory: ({sex}) => "/" + values.curUrlParams.lang + "/category/" + sex,
		openWelcome: () => "/" + values.curUrlParams.lang + "/welcome",
	}),
	actions: {
		openWelcome: () => true,
		openCategory: (sex) => ({sex}),
		setScene: (scene, params) => ({ scene, params }),
		// 直接外面 useActions(router) 会报错
		toDefault: () => {
			router.actions.replace("/zh/welcome");
		},
	},
	reducers: {
		// 当前模块
		curScene: [null, {
			setScene: (_, payload) => payload.scene,
		}],
		// 当前 URL 参数
		curUrlParams: [{}, {
			setScene: (_, payload) => payload.params || {},
		}],
	},
	listeners: ({ actions, values, store, sharedListeners }) => ({
		// 监听路由 debug
		[router.actions.locationChanged]: ({ pathname, search, hash, method }) => {
			console.log({ pathname, search });
		},
	}),
});

function Layout({ children }){
	return (
		<div className="layout">
			<div className="nav">...</div>
			<div className="body">{ children }</div>
		</div>
	);
}

function Scenes({ actions, ...values }){
	// 直接使用 kea logic 不安全
	// const { curScene, curUrlParams } = useValues(sceneLogic);
	const { curScene, curUrlParams } = values;
	const Scene = scenes[curScene]();
	return (
		<Layout>
			<Scene {...curUrlParams} />
			<a onClick={ ()=>actions.openCategory("man") }>走走走</a>
		</Layout>
	);
};

// wrap 才能安全使用 kea
export default sceneLogic( hot(Scenes) );

