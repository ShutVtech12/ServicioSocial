const mongoose = require('mongoose');

// Carga dotenv solo en desarrollo (opcional)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: 'variables.env' });
}

const conectarDB = async () => {
    console.log('Entorno completo:', process.env);
    console.log("------------------------------------------------------")
    console.log('DB_MONGO:', process.env.DB_MONGO);
  try {
    const URI = process.env.DB_MONGO;
    if (!URI) {
      console.error('❌ ERROR: DB_MONGO no está definida en process.env');
      process.exit(1);
    }

    console.log('Conectando a MongoDB con URI:', URI);
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.log('❌ Hubo un gran error al conectar a la BD');
    console.error(error);
    process.exit(1);
  }
};

module.exports = conectarDB;