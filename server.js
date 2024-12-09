require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cron = require('node-cron');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 3015;
const dataPath = path.join(__dirname, process.env.DATA_PATH);

// Parse comma-separated environment variables into arrays
const excludedTemperatureKeywords = process.env.EXCLUDED_TEMPERATURE_KEYWORDS.split(',');
const excludedEntities = process.env.EXCLUDED_TEMPERATURE_ENTITIES.split(',');
const temperatureIdentifiers = process.env.TEMPERATURE_IDENTIFIERS.split(',');
const humidityIdentifiers = process.env.HUMIDITY_IDENTIFIERS.split(',');
const airQualityIdentifiers = process.env.AIR_QUALITY_IDENTIFIERS.split(',');

let sensorData = {
  temperatureSensors: [],
  humiditySensors: [],
  airQualitySensors: []
};

function timeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000);
  
  if (diff < 60) return `${diff} seconds ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

function broadcastData() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(sensorData));
    }
  });
}

function formatSensorData(sensor) {
  return {
    ...sensor,
    state: Math.round(Number(sensor.state)),
    time_ago: sensor.last_changed ? timeAgo(sensor.last_changed) : 'Unknown'
  };
}

function isValidState(state) {
  return !['unavailable', 'unknown', ''].includes(state.toLowerCase());
}

function processSensorData(allData) {
  // Temperature sensors
  sensorData.temperatureSensors = allData
    .filter(entity => {
      const isTemperature = temperatureIdentifiers.some(id => 
        entity.entity_id.toLowerCase().includes(id)) ||
        entity.attributes?.device_class === 'temperature';
      const notExcluded = !excludedTemperatureKeywords.some(keyword => 
        (entity.attributes?.friendly_name || '').toLowerCase().includes(keyword));
      const notExcludedEntity = !excludedEntities.includes(entity.entity_id);
      return isTemperature && isValidState(entity.state) && notExcluded && notExcludedEntity;
    })
    .map(formatSensorData);

  // Humidity sensors
  sensorData.humiditySensors = allData
    .filter(entity => {
      const isHumidity = humidityIdentifiers.some(id => 
        entity.entity_id.toLowerCase().includes(id)) ||
        entity.attributes?.device_class === 'humidity';
      return isHumidity && isValidState(entity.state);
    })
    .map(formatSensorData);

  // Air quality sensors
  sensorData.airQualitySensors = allData
    .filter(entity => {
      const isAirQuality = airQualityIdentifiers.some(id => 
        entity.entity_id.toLowerCase().includes(id)) ||
        entity.attributes?.device_class?.includes('air_quality');
      return isAirQuality && isValidState(entity.state);
    })
    .map(formatSensorData);
}

function loadData() {
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const allData = JSON.parse(rawData);
    processSensorData(allData);
    broadcastData();
  } catch (error) {
    console.error('Error loading or parsing data:', error.message);
  }
}

function fetchData() {
  const curlCommand = `
    curl -X GET -H "Authorization: Bearer ${process.env.HA_BEARER_TOKEN}" \
    -H "Content-Type: application/json" \
    ${process.env.HA_API_URL} > ${dataPath}
  `;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching data: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Curl stderr: ${stderr}`);
    }
    loadData();
  });
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.send(JSON.stringify(sensorData));
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Setup routes and static files
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', sensorData);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Schedule data fetching
cron.schedule(process.env.UPDATE_INTERVAL, fetchData);

// Initial fetch
fetchData();

// Start server with error handling
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (error) => {
  console.error('Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});