//判断发布时间与现在时间的间隔
exports.getLastTime = (creatTime) => {
    let oldTime = new Date(creatTime)
    let newTime = (new Date() - oldTime) / 1000
    let month = Math.floor(newTime / 3600 / 24 / 30)
    let day = Math.floor(newTime / 3600 / 24)
    let hours = Math.floor(newTime / 3600)
    let mins = Math.floor(newTime / 60)
    let str = ""

    if (hours === 0) {
        str = Math.max(mins, 1) + "分钟前"
    } else if (day === 0) {
        str = hours + "小时前"
    } else if (month === 0) {
        if (day == 1) {
            str = "昨天"
        } else if (day == 2) {
            str = "前天"
        } else {
            str = day + "天前"
        }
    } else {
        if (month > 12) {
            let date = new Date(creatTime)
            str = date.getFullYear() + "年" + date.getMonth() + 1 + "月" + date.getDate() + "日"
        } else {
            str = month + "月前"
        }
    }
    return str
}