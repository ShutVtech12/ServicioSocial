const mongoose = require('mongoose')

const TareaSchema = mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFinal: {
        type: Date,
        required: true
    },
    repetible: {
        type: String,
        required: true,
        trim: true
    },
    diasRepetible: {
        type: String,
        required: true,
        trim: true
    },
    grupoPertenece: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Grupo'
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maestra'
    }
})

module.exports = mongoose.model('Tarea', TareaSchema)