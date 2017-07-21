class chatRoom {

    constructor(io, mon, _ip, roomId) {
        this.rooms = []
        this.records = []
        this.user = []

        io.on("connection", async socket => {

            console.log(socket.request.headers.referer)

            socket.join("room" + this.rooms.length, () => {
                this.rooms.push(socket.id)

                mon.chatRecords.aggregate([{
                    $match: {
                        roomId: roomId
                    }
                }, {
                    $project: {
                        _id: 0,
                        username: 1,
                        value: 1,
                        time: 1
                    }
                }]).then(d => {
                    this.records = d
                    socket.emit("client say", this.records)
                })
            })

            socket.on("userlist", data => {
                this.user.push({
                    username: data.username
                })

                socket.emit("client userlist", this.user)
            })

            socket.on("say", data => {
                let time = Date.now()

                this.records.push({
                    username: data.username,
                    value: data.value,
                    time: time
                })

                mon.chatRecords.create({
                    username: data.username,
                    value: data.value,
                    time: time,
                    ip: _ip,
                    roomId: socket.id
                }).then(d => {
                    socket.emit("client say", this.records)
                    socket.broadcast.emit("client say", this.records)
                })

            })


        })

    }

}

exports.chatRoom = chatRoom