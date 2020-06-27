import { hot } from 'react-hot-loader/root';	// first load
import React, { Suspense } from "react";
import Welcome from "../pages/welcome";
import Category from "../pages/category";
import GlobalRouter from "./global_router";
import { useActions, useValues } from "kea";


// 后续可以做供 lazy 调用的拆分模块函数
const scenes = {
	welcome: () => Welcome,
	category: () => Category,
};

function Layout({ children }){
	return (
		<div className="layout">
			<div className="nav">...</div>
			<div className="body">{ children }</div>
		</div>
	);
}

// 被包装的 view 只能 import 一次
export default hot(function(){
	const { curScene, curUrlParams } = useValues(GlobalRouter);
	const Scene = scenes[curScene]();
	return (
		<Layout>
			<Scene {...curUrlParams} />
			<a onClick={ ()=>actions.openCategory("man") }>走走走</a>
		</Layout>
	);
});
