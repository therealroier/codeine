const express = require('express');
const axios = require('axios');
const router = express.Router();

// Webhook URL para Discord
const WEBHOOK_URL = "https://discord.com/api/webhooks/1441973041868443798/imWXBKQltP9VFcDhXr_ema7gagVfFSPsTis6q8Vl_qQhlQEm7yBnSNWVJsckJGo1c8OF";

// Función para enviar datos al Webhook de Discord
const sendDiscordWebhook = (animalData) => {
    const embed = {
        embeds: [
            {
                title: "🐾 **Brainrot Notify | ZL Hub**",
                color: 65280,
                fields: [
                    { name: "**Name**", value: animalData.displayName, inline: false },
                    { name: "**Money per sec**", value: `💰 ${animalData.value} per second`, inline: true },
                    { name: "**Generation**", value: `📊 ${animalData.generation}`, inline: true },
                    { name: "**Rarity**", value: `🌟 ${animalData.rarity}`, inline: true },
                    // Otros campos...
                ],
                timestamp: new Date().toISOString(),
                footer: { text: "Made by ZL Hub • " + new Date().toLocaleString() },
            },
        ],
        username: "ZL Hub Notifier",
        avatar_url: "https://cdn.discordapp.com/attachments/1128833213672656988/1215321493282160730/standard_1.gif",
    };

    axios.post(WEBHOOK_URL, embed)
        .then((response) => {
            console.log('Webhook enviado correctamente a Discord');
        })
        .catch((error) => {
            console.error('Error enviando webhook a Discord:', error);
        });
};

// Ruta para manejar solicitudes POST de Roblox
router.post('/', (req, res) => {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Verificar si los datos necesarios están presentes
    if (!placeId || !gameInstanceId || !animalData) {
        return res.status(400).json({ error: 'Faltan datos esenciales' });
    }

    // Aquí puedes agregar lógica para procesar los datos antes de enviarlos a Discord
    console.log('Datos recibidos:', req.body);

    // Enviar los datos al Webhook de Discord
    sendDiscordWebhook(animalData);

    // Responder con éxito
    res.status(200).json({ message: 'Datos procesados correctamente' });
});

module.exports = router;
