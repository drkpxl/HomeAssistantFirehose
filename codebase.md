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

# Nuxt.js
.nuxt/
dist/

# Vuepress
.vuepress/dist

# Gatsby files
.cache/
public/

# Vue files
dist/

# Svelte files
__sapper__/
sveltekit-output/

# Django stuff:
*.pyc
*.pyo
__pycache__/
.db.sqlite3

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
    "ejs": "^3.1.10",
    "express": "^4.21.2",
    "node-cron": "^3.0.3"
  }
}

```

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

# server.js

```js
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cron = require('node-cron');
const app = express();
const port = 3000;

// Function to calculate "time ago" in human-readable format
function timeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000); // Difference in seconds

  if (diff < 60) return `${diff} seconds ago`;
  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

// Path to the output.json file
const dataPath = path.join(__dirname, 'output.json');
let temperatureSensors = [];
let humiditySensors = [];
let airQualitySensors = [];

// Function to fetch data using curl
function fetchData() {
  const curlCommand = `
    curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiZWY3MzNjYjgyNWY0ZTJiYTc3ZWViZmJjYzI0OWM0ZSIsImlhdCI6MTczMzcwMjIxNCwiZXhwIjoyMDQ5MDYyMjE0fQ.bsqk7aBqJyNG93Dw_-71Ys7S_rph6OD2k-9KzA3tpEg" \
         -H "Content-Type: application/json" \
         http://homeassistant.local:8123/api/states > ${dataPath}
  `;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error fetching data: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Curl stderr: ${stderr}`);
    }
    console.log('Data fetched and saved to output.json');
    loadData();
  });
}

function loadData() {
  try {
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const allData = JSON.parse(rawData);

    // Keywords to exclude for temperature
    const excludedTemperatureKeywords = ["home realfeel temperature", "target temperature", "processor temperature", "bed", "nozzle"];
    const excludedEntities = ["number.oven_upper_temperature", "number.oven_lower_temperature"];

    // Filter temperature sensors
    temperatureSensors = allData.filter((entity) => {
      const isTemperature = entity.entity_id.toLowerCase().includes('temperature') ||
                            (entity.attributes?.device_class || '').toLowerCase() === 'temperature';
      const isValidState = entity.state.toLowerCase() !== 'unavailable' &&
                           entity.state.toLowerCase() !== 'unknown' &&
                           entity.state !== '';
      const isNotExcluded = !excludedTemperatureKeywords.some((keyword) =>
        (entity.attributes?.friendly_name || '').toLowerCase().includes(keyword)
      );
      const isNotExcludedEntity = !excludedEntities.includes(entity.entity_id);
      const isNotZeroForOven = !(excludedEntities.includes(entity.entity_id) && parseFloat(entity.state) === 0);
      return isTemperature && isValidState && isNotExcluded && isNotExcludedEntity && isNotZeroForOven;
    }).map((sensor) => ({
      ...sensor,
      state: Math.round(Number(sensor.state)), // Round state to the nearest whole number
      time_ago: sensor.last_changed ? timeAgo(sensor.last_changed) : 'Unknown',
    }));

    // Filter humidity sensors
    humiditySensors = allData.filter((entity) => {
      const isHumidity = entity.entity_id.toLowerCase().includes('humidity') ||
                         (entity.attributes?.device_class || '').toLowerCase() === 'humidity';
      const isValidState = entity.state.toLowerCase() !== 'unavailable' &&
                           entity.state.toLowerCase() !== 'unknown' &&
                           entity.state !== '';
      return isHumidity && isValidState;
    }).map((sensor) => ({
      ...sensor,
      state: Math.round(Number(sensor.state)), // Round state to the nearest whole number
      time_ago: sensor.last_changed ? timeAgo(sensor.last_changed) : 'Unknown',
    }));

    // Filter air quality sensors (AQI, VOCs, and Indoor Air Quality)
    airQualitySensors = allData.filter((entity) => {
      const isAirQuality = entity.entity_id.toLowerCase().includes('aqi') ||
                           entity.entity_id.toLowerCase().includes('voc') ||
                           entity.entity_id.toLowerCase().includes('quality_indoor_air_quality') ||
                           (entity.attributes?.device_class || '').toLowerCase().includes('air_quality');
      const isValidState = entity.state.toLowerCase() !== 'unavailable' &&
                           entity.state.toLowerCase() !== 'unknown' &&
                           entity.state !== '';
      return isAirQuality && isValidState;
    }).map((sensor) => ({
      ...sensor,
      state: Math.round(Number(sensor.state)), // Round state to the nearest whole number
      time_ago: sensor.last_changed ? timeAgo(sensor.last_changed) : 'Unknown',
    }));
  } catch (error) {
    console.error('Error loading or parsing output.json:', error.message);
  }
}




// Schedule the fetchData function to run every 15 minutes
cron.schedule('*/15 * * * *', () => {
  console.log('Running scheduled data fetch...');
  fetchData();
});

// Initial fetch and load data
fetchData();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { temperatureSensors, humiditySensors, airQualitySensors });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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
</body>
</html>
```

