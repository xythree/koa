const webpack = require("webpack")
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.config.js")
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = merge(baseConfig, {
    entry: {
        client: "./entry-client.js",
        vendor: "vue"
    },
    output: {
        publicPath: "/dist/js/"
    },
    plugins: [
        // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
        // 以便可以在之后正确注入异步 chunk。
        // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
        new webpack.optimize.CommonsChunkPlugin({
            name: ["vendor", "manifest"],
            minChunks: Infinity
        }),
        // 此插件在输出目录中
        // 生成 `vue-ssr-client-manifest.json`。
        new VueSSRClientPlugin()
        //new ExtractTextPlugin({ filename: "../css/[name].[chunkhash:8].css" })
    ]
})