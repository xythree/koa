const inspect = require("util").inspect
const path = require("path")
const fs = require("fs")
const Busboy = require("busboy")
const { mkdirsSync } = require("./function")()

function uploadFile(ctx, options) {
    let req = ctx.req
    let res = ctx.res
    let busboy = new Busboy({ headers: req.headers })
    let fileType = options.fileType || "common"
    let filePath = path.join("./", options.originalPath, fileType)
    let mkdirResult = mkdirsSync(filePath)

    return new Promise((resolve, reject) => {
        let result = {
            state: false
        }

        busboy.on("file", function(filedname, file, filename, encoding, mimetype) {
            if (!/image/.test(mimetype)) {
                result.code = 0
                result.state = "filetype error"
                resolve(result)
                return
            }

            let fileName = Math.random().toString(16).substr(2) + path.extname(filename)
            let _uploadFilePath = path.join(filePath, fileName)
            let saveTo = path.join(_uploadFilePath)

            file.pipe(fs.createWriteStream(saveTo))

            file.on("end", function() {
                result.state = "SUCCESS"
                result.url = saveTo.replace("static", "")
                result.title = fileName
                result.type = mimetype
                    /*
                        state => "" //上传状态，上传成功时必须返回"SUCCESS"
                        url => "" //返回的地址
                        title => "" //新文件名
                        original => "" //原始文件名
                        type => "" //文件类型
                        size => "" //文件大小
                    */
                resolve(result)
            })
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