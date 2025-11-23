// Función para enviar la solicitud POST al servidor
async function sendToServer(data) {
  const SERVER_URL = 'https://nodejs-serverless-function-express-kn1r08nwp.vercel.app/api/teleport';

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST', // Asegúrate de que sea una solicitud POST
      headers: {
        'Content-Type': 'application/json', // Se debe especificar que el cuerpo es JSON
      },
      body: JSON.stringify(data), // El cuerpo debe ser el objeto de datos convertido a JSON
    });

    if (response.ok) {
      // Si la solicitud fue exitosa, muestra la respuesta
      const responseData = await response.json();
      console.log('Success:', responseData);
    } else {
      // Si la solicitud falla, muestra el error
      const errorData = await response.json();
      console.error('Error:', errorData);
    }
  } catch (error) {
    console.error('Network Error:', error);
  }
}

// Datos a enviar al servidor
const data = {
  placeId: '109983668079237',
  gameInstanceId: 'fe863aaa-87ef-4d0a-83e4-b77953204802',
  animalData: {
    displayName: 'Las Tralaleritas',
    value: 6500000,
    generation: '$6.5M/s',
    rarity: 'Secret',
  },
  timestamp: Date.now(),
  source: 'roblox_script',
};

// Enviar los datos al servidor
sendToServer(data);
