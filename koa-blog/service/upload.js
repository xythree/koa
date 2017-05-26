const inspect = require("util").inspect
const path = require("path")
const fs = require("fs")
const Busboy = require("busboy")



function mkdirsSync(dirname) {

    if (fs.existsSync(dirname)) {
        return true
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname)
            return true
        }

    }

}



function uploadFile(ctx, options) {
    let req = ctx.req
    let res = ctx.res
    let busboy = new Busboy({ headers: req.headers })

    let fileType = options.fileType || "common"
    let filePath = path.join(options.path, fileType)
    let mkdirResult = mkdirsSync(filePath)

    return new Promise((resolve, reject) => {
        let result = {
            state: false
        }
        let formData = {}

        busboy.on("file", function(filedname, file, filename, encoding, mimetype) {
            let fileName = Math.random().toString(16).substr(2) + path.extname(filename)
            let _uploadFilePath = path.join(filePath, fileName)
            let saveTo = path.join(_uploadFilePath)

            file.pipe(fs.createWriteStream(saveTo))

            file.on("end", function() {
                result.state = "SUCCESS"
                result.url = options.originalPath.replace("/static", "") + "/" + fileType + "/" + fileName
                result.title = fileName
                result.original = formData.name
                result.type = mimetype
                result.size = formData.size

                resolve(result)
            })
        })

        busboy.on("field", function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            formData[fieldname] = inspect(val)
        })

        busboy.on("finish", () => {
            resolve(result)
        })

        busboy.on("error", err => {
            reject(result)
        })

        req.pipe(busboy)
    })
}



module.exports = {
    uploadFile
}