let teleportQueue = [];

function cleanExpiredData() {
    const now = Date.now();
    const expirationTime = 20000; 
    
    teleportQueue = teleportQueue.filter(item => 
        item.timestamp && (now - item.timestamp) <= expirationTime
    );
}

setInterval(cleanExpiredData, 1000);

module.exports = async (req, res) => {
  
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let body = {};
        if (req.body) {
            body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        }

        if (req.method === 'GET') {
            cleanExpiredData();
            
            const activeServers = teleportQueue.map(item => ({
                placeId: item.placeId,
                gameInstanceId: item.gameInstanceId,
                animalData: item.animalData || { 
                    displayName: "Desconocido",
                    value: 0,
                    generation: "?",
                    rarity: "?"
                },
                expiresIn: Math.max(0, 20000 - (Date.now() - item.timestamp)) + 'ms',
                timestamp: item.timestamp
            }));

            return res.status(200).json({
                success: true,
                message: 'en servicio',
                queueLength: teleportQueue.length,
                activeServers: activeServers,
                timestamp: new Date().toISOString()
            });
        }

        if (req.method === 'POST') {
            const { action, placeId, gameInstanceId, userId, animalData, source } = body;

            cleanExpiredData();

            if (source === "roblox_script" && placeId && gameInstanceId) {
                const newItem = {
                    placeId: placeId,
                    gameInstanceId: gameInstanceId,
                    animalData: animalData || { 
                        displayName: animalData?.displayName || "Desconocido",
                        value: animalData?.value || 0,
                        generation: animalData?.generation || "?",
                        rarity: animalData?.rarity || "?"
                    },
                    timestamp: Date.now(),
                    source: 'roblox_direct',
                    id: `${placeId}-${gameInstanceId}-${Date.now()}`
                };

                const exists = teleportQueue.some(item => 
                    item.placeId === placeId && item.gameInstanceId === gameInstanceId
                );

                if (!exists) {
                    teleportQueue.push(newItem);
                    console.log('cola:', { 
                        placeId, 
                        gameInstanceId,
                        animal: animalData?.displayName,
                        generation: animalData?.generation,
                        value: animalData?.value,
                        rarity: animalData?.rarity,
                        queuePosition: teleportQueue.length
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: 'Servidor agregado a la cola',
                    queueLength: teleportQueue.length,
                    added: !exists
                });
            }

            if (action === "getTeleportData") {
                if (teleportQueue.length > 0) {
                    const firstItem = teleportQueue[0];
                    const timeLeft = Math.max(0, 20000 - (Date.now() - firstItem.timestamp));
                    
                    return res.status(200).json({
                        success: true,
                        data: {
                            placeId: firstItem.placeId,
                            gameInstanceId: firstItem.gameInstanceId,
                            animalData: firstItem.animalData, 
                            timeLeft: timeLeft,
                            queuePosition: 1,
                            queueLength: teleportQueue.length
                        }
                    });
                } else {
                    return res.status(200).json({
                        success: true,
                        data: null,
                        message: 'No hay servidores en la cola'
                    });
                }
            }

            if (action === "removeFirstFromQueue") {
                if (teleportQueue.length > 0) {
                    const removed = teleportQueue.shift();
                    console.log('✅ Servidor removido de la cola:', {
                        gameInstanceId: removed.gameInstanceId,
                        animal: removed.animalData?.displayName,
                        generation: removed.animalData?.generation 
                    });
                    console.log('Cola restante:', teleportQueue.length);
                    
                    return res.status(200).json({
                        success: true,
                        message: 'Servidor removido de la cola',
                        removed: removed.gameInstanceId,
                        queueLength: teleportQueue.length
                    });
                }
                
                return res.status(200).json({
                    success: true,
                    message: 'Cola vacía'
                });
            }

            // Limpiar TODA la cola
            if (action === "clearQueue") {
                const count = teleportQueue.length;
                teleportQueue = [];
                console.log('Cola limpiada:', count + ' servidores');
                return res.status(200).json({
                    success: true,
                    message: `Cola limpiada (${count} servidores)`
                });
            }

            return res.status(400).json({
                success: false,
                error: 'Datos incompletos'
            });
        }

        return res.status(405).json({
            success: false,
            error: 'Método no permitido'
        });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno: ' + error.message
        });
    }
};
