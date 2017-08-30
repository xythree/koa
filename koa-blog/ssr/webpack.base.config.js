const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

const src = ""

module.exports = {
    output: {
        path: path.resolve(src, "static/dist/js/"),
        filename: "[name].js",
        chunkFilename: "../../dist/js/[name].min.js"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                postcss: function() {
                    return [require("autoprefixer")({ browsers: ["last 5 versions"] })]
                },
                //需要 vue-loader 12.0.0+
                //extractCSS: true,
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
            "@vue": path.resolve(src, "template/vue"),
            "js": path.resolve(src, "static/js"),
            "css": path.resolve(src, "static/css"),
            "json": path.resolve(src, "static/json"),
            "vue_component": path.resolve(src, "vue_component")
        }
    }
}