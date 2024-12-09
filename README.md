# Home Assistant Sensor Dashboard

A real-time dashboard that displays sensor data from your Home Assistant instance, focusing on temperature, humidity, and air quality metrics. The dashboard updates automatically through WebSocket connections and provides an easy-to-read interface for monitoring your home environment.

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
   ```bash
   git clone https://github.com/drkpxl/HomeAssistantFirehose
   cd ha-sensor-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   ```bash
   cp sample.env .env
   ```

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
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3015
   ```

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

```css
:root {
    --bg-color: #F5E6D3;     /* Background color */
    --primary-color: #2A9D8F; /* Main accent color */
    --text-color: #264653;    /* Primary text color */
    /* ... other variables ... */
}
```

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

