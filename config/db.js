const mongoose = require('mongoose');

// dotenv opcional en producción (solo se usa en local)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'variables.env' });
}

const conectarDB = async () => {
  try {
    console.log('Conectando a MongoDB con URI:', process.env.DB_MONGO);
    await mongoose.connect(process.env.DB_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB conectada');
  } catch (error) {
    console.log('Hubo un error al conectar a la BD');
    console.log(error);
    process.exit(1);
  }
};

module.exports = conectarDB;