import React from "react";
import { useActions, useValues } from "kea";
import GlobalRouter from "../../common/global_router";
import styled from "styled-components";

const CategoryDiv = styled.div`
	width: 100%;
	height: 100%;
	font-size: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	span {
		margin-top: -10%;
	}
`;

export default function(){
	let { curScene, curUrlParams } = useValues(GlobalRouter);
	return (
		<CategoryDiv>
			<span>{ curScene + " : " + curUrlParams.lang + " / " + curUrlParams.sex }</span>
		</CategoryDiv>
	);
};
