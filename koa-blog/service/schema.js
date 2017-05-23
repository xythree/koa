module.exports = {
    Users: {
        username: {
            type: String,
            required: true
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
        date: {
            type: Date,
            required: true
        },
        lastDate: {
            type: Date,
            required: true
        }
    }
}