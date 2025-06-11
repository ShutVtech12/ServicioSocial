const mongoose = require('mongoose')

const ArchivoSchema = mongoose.Schema({
    texto: {
        type: String,
        required: true
    },
    fechaEntregado: {
        type: Date,
        default: Date.now()
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alumno'
    },
    tareaAsignada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tarea'
    },
    estado: {
        type: Boolean
    }

})

module.exports = mongoose.model('Archivo', ArchivoSchema)