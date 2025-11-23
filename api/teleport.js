// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'Method Not Allowed'
    });
  }

  try {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    if (!placeId || !gameInstanceId || !animalData || !timestamp || !source) {
      return res.status(400).json({
        message: 'Bad Request: Missing required data',
        placeId,
        gameInstanceId,
        animalData,
        timestamp,
        source
      });
    }

    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    return res.status(200).json({
      message: 'Data received successfully!',
      placeId,
      gameInstanceId,
      animalData,
      timestamp,
      source
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      placeId: req.body.placeId,
      gameInstanceId: req.body.gameInstanceId,
      animalData: req.body.animalData,
      timestamp: req.body.timestamp,
      source: req.body.source,
      error: error.message
    });
  }
}
