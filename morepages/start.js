


var register = require('babel-core/register')

register({
    presets: ['stage-3']
})


//var fileName = process.argv[2] || "app"
//require('./' + fileName + '.js')

var app = require("./index.js")

module.exports = app

