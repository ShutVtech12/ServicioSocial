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
    },
    archivoUrl: {
        type: String
    },
    tipoArchivo: {
        type: String
    }

})

module.exports = mongoose.model('Archivo', ArchivoSchema)