const mongoose = require('mongoose')

const AlumnoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    boleta: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    grupo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo'
    }
})

module.exports = mongoose.model('Alumno', AlumnoSchema)