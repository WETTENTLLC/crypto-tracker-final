// File: websocket-server.js (conceptual - run as a separate Node.js process)
const WebSocket = require('ws');
const http = require('http');
const fetch = require('node-fetch'); // Or use native fetch in Node.js 18+

// Configuration
const PORT = process.env.WS_PORT || 3001;
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin,cardano,solana,dogecoin&vs_currencies=usd';
const FETCH_INTERVAL = 10000; // 10 seconds

let cryptoData = {};
let activeConnections = 0;
let intervalId = null;

// Create an HTTP server (required by ws library)
const server = http.createServer((req, res) => {
    // Basic health check endpoint
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', activeConnections, lastData: cryptoData }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

const wss = new WebSocket.Server({ server });

async function fetchAndBroadcastCryptoData() {
    console.log('Fetching crypto data...');
    try {
        const response = await fetch(COINGECKO_API_URL);
        if (!response.ok) {
            console.error(`CoinGecko API Error: ${response.status} ${response.statusText}`);
            // Optionally, broadcast an error state to clients
            // broadcast(JSON.stringify({ type: 'error', message: 'Failed to fetch crypto data' }));
            return;
        }
        const data = await response.json();
        cryptoData = data;
        console.log('Broadcasting crypto data to connected clients:', cryptoData);
        broadcast(JSON.stringify({ type: 'cryptoUpdate', data: cryptoData }));
    } catch (error) {
        console.error('Error fetching or broadcasting crypto data:', error);
        // Optionally, broadcast an error state
        // broadcast(JSON.stringify({ type: 'error', message: 'Internal server error fetching data' }));
    }
}

function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data, (err) => {
                if (err) {
                    console.error('Error sending message to client:', err);
                }
            });
        }
    });
}

function startFetching() {
    if (intervalId === null) {
        console.log('Starting data fetching interval.');
        fetchAndBroadcastCryptoData(); // Fetch immediately
        intervalId = setInterval(fetchAndBroadcastCryptoData, FETCH_INTERVAL);
    }
}

function stopFetching() {
    if (intervalId !== null && activeConnections === 0) {
        console.log('No active connections, stopping data fetching interval.');
        clearInterval(intervalId);
        intervalId = null;
    }
}

wss.on('connection', (ws, req) => {
    activeConnections++;
    const clientIp = req.socket.remoteAddress;
    console.log(`Client connected: ${clientIp}. Total connections: ${activeConnections}`);

    // Send initial data if available
    if (Object.keys(cryptoData).length > 0) {
        ws.send(JSON.stringify({ type: 'initialData', data: cryptoData }), (err) => {
            if (err) console.error('Error sending initial data:', err);
        });
    }

    startFetching(); // Start fetching if not already started

    ws.on('message', message => {
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log(`Received message from ${clientIp}:`, parsedMessage);
            // Handle client messages if needed (e.g., subscribe to specific coins)
            // For now, just log it.
        } catch (e) {
            console.log(`Received non-JSON message from ${clientIp}: ${message}`);
        }
    });

    ws.on('close', (code, reason) => {
        activeConnections--;
        console.log(`Client disconnected: ${clientIp}. Code: ${code}, Reason: ${reason}. Total connections: ${activeConnections}`);
        stopFetching(); // Stop fetching if no clients are connected
    });

    ws.on('error', error => {
        console.error(`WebSocket error for client ${clientIp}:`, error);
        // ws.close(); // Consider closing on error, depending on the error type
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket server started on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    wss.clients.forEach(client => client.close());
    server.close(() => {
        console.log('Server shut down.');
        process.exit(0);
    });
});