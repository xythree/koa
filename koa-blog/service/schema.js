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
            required: false,
            default: Date.now()
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
            required: false,
            default: Date.now()
        },
        last_modify_time: {
            type: Date,
            required: true
        }
    }
}