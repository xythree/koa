const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    entry: {
        index: "./static/js/index.js",
        component: "./static/js/component/index.js",
        music: "./static/js/music/index.js",
        poetry: "./static/js/poetry/index.js",
        tools: "./static/js/tools/index.js",
        word: "./static/js/word/index.js",
        login_register: "./static/js/login_register/index.js",
        demo: "./static/js/demo/index.js"
    },
    output: {
        path: path.resolve(__dirname, "static/dist/js"),
        //filename: "js/[name].js"
        filename: "[name].js",
        chunkFilename: "../../dist/js/[name].min.js"
    },
    plugins: [
        /*
        new ExtractTextPlugin("css/[name].css"),
        new HtmlWebpackPlugin({
            inject: true,
            chunks: ["demo"],
            minify: true,
            cache: true,
            hash: true
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
                fallback: 'style-loader',
                use: ["css-loader", "sass-loader", "postcss-loader"]
            })
        }]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js"
        }
    }
}