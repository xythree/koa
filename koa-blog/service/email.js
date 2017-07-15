const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: "163",
    secureConnection: true,
    por: 465,
    auth: {
        user: "邮箱",
        pass: "密码"
    }
})

let mailOptions = {
    from: "xythree1@163.com",
    to: "402592379@qq.com",
    subject: "Hello",
    text: "Hello World",
    html: "<b>Hello World</b>"
}

transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Message sent: " + info.response)
    }
})