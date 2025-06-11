const mongoose = require('mongoose');

require('dotenv').config({path: 'variables.env'})

const conectarDB = async () => {
    console.log('URI de conexión:', process.env.DB_MONGO);
    try{
        await mongoose.connect(process.env.DB_MONGO)
        console.log('DB conectada')
    }catch(error){
        console.log('Hubo un error')
        console.log(error)
        process.exit(1) //Detiene la app
    }
}

module.exports = conectarDB