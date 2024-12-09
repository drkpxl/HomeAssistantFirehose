# .aidigestignore

```
node_modules/
output.json
```

# .gitignore

```
# Node.js dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Logs
logs/
*.log
logs/**/*.log
debug.log
error.log
*.pid
*.seed
*.pid.lock

# Runtime data
pids/
*.pid
*.seed
*.pid.lock
lib-cov/

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# dotenv environment variables file
.env
.env.*.local

# Parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js
.next/
out/



# IDE/Editor specific
.vscode/
.idea/
*.swp
*.swo
*.sublime-workspace
*.sublime-project

# MacOS files
.DS_Store

# System files
Thumbs.db
Desktop.ini

# Local project files
output.json
.aidigestignore
codebase.md


```

# docker-compose.yml

```yml

services:
  app:
    build:
      context: .
    ports:
      - "3015:3015"
```

# Dockerfile

```
FROM node:20.18-alpine
WORKDIR /app
# Install curl
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3015
CMD ["npm", "run", "start"]
```

# package.json

```json
{
  "name": "homeassistantfirehose",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^16.4.7",
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "node-cron": "^3.0.3",
    "ws": "^8.18.0"
  }
}

```

# public/Screenshot-2024-12-09-1-34-26 PM.png

This is a binary file of the type: Image

# public/styles.css

```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=IBM+Plex+Sans:wght@400;600&display=swap');


:root {
    --bg-color: #F5E6D3;     /* Warm cream */
    --primary-color: #2A9D8F; /* Teal */
    --text-color: #264653;    /* Dark blue */
    --muted-text: #6B705C;    /* Olive gray */
    --tile-bg: #fff;
    --tile-border: #E9C46A;   /* Gold */
    --danger-bg: #F4A261;     /* Coral */
    --danger-border: #E76F51; /* Terracotta */
    --danger-text: #9B2226;   /* Dark red */
    --unit-color: #172a36;    /* Steel blue */
    --heading-font: 'DM Sans', sans-serif;
    --body-font: 'IBM Plex Sans', sans-serif;
   }
  

   
  body {
    margin: 0;
    padding: 8px;
    height: 100vh;
    background-color: var(--bg-color);
    font-family: var(--body-font);
    overflow: wrap;
  }
  
  .dashboard-container {
    height: calc(100vh - 16px);
    display: grid;
    grid-template-rows: auto auto 1fr auto auto 1fr auto auto 1fr;
    gap: 8px;
  }
  
  h1, h2 {
    margin: 0;
    color: var(--primary-color);
    font-family: var(--heading-font);
  }
  
  h1 { font-size: 16px; }
  h2 { font-size: 14px; }
  
  .grid-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }
  
  .tile {
    background: var(--tile-bg);
    border: 1px solid var(--tile-border);
    border-radius: 4px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 120px;
  }
  
  .tile h3 {
    margin: 0;
    font-size: 12px;
    line-height: 1.2;
    white-space: wrap;
    color: var(--text-color);
    font-family: var(--heading-font);
  }
  
  .tile .value {
    font-size: 48px;
    font-weight: 800;
    line-height: 1;
    margin: 4px 0;
    color: var(--primary-color);
    font-family: var(--heading-font);
  }
  
  .tile .value span.unit {
    font-size: 12px;
    color: var(--unit-color);
  }
  
  .tile .last-changed {
    font-size: 10px;
    color: var(--muted-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .tile.danger {
    background: var(--danger-bg);
    border-color: var(--danger-border);
  }
  
  .tile.danger .value {
    color: var(--danger-text);
  }
  
  @media (max-width: 1280px) {
    .grid-container {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }
  }
```

# README.md

