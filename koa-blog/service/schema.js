module.exports = {
    Users: {
        username: {
            type: String,
            required: true
        },
        nick: {
            type: String,
            required: false
        },
        detail_info: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: false
        },
        birth: {
            type: Date,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        create_time: {
            type: Date,
            required: true
        },
        level: {
            type: Number,
            required: false,
            default: 0
        },
        phone: {
            type: Number,
            require: false
        }
    },
    Article: {
        author: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        md: {
            type: String,
            required: true
        },
        create_time: {
            type: Date,
            required: true
        },
        last_modify_time: {
            type: Date,
            required: true
        },
        views: {
            type: Number,
            required: false,
            default: 0
        },
        comment_num: {
            type: Number,
            required: false
        },
        tags: {
            type: String,
            required: false
        },
        flag: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: false
        }
    },
    Comment: {
        aid: {
            type: String,
            requried: true
        },
        cid: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        create_time: {
            type: Date,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        flag: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    },
    recite: {
        uid: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        limit: {
            type: Number,
            required: false,
            default: 10
        },
        skip: {
            type: Number,
            required: false,
            default: 0
        }
    },
    missing: {
        id: {
            type: Number,
            required: false
        },
        word: {
            type: String,
            required: false
        }
    },
    pos: {
        id: {
            type: Number,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        means: {
            type: String,
            required: false
        }
    },
    means: {
        wordId: {
            type: Number,
            required: false
        },
        posId: {
            type: String,
            required: false
        },
        means: {
            type: String,
            required: false
        }
    },
    words: {
        id: {
            type: Number,
            required: false
        },
        word: {
            type: String,
            required: false
        },
        exchange: {
            type: String,
            required: false
        },
        voice: {
            type: String,
            required: false
        },
        times: {
            type: String,
            required: false
        }
    },
    novels: {
        title: {
            type: String,
            required: false
        },
        author: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        coverImg: {
            type: String,
            required: false
        }
    },
    novelContents: {
        pid: {
            type: String,
            required: false
        },
        chapter: {
            type: Number,
            required: false
        },
        title: {
            type: String,
            required: false
        },
        content: {
            type: String,
            required: false
        }
    },
    rooms: {
        roomId: {
            type: String,
            required: false
        },
        author: {
            type: String,
            required: false
        },
        explain: {
            type: String,
            required: true,
            default: ""
        },
        password: {
            type: String,
            required: true,
            default: ""
        }
    },
    chatRecords: {
        username: {
            type: String,
            required: false
        },
        value: {
            type: String,
            required: false
        },
        ip: {
            type: String,
            required: false
        },
        time: {
            type: Number,
            required: false
        },
        roomId: {
            type: String,
            required: false
        }
    },
    gu: {
        sign: {
            type: String,
            required: false
        },
        code: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        basic: {
            type: Number,
            required: false
        },
        increase: {
            type: Number,
            required: false
        },
        roe1: {
            type: String,
            required: false
        },
        roe1Des: {
            type: String,
            default: "ROE(摊薄)",
            required: false
        },
        roe2: {
            type: String,
            required: false
        },
        roe2Des: {
            type: String,
            default: "ROE(加权)",
            required: false
        },
        nir: {
            type: Number,
            required: false
        },
        nirDes: {
            type: String,
            default: "净利润增长率",
            required: false
        },
        totcurrasset: {
            type: Number,
            required: false
        },
        totliab: {
            type: Number,
            required: false
        },
        totmktcap: {
            type: Number,
            required: false
        },
        negotiablemv: {
            type: Number,
            required: false
        }
    },
    stockData: {
        pid: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        time: {
            type: String,
            required: false
        },
        //现金流量表
        biznetcflow: { //经营活动产生的现金流净额
            type: Number,
            required: false
        },
        acquassetcash: { //资本开支(购建固定资产、无形资产和其他长期资产)
            type: Number,
            required: false
        },
        netprofit: { //现金流量表里的净利润
            type: Number,
            required: false
        },
        //综合损益表
        parenetp: { //归属于母公司所有者的净利润
            type: Number,
            required: false
        },
        //资产负债表
        totcurrasset: { //流动资产合计
            type: Number,
            required: false
        },
        fixedassenet: { //固定资产净额
            type: Number,
            required: false
        },
        righaggr: { //所有者权益(或股东权益)合计-净资产
            type: Number,
            required: false
        },
        curfds: { //货币资金
            type: Number,
            required: false
        },
        shorttermborr: { //短期借款
            type: Number,
            required: false
        },
        longborr: { //长期借款
            type: Number,
            required: false
        },
        bdspaya: { //应付债券
            type: Number,
            required: false
        }
    }
}