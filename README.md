# Weather App

A modern, responsive weather application built with HTML, CSS, and JavaScript. Features real-time weather data, 5-day forecasts, geolocation support, and a beautiful user interface.

## Features

- **Real-time Weather Data**: Get current weather information for any city
- **5-Day Forecast**: View weather predictions for the next 5 days
- **Geolocation Support**: Automatically get weather for your current location
- **City Search**: Search for weather in any city worldwide
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds and smooth animations
- **Weather Details**: Wind speed, humidity, pressure, and visibility information

## Demo Mode

The app currently runs in demo mode, showing sample weather data. To get real weather data:

1. Sign up for a free API key at [OpenWeatherMap](https://openweathermap.org/api)
2. Open `script.js` and replace `YOUR_API_KEY_HERE` with your actual API key
3. Save the file and refresh the browser

## Setup Instructions

### Option 1: Direct File Opening
1. Download or clone all files to a folder
2. Open `index.html` in your web browser

### Option 2: Local Server (Recommended)
1. Install Node.js if not already installed
2. Install a simple HTTP server:
   ```bash
   npm install -g http-server
   ```
3. Navigate to the project folder and run:
   ```bash
   http-server
   ```
4. Open `http://localhost:8080` in your browser

### Option 3: Using Python
1. Navigate to the project folder
2. Run:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
3. Open `http://localhost:8000` in your browser

## Usage

1. **Get Weather by Location**: Click the location button (📍) to get weather for your current location
2. **Search by City**: Type a city name in the search box and press Enter or click the search button
3. **View Details**: The app displays current weather conditions and a 5-day forecast

## File Structure

```
Weather App/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## Technologies Used

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **JavaScript (ES6+)**: Modern JavaScript with classes and async/await
- **OpenWeatherMap API**: Real weather data (requires API key)
- **Font Awesome**: Weather and UI icons
- **Google Fonts**: Inter font family for typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## API Integration

The app uses the OpenWeatherMap API for weather data:

- **Current Weather**: `/weather` endpoint
- **5-Day Forecast**: `/forecast` endpoint
- **Geocoding**: Automatic location detection

## Customization

### Colors and Themes
Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4a90e2;
    --secondary-color: #f39c12;
    --background-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /* ... more variables */
}
```

### Units
The app displays temperature in Celsius by default. To change to Fahrenheit:
1. Modify the API calls to use `units=imperial` instead of `units=metric`
2. Update the temperature display units in the HTML and CSS

## Troubleshooting

### Common Issues

1. **Geolocation not working**: Make sure you've allowed location access in your browser
2. **API errors**: Check your API key and internet connection
3. **CORS issues**: Use a local server instead of opening files directly

### Error Messages

- "City not found": Check the spelling of the city name
- "Unable to get your location": Enable location services in your browser
- "Weather data not available": Check your internet connection and API key

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the MIT License.
