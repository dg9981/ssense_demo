import React, { Fragment } from "react";
import { useActions, useValues } from "kea";
import GlobalRouter from "../../common/global_router";

export default function(){
    let { switchLang } = useActions(GlobalRouter);
    return (
        <Fragment>
            <div>welcome</div>
            <a onClick={ ()=>{
                switchLang("en");
            } }>点击测试路由判断</a>
        </Fragment>
    );
};