```md
# Home Assistant Sensor Dashboard

A real-time dashboard that displays sensor data from your Home Assistant instance, focusing on temperature, humidity, and air quality metrics. The dashboard updates automatically through WebSocket connections and provides an easy-to-read interface for monitoring your home environment.


![Screenshot](public/Screenshot-2024-12-09-1-34-26 PM.png)

## Features

- Real-time sensor data updates via WebSocket connection
- Automatic data fetching every 15 minutes (configurable)
- Clean, responsive dashboard interface
- Color-coded tiles for quick status identification
- Support for temperature, humidity, and air quality sensors
- Configurable sensor filtering and display options

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm (usually comes with Node.js)
- A running Home Assistant instance
- A Home Assistant Long-Lived Access Token

### Getting Your Home Assistant Access Token

1. In your Home Assistant interface, click on your user profile (bottom left)
2. Scroll to the bottom and click "Create Token"
3. Give your token a name (e.g., "Sensor Dashboard")
4. Copy the token immediately - you won't be able to see it again

## Installation

1. Clone this repository:
   \`\`\`bash
   git clone https://github.com/drkpxl/HomeAssistantFirehose
   cd ha-sensor-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up your environment:
   \`\`\`bash
   cp sample.env .env
   \`\`\`

4. Edit `.env` with your specific configuration:
   - Replace `your_long_lived_access_token_here` with your Home Assistant token
   - Update `HOST` if your Home Assistant isn't at `homeassistant.local`
   - Modify other settings as needed

## Configuration Options

The `.env` file contains several configurable options:

### Server Settings
- `PORT`: The port your dashboard will run on (default: 3000)
- `HOST`: Your Home Assistant host address
- `API_PORT`: Home Assistant API port (default: 8123)
- `UPDATE_INTERVAL`: How often to fetch new data (default: */15 * * * *)

### Sensor Filtering
- `EXCLUDED_TEMPERATURE_KEYWORDS`: Comma-separated list of keywords to exclude from temperature sensors
- `EXCLUDED_TEMPERATURE_ENTITIES`: Specific entity IDs to exclude
- `TEMPERATURE_IDENTIFIERS`: Keywords to identify temperature sensors
- `HUMIDITY_IDENTIFIERS`: Keywords to identify humidity sensors
- `AIR_QUALITY_IDENTIFIERS`: Keywords to identify air quality sensors

## Running the Dashboard

1. Start the server:
   \`\`\`bash
   npm start
   \`\`\`

2. Open your browser and navigate to:
   \`\`\`
   http://localhost:3015
   \`\`\`

## Dashboard Features

### Temperature Sensors
- Displays all temperature sensors not excluded by your configuration
- Shows warning colors for temperatures below 30°C
- Updates in real-time

### Humidity Sensors
- Shows all humidity sensors
- Warning colors for humidity above 40%
- Real-time updates

### Air Quality Sensors
- Displays AQI, VOC, and indoor air quality sensors
- Warning colors for:
  - AQI above 60
  - Indoor air quality below 60
- Real-time updates

## Customizing the Dashboard

### Modifying the Layout
Edit `views/index.ejs` to change the dashboard layout and structure.

### Styling Changes
Modify `public/styles.css` to change colors, sizes, and other visual elements. The dashboard uses CSS variables for easy theming:

\`\`\`css
:root {
    --bg-color: #F5E6D3;     /* Background color */
    --primary-color: #2A9D8F; /* Main accent color */
    --text-color: #264653;    /* Primary text color */
    /* ... other variables ... */
}
\`\`\`

## Troubleshooting

### Common Issues

1. **Cannot connect to Home Assistant**
   - Verify your Home Assistant URL and port
   - Check if your token is valid
   - Ensure Home Assistant is accessible from your network

2. **Missing sensors**
   - Check your entity IDs in Home Assistant
   - Verify your sensor identification keywords in `.env`
   - Look for typos in excluded entities

3. **WebSocket connection issues**
   - Check your browser console for errors
   - Verify your network connection
   - Restart the Node.js server

### Getting Help

If you encounter issues:
1. Check the server console for error messages
2. Look at your browser's developer tools console
3. Review your `.env` configuration
4. Create an issue in the GitHub repository with:
   - Your error messages
   - Your configuration (remove sensitive data)
   - Steps to reproduce the issue

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Security Notes

- Never commit your `.env` file
- Keep your Home Assistant token secret
- Regularly update your dependencies
- Run `npm audit` periodically to check for vulnerabilities


```

