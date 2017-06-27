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
    }
}