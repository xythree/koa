const fs = require("fs")
const cheerio = require("cheerio")
const request = require("./request")()
const iconv = require("iconv-lite")
const path = require("path")
const sql = require("./model")

const { mkdirsSync } = require("./function")()


let chapter = 1
let pid = ""
    //let _src = "http://read.qidian.com/chapter/TtxVU3dYVW81/hk--Zu49t5cex0RJOkJclQ2"
let _src = "http://read.qidian.com/chapter/2R9G_ziBVg41/MyEcwtk5i8Iex0RJOkJclQ2"


request.get(_src).then(data => {
    //let _data = iconv.decode(data, "utf8")
    const $ = cheerio.load(data.body, { decodeEntities: false })

    let title = $(".book-cover-wrap h1").text()
    let imgsrc = $(".book-photo img").attr("src")
    let author = $(".book-cover-wrap h2 a").text()
    let type = $(".info-list ul li").eq(0).find("p").text()
    let nextSrc = $("#j_chapterNext").attr("href")

    if (!/^(http:|https:)/i.test(imgsrc)) {
        imgsrc = "http:" + imgsrc
    }

    request.img(imgsrc).then(data => {
        let _path = "/images/novels/"
        let _url = path.resolve("./static" + _path)
        let exname = data.headers["content-type"].split("/")[1]
        let name = imgsrc.split("/").pop() + data.headers["content-length"]

        exname = exname == "jpeg" ? "jpg" : exname

        mkdirsSync(_url)

        fs.writeFile(_url + "/" + name + "." + exname, data.body, "binary", async(err, data) => {
            let coverImg = _path + name + "." + exname

            sql.novels.create({
                title,
                author,
                type,
                coverImg
            }).then((data, err) => {
                if (!err) {
                    pid = data._id
                    loop(_src)
                }
            })

        })
    })
})


function loop(src) {
    if (!/^(http:|https:)/i.test(src)) {
        src = "http:" + src
    }
    request.get(src).then(async data => {

        const $ = cheerio.load(data.body, { decodeEntities: false })
        let title = $(".j_chapterName").text()
        let content = $(".j_readContent").html()
        let nextSrc = $("#j_chapterNext").attr("href")

        if (title && content) {
            await sql.novelContents.create({
                pid: pid,
                title: title,
                chapter: chapter,
                content: content
            }).then((data, err) => {
                console.log(chapter)
                if (!err) {
                    ++chapter
                    loop(nextSrc)
                }
            })
        } else {
            process.exit()
        }

    })

}