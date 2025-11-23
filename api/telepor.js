const fetch = require('node-fetch'); // Ensure you have node-fetch installed (npm install node-fetch)

const WEBHOOK_URL = "https://discord.com/api/webhooks/1441957789475016867/wU5raVADEsK7Ltbs5b03rx5n0Z8fBPGCF-Nx67_3Nsy6ZcirqVnSt1z2ohCBhGlGbtSN";
const SERVER_URL = "https://nodejs-serverless-function-express-kn1r08nwp.vercel.app/api/teleport";

let queue = []; // This will store the requests to be processed
let activeServers = []; // This will store active servers and their data
const MAX_QUEUE_LENGTH = 15000; // Maximum number of items allowed in the queue

const isPrivateServer = () => {
    // You can add logic to check if it is a private server or not based on server environment
    return false;
};

const cleanNumber = (str) => {
    const cleanStr = str.replace(/[^0-9.]/g, "");
    return parseFloat(cleanStr) || 0;
};

const getAnimalData = (overhead) => {
    const displayName = overhead.displayName;
    const genText = overhead.generation;
    const rarityText = overhead.rarity;
    
    let moneyPerSecond = 0;

    if (genText.includes('B')) {
        moneyPerSecond = cleanNumber(genText) * 1000000000;
    } else if (genText.includes('M')) {
        moneyPerSecond = cleanNumber(genText) * 1000000;
    } else if (genText.includes('K')) {
        moneyPerSecond = cleanNumber(genText) * 1000;
    } else {
        moneyPerSecond = cleanNumber(genText);
    }

    return {
        DisplayName: displayName,
        Value: moneyPerSecond,
        Generation: genText,
        Rarity: rarityText
    };
};

const sendHttpRequest = async (url, method, data) => {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return await response.json();
    } catch (error) {
        console.error("Error sending HTTP request:", error);
        return null;
    }
};

const sendToVercelServer = async (placeId, jobId, animalData) => {
    const payload = {
        placeId: placeId.toString(),
        gameInstanceId: jobId,
        animalData: {
            displayName: animalData.DisplayName,
            value: animalData.Value,
            generation: animalData.Generation,
            rarity: animalData.Rarity
        },
        timestamp: Math.floor(Date.now() / 1000),
        source: "roblox_script"
    };

    return await sendHttpRequest(SERVER_URL, "POST", payload);
};

// Function to send data to the Discord Webhook
const sendToDiscordWebhook = async (bestAnimal, jobId, placeId, playersCount) => {
    const moneyPerSecFormatted = bestAnimal.Value >= 1000000000
        ? `💰 ${(bestAnimal.Value / 1000000000).toFixed(1)}B/s`
        : bestAnimal.Value >= 1000000
            ? `💰 ${(bestAnimal.Value / 1000000).toFixed(1)}M/s`
            : bestAnimal.Value >= 1000
                ? `💰 ${(bestAnimal.Value / 1000).toFixed(1)}K/s`
                : `💰 ${bestAnimal.Value}/s`;

    const embed = {
        title: "🐾 **Brainrot Notify | ZL Hub**",
        color: 65280,
        fields: [
            { name: "**Name**", value: bestAnimal.DisplayName },
            { name: "**Money per sec**", value: moneyPerSecFormatted },
            { name: "**Generation**", value: `📊 ${bestAnimal.Generation}` },
            { name: "**Rarity**", value: `🌟 ${bestAnimal.Rarity}` },
            { name: "**Players**", value: `👤 ${playersCount}/10` },
            { name: "**Job ID**", value: `\`\`\`${jobId}\`\`\`` },
            { name: "**Join Link**", value: `[Click to Join](https://example.com/join?placeId=${placeId}&gameInstanceId=${jobId})` },
        ],
        timestamp: new Date().toISOString(),
        footer: {
            text: `Made by ZL Hub • ${new Date().toLocaleString()}`
        }
    };

    const discordPayload = {
        embeds: [embed],
        username: "ZL Hub Notifier",
        avatar_url: "https://cdn.discordapp.com/attachments/1128833213672656988/1215321493282160730/standard_1.gif"
    };

    await sendHttpRequest(WEBHOOK_URL, "POST", discordPayload);
};

// Main function to handle queuing and sending
const handleQueue = async () => {
    if (queue.length >= MAX_QUEUE_LENGTH) {
        console.log("Queue is full. Waiting...");
        return;
    }

    // Simulate retrieving data (replace this with actual game data)
    const bestAnimal = {
        DisplayName: "Extinct Tralalero",
        Value: 3800000,
        Generation: "$3.8M/s",
        Rarity: "Secret"
    };

    const placeId = "109983668079237";
    const jobId = "588dc909-3b86-4452-93d9-df1f948a4269";
    const playersCount = 5; // Example players count

    // Add the request to the queue
    queue.push({
        placeId,
        jobId,
        animalData: bestAnimal,
        timestamp: Date.now()
    });

    // Process the first item in the queue after a delay (simulating the expiresIn)
    const queueItem = queue[0];
    const expiresIn = 5000; // Example expiration time (in milliseconds)

    setTimeout(async () => {
        // Send to Vercel and Discord Webhook when the request expires
        await sendToVercelServer(queueItem.placeId, queueItem.jobId, queueItem.animalData);
        await sendToDiscordWebhook(queueItem.animalData, queueItem.jobId, queueItem.placeId, playersCount);

        // Remove from queue after processing
        queue.shift();
        console.log("Processed and removed from queue");
    }, expiresIn);
};

// Simulate calling the handleQueue function every few seconds
setInterval(handleQueue, 5000);
