const mongoose = require('mongoose')

const GrupoSchema = mongoose.Schema({
    clave: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    grupo: {
        type: String,
        required: true,
        trim: true,
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    profesora: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Maestra'
    }
})

module.exports = mongoose.model('Grupo', GrupoSchema)