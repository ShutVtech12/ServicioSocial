const mongoose = require('mongoose');

// Carga dotenv solo en desarrollo (opcional)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'variables.env' });
}

const conectarDB = async () => {
  try {
    const URI = process.env.DB_MONGO;
    if (!URI) {
      console.error('❌ ERROR: DB_MONGO no está definida en process.env');
      process.exit(1);
    }
    await mongoose.connect(URI);

    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.log('❌ Hubo un gran error al conectar a la BD');
    console.error(error);
    process.exit(1);
  }
};

module.exports = conectarDB;