const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "index.html"),
    filename: "./index.html"
});
module.exports = {
    entry: path.join(__dirname, "index.js"),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
            }
        ]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        alias: {
            "styled-components": path.resolve('./node_modules/styled-components'),
            "react": path.resolve('./node_modules/react'),
            "react-dom": path.resolve('./node_modules/react-dom'),
        },
    },
    devServer: {
        port: 3001
    }
};
