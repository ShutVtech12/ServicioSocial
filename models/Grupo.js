const mongoose = require('mongoose')

const GrupoSchema = mongoose.Schema({
    grupo: {
        type: String,
        required: true,
        trim: true,
        unique: true
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