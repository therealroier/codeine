// API URL del servidor de destino
const SERVER_URL = "https://nodejs-serverless-function-express-kn1r08nwp.vercel.app/api/teleport";

// URL de Webhook (si es necesario enviar información a Discord o procesar después)
const WEBHOOK_URL = "https://discord.com/api/webhooks/1441957789475016867/wU5raVADEsK7Ltbs5b03rx5n0Z8fBPGCF-Nx67_3Nsy6ZcirqVnSt1z2ohCBhGlGbtSN";

// Función para obtener la respuesta de la API y procesarla
async function fetchServerData() {
    try {
        // Realiza la solicitud GET a la API
        const response = await fetch(SERVER_URL);
        const data = await response.json();

        if (data.success) {
            // Procesar la respuesta de la API para obtener el mejor servidor
            const bestServer = getBestServer(data.activeServers);
            if (bestServer) {
                // Si se encuentra un servidor adecuado, realizar el auto-join
                console.log("Unión al servidor:", bestServer.gameInstanceId);
                joinServer(bestServer);
            } else {
                console.warn("No se encontraron servidores adecuados.");
            }
        } else {
            console.error("Error: La respuesta de la API no fue exitosa.", data.message);
        }
    } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
    }
}

// Función para seleccionar el mejor servidor basado en el valor más alto
function getBestServer(activeServers) {
    let bestServer = null;
    let highestValue = 0;

    // Iterar sobre los servidores activos y seleccionar el que tenga el valor más alto
    activeServers.forEach((server) => {
        if (server.animalData.value > highestValue) {
            bestServer = server;
            highestValue = server.animalData.value;
        }
    });

    return bestServer;
}

// Función para unirse al servidor utilizando el gameInstanceId
function joinServer(server) {
    const { placeId, gameInstanceId, animalData } = server;

    // Realiza el auto-join al servidor seleccionado
    console.log(`Unión al servidor con GameInstanceID: ${gameInstanceId} y PlaceID: ${placeId}`);
    
    // Puedes realizar una redirección a la URL del servidor o enviar la solicitud al backend para manejar el join
    const teleportUrl = `https://www.roblox.com/games/${placeId}?join-gameInstance=${gameInstanceId}`;
    window.location.href = teleportUrl; // Redirige a la URL de Roblox para unirse automáticamente
}

// Llamar a la función para obtener los servidores y unirse automáticamente
fetchServerData();
