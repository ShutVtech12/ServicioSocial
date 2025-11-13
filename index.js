const { ApolloServer } = require('apollo-server-express'); // 🚨 CAMBIO CLAVE: Usar apollo-server-express
const express = require('express'); // 🚨 Necesitas importar express
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js');

const typeDefs = require('./db/schema')
const resolvers = require('./db/resolvers')
const conectarDB = require('./config/db')
const jwt = require('jsonwebtoken')
const { Storage } = require('@google-cloud/storage');

// 1. Cargar variables de entorno: Debe ir al inicio para que process.env esté disponible.
require('dotenv').config({ path: 'variables.env' });

const serviceKeyContent = process.env.GOOGLE_CREDENTIALS;
const bucketName = 'tu-nombre-de-bucket-unico'; // ⬅️ REEMPLAZA con el nombre de tu Bucket de GCS

// === CONFIGURACIÓN DE GOOGLE CLOUD STORAGE ===
if (!serviceKeyContent) {
    throw new Error('La variable de entorno GOOGLE_CREDENTIALS no está definida.');
}

// 1. Parsear el contenido JSON de la variable
let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceKeyContent);
} catch (error) {
    console.error('Error al parsear GOOGLE_CREDENTIALS:', error);
    throw new Error('La variable de entorno de GCS no es un JSON válido.');
}


// 2. Inicializar el cliente de Storage
const storage = new Storage({
    projectId: serviceAccount.project_id,
    credentials: { 
        client_email: serviceAccount.client_email,
        private_key: serviceAccount.private_key.replace(/\\n/g, '\n'), 
    },
});
const bucket = storage.bucket(bucketName);
// =============================================

// Conectar a la DB
conectarDB();

// 1. CREAR INSTANCIA DE EXPRESS
const app = express();

// 2. APLICAR EL MIDDLEWARE DE SUBIDA A EXPRESS
// MaxFileSize configurado a 50MB
app.use(graphqlUploadExpress({ maxFileSize: 50000000, maxFiles: 1 })); 

// 3. CONFIGURAR EL SERVIDOR APOLLO (usando apollo-server-express)
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        const contextObject = { bucket };

        if(token){
            try {
                const usuario = jwt.verify(token.replace('Bearer ', ''), process.env.SECRETA);
                return {
                    ...contextObject, 
                    usuario 
                }
            } catch (error) {
                console.log(error);
                return contextObject;
            }
        }
        return contextObject;
    }
});

// 4. INICIAR EL SERVIDOR APOLLO Y APLICAR MIDDLEWARE A EXPRESS
async function startServer() {
    await server.start();
    
    // Aplica Apollo Server como middleware de Express
    server.applyMiddleware({ app });

    // 5. ESCUCHAR EL PUERTO CON EXPRESS (NO con el método .listen de Apollo)
    app.listen({ port: process.env.PORT || 4000 }, () => {
        console.log(`✅ Servidor listo en la URL http://localhost:${process.env.PORT || 4000}${server.graphqlPath}`);
    });
}

startServer();