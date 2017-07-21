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

        _s.on("join", username => {
            user = username

            if (!rooms[roomId]) {
                rooms[roomId] = []
                records[roomId] = []
            }

            rooms[roomId].push(user)

            _s.join(roomId)
            _s.broadcast.emit("rooms", rooms)

            records[roomId].push({
                type: "join",
                username: user,
                time: Date.now()
            })

            io.to(roomId).emit("join", records[roomId])
            console.log(`${user}加入了房间${roomId}`)
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
                }
            }

            records[roomId].push({
                type: "leave",
                username: user,
                time: Date.now()
            })

            io.to(roomId).emit("leave", records[roomId])

            console.log(`${user}退出了房间${roomId}`)
        })

    })

    router.get("/chatroom/:id", async ctx => {
        _ip = ip(ctx)

        ctx.body = await render("chat/chatroom")
    })

    router.get("/chat/roomlist", async ctx => {

        ctx.body = await rooms
    })

    router.get("/chat", async ctx => {


        ctx.body = await render("chat/index")
    })

}