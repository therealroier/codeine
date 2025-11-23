const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Endpoint POST para recibir datos
app.post('/api/teleport', (req, res) => {
    const { placeId, gameInstanceId, animalData } = req.body;

    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: "Missing required data" });
    }

    // Lógica para manejar los datos (esto es solo un ejemplo)
    console.log("Received data:", { placeId, gameInstanceId, animalData });

    // Responder con éxito
    return res.json({
        success: true,
        message: "Data received successfully",
        data: { placeId, gameInstanceId, animalData },
    });
};

// Asegúrate de exportar como un handler para Vercel
module.exports = (req, res) => {
    app(req, res); // Usamos app(req, res) para manejar la solicitud
};
