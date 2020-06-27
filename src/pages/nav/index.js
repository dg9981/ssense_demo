import React, { Component, Fragment } from 'react';
import styled from "styled-components";
import {
	TextBtn,
	TitleBtn,
	Panel,
	Radios,
	Checkbox,
	Input,
	Dropdown,
	List,
	Tips
} from "uikit-demo";
import GlobalRouter from "../../common/global_router";
import data from "./data.json";

const TipsWrap = styled.div`
	position: relative;
	display: ${props => props.visible ? "block" : "none"};
	>span{
		font-size: 28px;
		cursor: pointer;
		position: absolute;
		right: 20px;
		top: 12px;
		font-weight: 100;
	}
`;
const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: nowrap;
	padding: 0 67px;
`;
const Leftwrap = styled.div`
	width: 41%;
	>a{
		margin-right: 25px;
	}
`;
const Rightwrap = styled.div`
	width: 41%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	>a{
		margin-left: 25px;
	}
`;
const Titlewrap = styled.div`
	width: 18%;
	font-size: 26px;
`;
const InputWrap = styled.div`
	border-bottom: 1px solid #111;
`;
const SelectWrap = styled.div`
	height: 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
const ListWrap = styled.div`
	font-size: 11px;
	padding: 0 15px 15px 15px;
	display: ${props => props.searchValue ? "block" : "none"}
`;







class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {
			radioValue: 1,
			searchPanelShow: false,
			searchValue: "",
			showTip: !this.getCookie("display-tips-banner"),
			dataSource: data.MEN
		};
	}
	bindFunction(event){
		// 点击其他区域时, 隐藏指定区域(cDom)
		var cDom = document.querySelector("#search-panel");
		var tDom = event.target;
		var sDom = document.querySelector("#search-btn");
		if (cDom == tDom || cDom.contains(tDom) || sDom == tDom) {
			this.setState({
				searchPanelShow: true
			})
		}
		else{
			this.setState({
				searchPanelShow: false
			})
		}
	}
	componentDidMount(){
		document.addEventListener("click", (event)=>this.bindFunction(event), false);
	}

	componentWillUnmount(){
		document.removeEventListener("click", this.bindFunction, false)
	}

	onChangeRadio(ev){
		console.log('radio checked', ev.target.value);
		const radioSelect = ev.target.value + "" == "1" ? "MEN" : "WOMEN";
		this.setState({
			radioValue: ev.target.value,
			dataSource: data[radioSelect]
		});
	};
	onSearchClick(){
		// console.log(this.state.searchPanelShow)
		// this.setState({
		// 	searchPanelShow: !this.state.searchPanelShow
		// })
	}
	onInputChange(e){
		this.setState({
			searchValue: e.target.value
		});
	}
	onCloseTips(){
		document.cookie = "display-tips-banner=1";
		this.setState({
			showTip: false
		});
	}
	getCookie(cname){
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
			var c = ca[i].trim();
			if (c.indexOf(name)==0){
				return c.substring(name.length,c.length);
			}
		}
		return "";
	}







	render(){
		const { openCategory, openWelcome, switchLang } = this.actions;
		const { curScene, curUrlParams } = this.props;
		// console.log("curScene", curUrlParams)
		const isEnglish = curUrlParams.lang == "en";
		return (
			<Fragment>
			<TipsWrap visible={this.state.showTip}>
				<Tips>SSENSE now accepts Alipay. All duties, taxes and broker fees included.</Tips>
				<span onClick={() => this.onCloseTips()}>×</span>
			</TipsWrap>
			<Wrapper>
				<Leftwrap>
					<TextBtn
						onClick={ ()=>openCategory("men") }
						disabled={this.state.searchPanelShow}
						active={curUrlParams.sex == "men"}
					>MEN</TextBtn>
					<TextBtn
						onClick={ ()=>openCategory("women") }
						disabled={this.state.searchPanelShow}
						active={curUrlParams.sex == "women"}
					>WOMEN</TextBtn>
					<TextBtn
						disabled={this.state.searchPanelShow}
					>SALE</TextBtn>
					<TextBtn
						id={"search-btn"}
						onClick={ () => this.onSearchClick() }
					>SEARCH</TextBtn>
				</Leftwrap>
				<Titlewrap>
					<TitleBtn onClick={ ()=>openWelcome() }>SSENSE</TitleBtn>
				</Titlewrap>
				<Rightwrap>
					<Dropdown title={isEnglish ? "ENGLISH" : "中文"}>
						<TextBtn onClick={ ()=>switchLang(isEnglish ? "zh" : "en") }>
							{isEnglish ? "中文" : "ENGLISH"}
						</TextBtn>
					</Dropdown>
					<TextBtn>LOGIN</TextBtn>
					<TextBtn>WISHLIST</TextBtn>
					<TextBtn>SHOPPING BAG(0)</TextBtn>
				</Rightwrap>
				<Panel
					width="300"
					top={this.state.showTip ? "107" : "52"}
					visible={this.state.searchPanelShow}
					id={"search-panel"}
				>
					<InputWrap>
						<Input
							placeholder={this.state.radioValue == "1" ? "SEARCH MEN'S COLLECTION" : "SEARCH WOMEN'S COLLECTION"}
							onChange={(e) => this.onInputChange(e) }
						></Input>
					</InputWrap>
					<SelectWrap>
						<Radios name="sex" onChange={(e) => this.onChangeRadio(e) } value={this.state.radioValue}>
							<Radios.Item value={1}>MEN</Radios.Item>
							<Radios.Item value={2}>WOMEN</Radios.Item>
						</Radios>
						<Checkbox name="sale">
							<Checkbox.Item value="Y">SALE ONLY</Checkbox.Item>
						</Checkbox>
					</SelectWrap>
					<ListWrap searchValue={this.state.searchValue}>
						<List dataSource={this.state.dataSource} searchVal={this.state.searchValue}></List>
						<div>Search for "{this.state.searchValue}<span>"</span></div>
					</ListWrap>
				</Panel>
			</Wrapper>
			</Fragment>
		)
	}
}
export default GlobalRouter(Nav);