# server.js

```js
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
```

# views/index.ejs

```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sensor Dashboard</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="dashboard-container">
    <h1>Sensor Dashboard</h1>
    
    <div class="section">
      <div class="grid-container">
        <% temperatureSensors.forEach(sensor => { %>
          <% 
            const tempState = parseFloat(sensor.state);
            const isDanger = tempState < 30;
          %>
          <div class="tile <%= isDanger ? 'danger' : '' %>">
            <h3><%= sensor.attributes.friendly_name %></h3>
            <div class="value">
              <%= sensor.state %><span class="unit"><%= sensor.attributes.unit_of_measurement || '' %></span>
            </div>
            <div class="last-changed">Updated <%= sensor.time_ago %></div>
          </div>
        <% }) %>
      </div>
    </div>
    
    <div class="section">
      &nbsp;
      <div class="grid-container">
        <% humiditySensors.forEach(sensor => { %>
          <% 
            const humidityState = parseFloat(sensor.state);
            const isDanger = humidityState > 40;
          %>
          <div class="tile <%= isDanger ? 'danger' : '' %>">
            <h3><%= sensor.attributes.friendly_name %></h3>
            <div class="value">
              <%= sensor.state %><span class="unit"><%= sensor.attributes.unit_of_measurement || '' %></span>
            </div>
            <div class="last-changed">Updated <%= sensor.time_ago %></div>
          </div>
        <% }) %>
      </div>
    </div>   
    <div class="section">
      &nbsp;
      <div class="grid-container">
        <% airQualitySensors.forEach(sensor => { %>
          <% 
            const entityId = sensor.entity_id.toLowerCase();
            const sensorState = parseFloat(sensor.state);
            const isAQI = entityId.includes('aqi') && sensorState > 60;
            const isIndoorAirQuality = entityId.includes('indoor_air_quality') && sensorState < 60;
            const isDanger = isAQI || isIndoorAirQuality;
          %>
          <div class="tile <%= isDanger ? 'danger' : '' %>">
            <h3><%= sensor.attributes.friendly_name %></h3>
            <div class="value">
              <%= sensor.state %><span class="unit"><%= sensor.attributes.unit_of_measurement || '' %></span>
            </div>
            <div class="last-changed">Updated <%= sensor.time_ago %></div>
          </div>
        <% }) %>
      </div>
    </div>
  </div>
  <script>
    const ws = new WebSocket(`ws://${window.location.host}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateDashboard(data);
    };
  
    function updateDashboard(data) {
      ['temperatureSensors', 'humiditySensors', 'airQualitySensors'].forEach(sensorType => {
        const containers = document.querySelectorAll('.grid-container');
        const container = containers[
          sensorType === 'temperatureSensors' ? 0 : 
          sensorType === 'humiditySensors' ? 1 : 2
        ];
        
        container.innerHTML = data[sensorType].map(sensor => {
          const isDanger = sensorType === 'temperatureSensors' ? sensor.state < 30 :
                          sensorType === 'humiditySensors' ? sensor.state > 40 :
                          (sensor.entity_id.toLowerCase().includes('aqi') && sensor.state > 60) || 
                          (sensor.entity_id.toLowerCase().includes('indoor_air_quality') && sensor.state < 60);
  
          return `
            <div class="tile ${isDanger ? 'danger' : ''}">
              <h3>${sensor.attributes.friendly_name}</h3>
              <div class="value">
                ${sensor.state}<span class="unit">${sensor.attributes.unit_of_measurement || ''}</span>
              </div>
              <div class="last-changed">Updated ${sensor.time_ago}</div>
            </div>
          `;
        }).join('');
      });
    }
  </script>
</body>
</html>
```

