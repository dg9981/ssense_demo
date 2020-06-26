import React, { Fragment } from 'react';
import { render } from 'react-dom';
import {
	TextBtn,
	TitleBtn,
	Tips,
	Loading,
	Radios,
	Input,
	Checkbox,
	Panel,
	Dropdown
} from "uikit-demo";



class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			radioValue: 1,
			checkboxVal: ["11", "22"]
		};
	}
	onChange(ev){
		console.log('radio checked', ev.target.value);

		this.setState({
			radioValue: ev.target.value,
		});
	};
	onCheckboxChange(ev){
		console.log(ev)
	}
	render(){
		return (
			<Fragment>
				<Tips>SSENSE now Accept</Tips>
				<TextBtn>你好</TextBtn>
				<TitleBtn>SSENSE</TitleBtn>
				<Loading></Loading>
				<Radios name="sex" onChange={(e) => this.onChange(e) } value={this.state.radioValue}>
					<Radios.Item value={1}>MEN</Radios.Item>
					<Radios.Item value={2}>WOMEN</Radios.Item>
				</Radios>
				<Input placeholder="Input a number..."></Input>
				<Checkbox name="se" onChange={(e) => this.onCheckboxChange(e) }>
					<Checkbox.Item value="11">11</Checkbox.Item>
					<Checkbox.Item value="22">22</Checkbox.Item>
					<Checkbox.Item value="33">33</Checkbox.Item>
				</Checkbox>
				<Panel width="400">
					<Tips>SSENSE now Accept </Tips>
					<TextBtn>你好</TextBtn>
				</Panel>
				<Dropdown title="下拉菜单">
					<TextBtn> 中文 </TextBtn>
					<TextBtn> 日语 </TextBtn>
				</Dropdown>
			</Fragment>
		)
	}
}

render(<App />, document.getElementById("root"));
