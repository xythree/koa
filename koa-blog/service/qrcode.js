const fs = require("fs")
const qr = require('qr-image')
const { base64 } = require("./function")()

module.exports = () => {

    return async({ text, size = 6, type = "png", margin = 1, path = "./static/qrcode/" }) => {

        return new Promise((resolve, reject) => {
            let _qr = qr.image(text, {
                type: type,
                margin: margin,
                size: size
            })

            let imgName = +(new Date()) + '' + Math.ceil(Math.random() * 89 + 10)

            imgName = path + `${size*27}x${size*27}_${imgName}.${type}`

            let qr_pipe = _qr.pipe(fs.createWriteStream(imgName))

            qr_pipe.on('error', function(err) {
                console.log(err)
                reject(err)
            })

            qr_pipe.on('finish', function() {
                let str = base64(imgName, type)

                fs.unlinkSync(imgName)
                resolve(str)
            })
        })
    }
}