



var test = require("ava")
var superkoa = require("superkoa")






test("测试", function* (t) {

    var res = yield superkoa(__dirname + "./../start")
        .post("/api/login")
        .send({name: "demoabc1", password: "aaaaaa"})

    
    t.is(200, res.status)

    

})









