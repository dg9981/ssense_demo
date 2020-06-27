import { kea, useActions, useValues, encodeParams, decodeParams, combineUrl } from "kea";
import { router } from "kea-router";

// 路由映射模块
// 静态服务强制转换非法路由到 welcome
// 404 仅限于需要查询的 URL
const routes = {
	"/:lang/welcome": "welcome",
	"/:lang/category/:sex": "category",
};

// 路由逻辑
// 导出，供外部使用 useValue(sceneLogic); 判断当前位置
// 供外部使用便捷的 URL 切换 useActions(sceneLogic);
export default kea({
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
		switchLang: ({lang}) => location.pathname.replace(/zh|en/, lang),
		openCategory: ({sex}) => {
			return "/" + values.curUrlParams.lang + "/category/" + sex;
		},
		openWelcome: () => "/" + values.curUrlParams.lang + "/welcome",
	}),
	actions: {
		switchLang: (lang) => ({lang}),
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

