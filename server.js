const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para analizar el cuerpo de la solicitud como JSON
app.use(bodyParser.json());

// Importar el archivo teleport.js para manejar las solicitudes
const teleport = require('./api/teleport');

// Usar el endpoint de teleport
app.use('/api/teleport', teleport);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
