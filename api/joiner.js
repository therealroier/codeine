// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Lógica para procesar los datos, por ejemplo, guardarlos en una base de datos
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Responder con éxito
    res.status(200).json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
