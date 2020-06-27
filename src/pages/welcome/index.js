import React, { Fragment } from "react";
import { useActions, useValues } from "kea";
import GlobalRouter from "../../common/global_router";
import styled from "styled-components";
import { TextBtn } from "uikit-demo";
import store from "./store";

const BigNav = styled.div`
	width: 100%;
	height: 212px;
	margin: 20px 0 50px 0;
	position: relative;
	img {
		display: block;
		width: 100%;
		margin: 0 30px;
	}
	{/* TextBtn 就是 a 做的 */}
	a {
		display: inline-block;
		font-size: 36px;
		line-height: 50px;
		height: 50px;
		width: 50%;
		text-align: center;
		margin: 0;
	}
`;

const Blocks = styled.div`
	position: relative;
	width: calc(100% - 120px);
	margin: 0 60px;
	{/* box-sizing padding 影响 flex 自动布局，宽分配问题 */}
	{/* box-sizing: border-box; */}
	{/* height: 488px; */}
	display: flex;
`;

// 直接 styled(comp) 竟然没用，只能另外造一个壳子
const BlockDiv = styled.div`
	flex: 1;
	position: relative;
	min-width: ${props => (props.col == 3 ? "330px" : "500px")};
	margin: 0 10px 20px 0;
	img {
		width: 100%;
		padding-bottom: 10px;
	}
	label {
		display: inline-block;
		width: 5em;
		font-size: 12px;
		line-height: 30px;
		height: 30px;
		vertical-align: bottom;
	}
	span {
		display: inline-block;
		font-size: 18px;
		line-height: 30px;
		height: 30px;
		width: calc(100% - 5em);
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	p {
		width: 100%;
		font-size: 18px;
		line-height: 30px;
		height: 30px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;
const Block = function(props){
	return (
		<BlockDiv col={props.col}>
			<img src={props.figure} alt="" />
			<label>{props.label}</label>
			<span>{props.title}</span>
			<If condition={props.desc}>
				<p>{props.desc}</p>
			</If>
		</BlockDiv>
	);
};

// logic wrap 仅限 class comp
export default function(){
	let { switchLang, openCategory } = useActions(GlobalRouter);
	let { curUrlParams } = useValues(GlobalRouter);
	// 使用 hooks 会促使 logic build & mount
	let { test_data, welcomeList } = useValues(store);	// 数据可能还没回来
	console.log("test_data", test_data, welcomeList, curUrlParams.lang);
	let mappingWelcomeList = _.map(welcomeList, function(witem){
		return {
			figure: witem.figure,
			label: witem.label[curUrlParams.lang],
			title: witem.title[curUrlParams.lang],
			desc: witem.desc[curUrlParams.lang],
		};
	});
	return (
		<Fragment>
			<BigNav>
				<img src="https://res.cloudinary.com/ssenseweb/image/upload/w_0.1,q_40,f_auto,dpr_auto/v1592920277/tyulxscypakosufbaiou.gif"/>
				<TextBtn onClick={ ()=>openCategory("man") }>选购男士产品</TextBtn>
				<TextBtn onClick={ ()=>openCategory("woman") }>选购女士产品</TextBtn>
			</BigNav>
			<If condition={ welcomeList }>
				<Blocks>
					<Block { ...mappingWelcomeList[0] }></Block>
					<Block { ...mappingWelcomeList[1] }></Block>
				</Blocks>
				<Blocks>
					<Block { ...mappingWelcomeList[2] } col={ 3 }></Block>
					<Block { ...mappingWelcomeList[3] } col={ 3 }></Block>
					<Block { ...mappingWelcomeList[4] } col={ 3 }></Block>
				</Blocks>
			</If>
			{/* <a onClick={ ()=>{
				switchLang("en");
			} }>点击测试路由判断</a> */}
		</Fragment>
	);
};
