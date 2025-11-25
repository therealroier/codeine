export default function handler(req, res) {
  // Verificar si la solicitud es un POST
  if (req.method === 'POST') {
    const { placeId, gameInstanceId, animalData, timestamp, source } = req.body;

    if (!placeId || !gameInstanceId || !animalData) {
      return res.status(400).json({ message: "Faltan datos requeridos en la solicitud." });
    }

    // Aquí procesamos los datos
    console.log("Datos recibidos:", req.body);

    // Ahora puedes manejar los datos y enviarlos a donde necesites, por ejemplo, a una base de datos, log o incluso otro servicio

    // Responder al cliente con un mensaje
    res.status(200).json({ message: "Datos recibidos correctamente", receivedData: req.body });
  } else {
    // Si no es un POST, devolver un error 405 (Método no permitido)
    res.status(405).json({ message: "Método no permitido" });
  }
}
