const webpack = require("webpack")
const path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    output: {
        path: path.resolve(__dirname, "static/dist/js/"),
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
                plugins: ["transform-vue-jsx"],
                extractCSS: true
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