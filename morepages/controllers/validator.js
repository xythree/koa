

var codemsg = require("./codemsg")


module.exports = {
    empty(str) {
        var result = {
            status: false,
            msg: codemsg.empty.error
        }
        if (str != "") {
            result.status = true
            result.msg = codemsg.empty.success
        }
        return result
    },
    username(str) {
        var result = {
            status: false,
            msg: codemsg.username.error
        }
        if (/^[\w,_,\d]{5,20}$/.test(str)) {
            result.status = true
            result.msg = codemsg.username.success
        }
        return result
    },
    phone(num) {
        var result = {
            status: false,
            msg: codemsg.phone.error
        }
        if (/^\d{11}$/.test(num)) {
            result.status = true
            result.msg = codemsg.phone.success
        }
        return result
    },
    password(str) {
        var result = {
            status: false,
            msg: codemsg.password.error
        }
        if (str.length >= 6 && /[^\s]/.test(str)) {
            result.status = true
            result.msg = codemsg.password.success
        }
        return result
    },
    email(str) {
        var result = {
            status: false,
            msg: codemsg.email.error
        }
        if (/^[\w,\d]{5,}@[\d,\w]+(\.\w){1,2}$/.test(str)) {
            result.status = true
            result.msg = codemsg.email.success
        }
        return result
    }
}





