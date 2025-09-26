const mongoose = require('mongoose')

const TestingSchema = mongoose.Schema({
    version: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Testing', TestingSchema)