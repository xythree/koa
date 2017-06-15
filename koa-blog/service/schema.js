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
        }
    }
}