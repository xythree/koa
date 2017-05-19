const mg = require("./mongoose")


const schemaList = require("./schema")

let obj = {}

for (var item in schemaList) {
    obj[item] = mg.db.model(item, new mg.Schema(schemaList[item]))
}


module.exports = obj