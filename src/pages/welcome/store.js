import { kea } from "kea";

export default kea({
	loaders: ({ values, props }) => ({
		// 生成了 3 actions：
		// - loadWelcomeList: params => params
		// - loadWelcomeListSuccess: project => ({ project })
		// - loadWelcomeListFailure: error => ({ error })
		// 还有 2 reducers：
		// - welcomeList
		// - welcomeListLoading (true or false)
		welcomeList: {
			loadWelcomeList: () => fetch("/v1/welcome-list").then((res)=>res.json()),
		},
	}),
	actions: {
		test_async: true,			// mounted 自动发起的测试 act
		save_async: (dat) => dat,	// 5s 后数据回来，自动调用的 act
	},
	reducers: {
		test_data: [null, {
			save_async: (state, payload) => payload,
		}],
	},
	listeners: ({ actions, values, store, sharedListeners }) => ({
		// 测试的监听
		[actions.test_async]: async function(paylaod, bkp){
			let result_num = await new Promise(function(resolve){
				setTimeout(() => resolve(99), 5000);
			});
			actions.save_async(result_num);
		},
	}),
	events: ({ actions, values }) => ({
		afterMount: [actions.test_async, actions.loadWelcomeList],
	}),
});
