let BMP24 = require('gd-bmp').BMP24


module.exports = (router, render) => {

    let _w = 100
    let _h = 40

    //仿PHP的rand函数
    function rand(min, max) {
        return Math.random() * (max - min + 1) + min | 0 //特殊的技巧，|0可以强制转换为整数
    }
    //制造验证码图片
    function makeCapcha() {
        let img = new BMP24(_w, _h)
        img.drawCircle(rand(0, _w), rand(0, _h), rand(10, _h), rand(0, 0xffffff))
            //边框
        img.drawRect(0, 0, img.w - 1, img.h - 1, 0)
        img.fillRect(0, 0, _w, _h, 0xeeeeee)
            //img.fillRect(rand(0, _w), rand(0, _h), rand(10, 35), rand(10, 35), rand(0, 0xffffff))
        img.drawLine(rand(0, _w), rand(0, _h), rand(0, _w), rand(0, _h), rand(0, 0xffffff))

        //画曲线
        let w = img.w / 2
        let h = img.h
        let color = rand(0, 0xffffff)
        let y1 = rand(-5, _h) //Y轴位置调整
        let w2 = rand(10, 15) //数值越小频率越高
        let h3 = rand(4, 6) //数值越小幅度越大
        let bl = rand(1, 5)
        for (let i = -w; i < w; i += 0.1) {
            let y = Math.floor(h / h3 * Math.sin(i / w2) + h / 2 + y1)
            let x = Math.floor(i + w)
            for (let j = 0; j < bl; j++) {
                img.drawPoint(x, y + j, color)
            }
        }

        let p = "ABCDEFGHKMNPQRSTUVWXYZ0123456789"
        let str = ''
        for (let i = 0; i < 4; i++) {
            str += p.charAt(Math.random() * p.length | 0)
        }

        let fonts = [BMP24.font8x16, BMP24.font12x24, BMP24.font16x32]
        let x = 15,
            y = 8
        for (let i = 0; i < str.length; i++) {
            let f = fonts[Math.random() * fonts.length | 0]
            y = 8 + rand(-10, _w / 12)
            img.drawChar(str[i], x, y, f, rand(0, 0x999999))
            x += f.w + rand(2, _h / 5)
        }
        return { img, str }
    }

    router.get("/verify", async ctx => {
        let { img, str } = makeCapcha()

        ctx.cookies.set("verify", str, {
            maxAge: 5 * 60 * 1000
        })

        ctx.set("Content-Type", "image/bmp")

        ctx.body = await img.getFileData()
    })

}