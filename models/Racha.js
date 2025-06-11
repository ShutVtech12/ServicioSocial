const mongoose = require('mongoose')

const RachaSchema = mongoose.Schema({
    diasConse: {
        type: String,
        required: true
    },
    fechaInicio: {
        type: Date,
        default: Date.now()
    },
    lastUpdate: {
        type: Date,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
    }
})