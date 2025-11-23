// Datos de ejemplo con más detalles
const animalData = {
    value: 5200000,
    generation: "$5.2M/s",
    rarity: "Secret",
    displayName: "Los Tortus"
};

// Otros datos (como el placeId, gameInstanceId, etc.)
const metadata = {
    placeId: "109983668079237",
    gameInstanceId: "761a6ab1-8aa0-4a1e-b466-b1dd9067aac8",
    animalData: animalData,
    expiresIn: "5739ms",
    timestamp: 1763861163650
};

// Función para obtener el tiempo actual en formato legible
function obtenerHoraActual() {
    const fecha = new Date();
    return fecha.toISOString();  // Devuelve el timestamp en formato ISO
}

// Función para marcar los datos con un timestamp
function marcarAnimal() {
    const timestamp = obtenerHoraActual();
    
    // Imprimir los datos en formato JSON con timestamp
    console.log(`[${timestamp}] { 
        "placeId": "${metadata.placeId}",
        "gameInstanceId": "${metadata.gameInstanceId}",
        "animalData": {
            "value": ${metadata.animalData.value},
            "generation": "${metadata.animalData.generation}",
            "rarity": "${metadata.animalData.rarity}",
            "displayName": "${metadata.animalData.displayName}"
        },
        "expiresIn": "${metadata.expiresIn}",
        "timestamp": ${metadata.timestamp}
    }`);
}

// Ejecutar la función
marcarAnimal();
