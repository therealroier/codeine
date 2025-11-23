// api/teleport.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    // Lógica para procesar la solicitud, por ejemplo, guardar la información en una base de datos
    console.log('Received data:', { placeId, gameInstanceId, animalData, timestamp, source });

    // Si necesitas enviar algún tipo de respuesta al cliente
    res.status(200).json({ message: 'Data received successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
