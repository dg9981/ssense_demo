import { hot } from 'react-hot-loader/root';	// first load
import React, { Suspense } from "react";
import Welcome from "../pages/welcome";
import Category from "../pages/category";
import GlobalRouter from "./global_router";
import { useActions, useValues } from "kea";
import styled from 'styled-components';
import Nav from "../pages/nav";


// 后续可以做供 lazy 调用的拆分模块函数
const scenes = {
	welcome: () => Welcome,
	category: () => Category,
};

const LayoutDiv = styled.div`
	min-width: 1200px;
	.foot {
		height: 100px;
	}
`;
function Layout({ children }){
	return (
		<LayoutDiv>
			<Nav></Nav>
			<div className="body">{ children }</div>
			<div className="foot"></div>
		</LayoutDiv>
	);
}

// 被包装的 view 只能 import 一次
// export default 指向其值，不指向变量
export default hot(function(){
	const { curScene, curUrlParams } = useValues(GlobalRouter);
	const Scene = scenes[curScene]();
	return (
		<Layout>
			<Scene {...curUrlParams} />
		</Layout>
	);
});
