const mongoose = require('mongoose')

const RachaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    diasConse: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
    }
})

module.exports = mongoose.model('Racha', RachaSchema)