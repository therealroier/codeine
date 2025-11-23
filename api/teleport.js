// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Si el método no es POST, directamente devolvemos los datos
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    return res.status(405).json({
      placeId,
      gameInstanceId,
      animalData,
      timestamp,
      source
    });
  }

  try {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Lógica para procesar la solicitud
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Respuesta exitosa
    res.status(200).json({
      message: 'Data received successfully!',
      placeId,
      gameInstanceId,
      animalData,
      timestamp,
      source
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      placeId: req.body.placeId,
      gameInstanceId: req.body.gameInstanceId,
      animalData: req.body.animalData,
      timestamp: req.body.timestamp,
      source: req.body.source,
      error: error.message
    });
  }
}
