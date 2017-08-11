const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        //vendor: ["vue", "axios"],
        index: "./static/js/index.js",
        component: "./static/js/component/index.js",
        music: "./static/js/music/index.js",
        poetry: "./static/js/poetry/index.js",
        tools: "./static/js/tools/index.js",
        word: "./static/js/word/index.js",
        login_register: "./static/js/login_register/index.js",
        markdown: "./static/js/tools/markdown.js",
        qrcode: "./static/js/tools/qrcode.js",
        articleCenter: "./static/js/admin/articleCenter.js",
        chat: "./static/js/chat/index.js",
        chatroom: "./static/js/chat/chatroom.js",
        robot: "./static/js/chat/robot.js",
        editor: "./static/js/editor/editor.js",
        demo: "./static/js/demo/index.js"
    },
    output: {
        path: path.resolve(__dirname, "static/dist/js"),
        filename: "[name].js",
        //filename: "[name].[chunkhash:8].js",
        chunkFilename: "../../dist/js/[name].min.js"
    },
    plugins: [
        /*
        //自动加载模块
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
        */
        /*
        new ExtractTextPlugin("css/[name].[contenthash:8].css"),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["demo"],
            cache: true
        })

        new webpack.optimize.CommonsChunkPlugin({
            //names: ['vendor', 'manifest']
            names: ["vendor"]
        })
        */
    ],
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                postcss: function() {
                    return [require("autoprefixer")({ browsers: ["last 5 versions"] })]
                },
                plugins: ["transform-vue-jsx"]
            }
        }, {
            test: /\.js$/,
            use: ["babel-loader"],
            exclude: /mode_modules/
        }, {
            test: /\.(css|scss)$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "sass-loader", "postcss-loader"]
            })
        }]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js",
            "@vue": path.resolve(__dirname, "template/vue"),
            "js": path.resolve(__dirname, "static/js"),
            "css": path.resolve(__dirname, "static/css"),
            "json": path.resolve(__dirname, "static/json"),
            "vue_component": path.resolve(__dirname, "vue_component")
        }
    }
}