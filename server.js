import { createServer } from 'http';
import next from 'next';
import { WebSocketServer } from 'ws';
import fetch from 'node-fetch'; // Make sure to install node-fetch: npm install node-fetch

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
// Use PORT from environment variable if available, otherwise default to 3003 for dev, 3000 for prod
const port = parseInt(process.env.PORT, 10) || (dev ? 3003 : 3000);
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const FETCH_INTERVAL = 30000; // Fetch data every 30 seconds (more conservative)
// Using only reliable free APIs
const COINCAP_API_BASE = 'https://api.coincap.io/v2';
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const wss = new WebSocketServer({ server: httpServer });

  let cryptoData = {}; // Store the latest crypto data

  const fetchCryptoData = async () => {
    try {
      const combinedData = {
        prices: {},
        trending: []
      };

      // Method 1: Try Binance API (free, no auth needed)
      const coinDetails = [
        { id: 'bitcoin', binanceSymbol: 'BTCUSDT', coingeckoId: 'bitcoin', coincapId: 'bitcoin' },
        { id: 'ethereum', binanceSymbol: 'ETHUSDT', coingeckoId: 'ethereum', coincapId: 'ethereum' },
        { id: 'dogecoin', binanceSymbol: 'DOGEUSDT', coingeckoId: 'dogecoin', coincapId: 'dogecoin' }
      ];

      try {
        for (const coin of coinDetails) {
          if (!combinedData.prices[coin.id]) { // Check if data already fetched
            try {
              const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${coin.binanceSymbol}`);
              if (response.ok) {
                const data = await response.json();
                combinedData.prices[coin.id] = {
                  usd: parseFloat(data.lastPrice),
                  usd_24h_change: parseFloat(data.priceChangePercent) || 0
                };
                console.log(`✓ ${coin.id} data fetched from Binance`);
              } else {
                console.log(`⚠ Binance failed for ${coin.id} (${coin.binanceSymbol}): ${response.status}`);
              }
            } catch (binanceError) {
              console.log(`⚠ Binance error for ${coin.id} (${coin.binanceSymbol}):`, binanceError.message);
            }
          }
        }
      } catch (error) {
        console.log('Binance batch failed:', error.message);
      }
      
      // Method 2: For any missing coins, try CoinCap
      const missingFromBinance = coinDetails.filter(coin => !combinedData.prices[coin.id]);
      if (missingFromBinance.length > 0) {
        console.log(`Trying CoinCap for ${missingFromBinance.length} missing coins...`);
        try {
          for (const coin of missingFromBinance) {
            try {
              const response = await fetch(`${COINCAP_API_BASE}/assets/${coin.coincapId}`);
              if (response.ok) {
                const data = await response.json();
                if (data.data) {
                  combinedData.prices[coin.id] = {
                    usd: parseFloat(data.data.priceUsd),
                    usd_24h_change: parseFloat(data.data.changePercent24Hr) || 0
                  };
                  console.log(`✓ ${coin.id} data fetched from CoinCap`);
                }
              } else {
                console.log(`⚠ CoinCap failed for ${coin.id}: ${response.status}`);
              }
            } catch (coinError) {
              console.log(`⚠ CoinCap error for ${coin.id}:`, coinError.message);
            }
          }
        } catch (error) {
          console.log('CoinCap batch failed:', error.message);
        }
      }

      // Method 3: Final fallback to CoinGecko (only if absolutely necessary)
      const stillMissingCoins = coinDetails.filter(coin => !combinedData.prices[coin.id]);
      if (stillMissingCoins.length > 0) {
        console.log(`Final fallback to CoinGecko for ${stillMissingCoins.length} coins...`);
        
        try {
          const geckoIds = stillMissingCoins.map(coin => coin.coingeckoId).join(',');
          const response = await fetch(`${COINGECKO_API_BASE}/simple/price?ids=${geckoIds}&vs_currencies=usd&include_24hr_change=true`);
          
          if (response.ok) {
            const data = await response.json();
            stillMissingCoins.forEach(coin => {
              if (data[coin.coingeckoId]) {
                combinedData.prices[coin.id] = {
                  usd: data[coin.coingeckoId].usd,
                  usd_24h_change: data[coin.coingeckoId].usd_24h_change || 0
                };
                console.log(`✓ ${coin.id} data fetched from CoinGecko (final fallback)`);
              }
            });
          } else {
            console.log(`⚠ CoinGecko fallback failed: ${response.status}`);
          }
        } catch (error) {
          console.log('CoinGecko fallback error:', error.message);
        }
      }

      cryptoData = combinedData;
      const fetchedCoins = Object.keys(combinedData.prices).length;
      console.log(`Successfully fetched ${fetchedCoins}/3 coins at`, new Date().toLocaleTimeString());
      
      if (fetchedCoins === 0) {
        console.log('⚠ No crypto data available - all APIs failed');
        // Set fallback static data so the app doesn't break
        cryptoData = {
          prices: {
            bitcoin: { usd: 45000, usd_24h_change: 0 },
            ethereum: { usd: 3000, usd_24h_change: 0 },
            dogecoin: { usd: 0.08, usd_24h_change: 0 }
          },
          trending: []
        };
        console.log('Using fallback static data to keep app functional');
      }
      
      broadcastData();
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const broadcastData = () => {
    if (Object.keys(cryptoData).length > 0 && (Object.keys(cryptoData.prices || {}).length > 0 || (cryptoData.trending || []).length > 0) ) {
      const message = JSON.stringify({ type: 'cryptoUpdate', data: cryptoData });
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) { // Check if client.OPEN (which is 1)
          client.send(message);
        }
      });
    }
  };

  // Fetch data initially and then at intervals
  fetchCryptoData();
  const fetchIntervalId = setInterval(fetchCryptoData, FETCH_INTERVAL);

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket server');

    // Send current data immediately on connection
    if (Object.keys(cryptoData).length > 0 && (Object.keys(cryptoData.prices || {}).length > 0 || (cryptoData.trending || []).length > 0) ) {
      ws.send(JSON.stringify({ type: 'cryptoUpdate', data: cryptoData }));
    }

    ws.on('message', (message) => {
      console.log('Received message from client:', message.toString());
      // Handle incoming messages if needed (e.g., client requests specific data)
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      clearInterval(fetchIntervalId); // Clear interval on server error
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log(`> WebSocket server ready on ws://${hostname}:${port}`);
    });
});
