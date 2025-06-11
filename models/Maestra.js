const mongoose = require('mongoose')

const MaestraSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        //trim es para quitar los espacios que el usuario ingrese al inicio o al final
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        //Es un valor unico para cada usuario
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = mongoose.model('Maestra', MaestraSchema)