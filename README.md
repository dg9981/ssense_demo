
# 项目运行
1. 项目目录下运行 `npm install`，node 我自己运行的版本 v10。
2. 若 uikit-demo 已经 link 到全局，则运行`npm link uikit-demo`，否则去 [uikit-demo](https://github.com/dg9981/uikit_demo) 项目查看如何 link uikit-demo 到全局。
3. 然后 `npm run dev` 开启开发环境。
4. http://localhost:5100 访问项目。


# 整体结构考量
- 基础组件库独立成为 lib repo，单独维护、发布 npm，开发阶段通过 npm link 关联到业务 repo。<br>
- uikit 限于时间没有 storybook 陈列组件库。在 ssense-demo/test_uikit 下建立了 uikit-demo 的测试项目。<br>
- 多 repo 开发模式未来可以用 lerna 简化首次运行。<br>
- 国际化考虑（涉及路由设计、静态服务分流、多语言文案等），这块做的重的话，后台管理就是一个大项目。<br>
- 测试用例 jest 并不是很熟，行业风气的问题，大家都不太碰这块，有需要的话 - 效率取舍 - 后续再加到自动化流程里。<br>

# 自动化工具考量
- devserver 采用了自建的 server，可有更多的 server 控制。<br>
- 使用 webpack-dev-middleware / webpack-hot-middleware / react-hot-loader 启动 HMR。<br>
- babel 启用了最新 es6 语法。<br>
- 项目扩大后，webpack 还需要进一步做自动代码拆分，根据情况还可能选择手动拆分。<br>
- 项目平台化后，根据团队规模，项目可以往微前端转。<br>
- 实际发布后，可以接入 travis 自动化构建。<br>
- eslint 涉及好几块扩展 styled / react / es6 / js / jsx 等等，考虑到这是一个公开查看项目，可能有编辑器兼容，删掉了这块。<br>

# 项目编写考量
- 三点简化日常编码（主要改进 react 效率诟病）。<br>
  1. ducks 文件模式应用，大多时候，redux 逻辑闭环相同业务会在一个文件中处理。<br>
  2. es6 广泛使用，特别是 async 简化异步编写。<br>
  3. styled-components 将 css 与 jsx 整合在一个文件里，不再额外建立文件 - 减少了文件夹的需求 - 单文件组件。<br>
- 路由时间关系，只实现了两个，意思一下。<br>
- 布局全篇采用 flex。<br>
- 移动端样式未来基本就是独立编码，不与 PC 端共享，减少 CSS 关联性。<br>

# 数据 mock
- 搜索结果模拟<br>
- 首页数据加载模拟<br>

