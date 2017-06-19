module.exports = {
    cookie: {
        conts: "_keep_",
        get: function(key) {
            var strcookie = document.cookie
            if (strcookie != "") {
                key = this.conts + key
                var arrcookie = strcookie.split("; ")
                for (var i = 0; i < arrcookie.length; i++) {
                    var arr = arrcookie[i].split("=")
                    if (arr[0] == key) {
                        return arr[1] || ""
                    }
                }
            }
            return ""
        },
        set: function(key, value, expires, domain) {
            var ep = ''
            var date = new Date()
            var domain = typeof domain === 'boolean' ? this.getDomain() : (domain ? domain : '')
            key = this.conts + key
            expires = (expires || 365) * 24 * 3600
            date.setTime(date.getTime() + expires)
            ep = date.toGMTString()
            domain = domain ? (';domain=' + domain) : ''
            document.cookie = key + "=" + value + ";expires=" + ep + domain + ";path=/"
        },
        clear: function() {
            var _this = this
            this.forEach(this.allKey(), function() {
                _this.remove(this.okey)
            })
        },
        remove: function(key) {
            this.set(key, '', -1)
        },
        getDomain: function() {
            var domain = document.domain
            var index = domain.lastIndexOf('.')
            index = domain.substring(0, index).lastIndexOf('.')
            if (index == -1) {
                return domain
            }
            return domain.substring(index + 1)
        },
        forEach: function(arr, fn) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (fn.call(arr[i], i) === false) {
                    break;
                }
            }
        },
        allKey: function() {
            var Conts = this.conts
            var ck = document.cookie.split(';')
            var arr = []
            var len = Conts.length
            this.forEach(ck, function() {
                var _this = this.replace(/^\s*/, '')
                var str = _this.substr(0, len)
                if (str === Conts) {
                    var temp = _this.split('=')
                    var obj = {}
                    obj[temp[0]] = temp[1]
                    obj.key = temp[0]
                    obj.okey = temp[0].substr(len)
                    arr.push(obj)
                }
            })
            return arr
        },
        key: function(i) {
            var temp
            var allKey = this.allKey()[i]
            for (var i in allKey) {
                temp = allKey[i]
            }
            return temp
        },
        len: function() {
            return this.allKey().length
        }
    }
}