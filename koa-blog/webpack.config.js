const webpack = require("webpack")
const path = require("path")

module.exports = {
    entry: {
        component: "./static/js/component/index.js"
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
                    }
                }
            },
            { test: /\.js$/, use: ["babel-loader"], exclude: /mode_modules/ },
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