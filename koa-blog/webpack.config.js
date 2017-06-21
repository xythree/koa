const webpack = require("webpack")
const path = require("path")

module.exports = {
    entry: {
        index: "./static/js/index.js",
        component: "./static/js/component/index.js",
        music: "./static/js/music/index.js",
        poetry: "./static/js/poetry/index.js",
        tools: "./static/js/tools/index.js",
        word: "./static/js/word/index.js",
        demo: "./static/js/demo/index.js"
    },
    output: {
        path: path.resolve(__dirname, 'static/js/dist'),
        filename: "[name].js"
    },
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
            },
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: /mode_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" },
                    { loader: "postcss-loader" }
                ]
            }
        ]
    },
    plugins: [

    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js"
        }
    }
}