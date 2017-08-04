const { ip } = require("./../service/function")()
const mon = require("./model")

module.exports = (router, render, io) => {
    let records = []
    let _ip = ""
    let rooms = {}

    io.on("connection", async socket => {
        let roomId = socket.request.headers.referer.split("/").pop()
        let _s = socket
        let user = ""

        let _rooms = await mon.rooms.aggregate().project({
            _id: 0,
            roomId: 1,
            author: 1,
            explain: 1,
            password: 1
        })

        let fixedRooms = []

        _rooms.forEach(t => {
            fixedRooms.push(t.roomId)
            if (!rooms[t.roomId]) {
                rooms[t.roomId] = []
            }
            if (!records[t.roomId]) {
                records[t.roomId] = []
            }
        })

        _s.on("join", username => {
            user = username
            if (!user || !roomId) return
            if (!rooms[roomId]) {
                rooms[roomId] = []
            }
            if (!records[roomId]) {
                records[roomId] = []
            }

            rooms[roomId].push(user)

            _s.join(roomId)
            _s.broadcast.emit("rooms", rooms)

            if (records[roomId]) {
                records[roomId].push({
                    type: "join",
                    username: user,
                    time: Date.now()
                })

                io.to(roomId).emit("join", records[roomId], rooms[roomId])
                console.log(`${user}加入了房间${roomId}`)
            }
        })

        _s.on("message", data => {
            if (rooms[roomId].indexOf(user) === -1) return

            records[roomId].push({
                username: data.username,
                value: data.value,
                time: Date.now()
            })

            io.to(roomId).emit("message", records[roomId])
        })

        _s.on("disconnect", () => {

            if (rooms[roomId]) {
                let index = rooms[roomId].indexOf(user)

                if (index !== -1) {
                    rooms[roomId].splice(index, 1)

                    if (fixedRooms.indexOf(roomId) == -1) {
                        if (rooms[roomId].length == 0) {
                            delete rooms[roomId]
                        }
                    }

                    records[roomId].push({
                        type: "leave",
                        username: user,
                        time: Date.now()
                    })

                    io.to(roomId).emit("leave", records[roomId], rooms[roomId])

                    console.log(`${user}退出了房间${roomId}`)
                }
            }
        })

    })

    router.get("/chatroom/:id", async ctx => {
        _ip = ip(ctx)

        ctx.body = await render("chat/chatroom")
    })

    router.get("/chat/roomlist", async ctx => {

        ctx.body = await rooms
    })

    /*
    const crypto = require("crypto")
    const fs = require("fs")
    let txt = await fs.readFileSync("./static/dist/js/chat.js")
    let _sha256 = await crypto.createHash("sha256").update(txt).digest("base64")
    */

    router.get("/chat", async ctx => {


        ctx.body = await render("chat/index")
    })

    router.get("/robot", async ctx => {
        ctx.body = await render("chat/robot")
    })

    router.get("/chat/robot", async ctx => {
        let params = ctx.request.query
        let key = "6a38a3caf3484d05a174ec118b574374"
        let userid = params.username
        let info = params.info
        let result = ""

        result = await ctx.get({
            path: "http://www.tuling123.com/openapi/api",
            userid,
            key,
            info
        })

        ctx.body = await result

    })

}