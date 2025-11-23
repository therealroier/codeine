const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// URL de tu API en Vercel
const VERCEL_API_URL = "https://codeineee.vercel.app/api/teleport";

// Endpoint POST para recibir datos
app.post('/api/teleport', async (req, res) => {
    const { placeId, gameInstanceId, animalData } = req.body;

    // Verifica si falta algún dato esencial
    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: "Missing required data" });
    }

    // Log para verificar que los datos fueron recibidos correctamente
    console.log("Received data:", { placeId, gameInstanceId, animalData });

    // Enviar los datos a la API de Vercel usando fetch nativo de Node.js 22.x
    try {
        const response = await fetch(VERCEL_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                placeId,
                gameInstanceId,
                animalData,
            }),
        });

        // Si la solicitud fue exitosa, respondemos con los datos de la respuesta
        if (response.ok) {
            const data = await response.json();
            console.log('Data successfully sent to Vercel:', data); // Log para verificar respuesta
            return res.json({
                success: true,
                message: "Data sent to Vercel API successfully",
                data: data,
            });
        } else {
            // Si ocurre un error, respondemos con el error
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData });
        }
    } catch (error) {
        console.error("Error sending data to Vercel API:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// Exportar la función handler para que Vercel la maneje
module.exports = app;
