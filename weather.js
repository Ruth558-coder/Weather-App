class WeatherApp {
    constructor() {
        this.apiKey = 'YOUR_API_KEY_HERE';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.getElements();
        this.bindEvents();
        this.getUserLocation();
    }

    getElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.errorMessage = document.getElementById('errorMessage');
        this.weatherContent = document.getElementById('weatherContent');
        
        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.country = document.getElementById('country');
        this.currentDate = document.getElementById('currentDate');
        this.currentTime = document.getElementById('currentTime');
        this.temperature = document.getElementById('temperature');
        this.feelsLike = document.getElementById('feelsLike');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.weatherDescription = document.getElementById('weatherDescription');
        this.windSpeed = document.getElementById('windSpeed');
        this.humidity = document.getElementById('humidity');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.forecast = document.getElementById('forecast');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchWeather());
        this.locationBtn.addEventListener('click', () => this.getUserLocation());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }

    showLoading() {
        this.loading.classList.remove('hidden');
        this.error.classList.add('hidden');
        this.weatherContent.classList.add('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showError(message) {
        this.hideLoading();
        this.error.classList.remove('hidden');
        this.errorMessage.textContent = message;
        this.weatherContent.classList.add('hidden');
    }

    showWeather() {
        this.hideLoading();
        this.error.classList.add('hidden');
        this.weatherContent.classList.remove('hidden');
    }

    async getUserLocation() {
        if (navigator.geolocation) {
            this.showLoading();
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    await this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    this.showError('Unable to get your location. Please search for a city manually.');
                }
            );
        } else {
            this.showError('Geolocation is not supported by your browser. Please search for a city manually.');
        }
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }

        this.showLoading();
        await this.getWeatherByCity(city);
    }

    async getWeatherByCity(city) {
        try {
            const currentWeatherResponse = await fetch(
                `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`
            );
            
            if (!currentWeatherResponse.ok) {
                throw new Error('City not found');
            }

            const currentWeather = await currentWeatherResponse.json();
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }

            const forecast = await forecastResponse.json();
            
            this.displayWeather(currentWeather, forecast);
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async getWeatherByCoords(lat, lon) {
        try {
            const currentWeatherResponse = await fetch(
                `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!currentWeatherResponse.ok) {
                throw new Error('Weather data not available');
            }

            const currentWeather = await currentWeatherResponse.json();
            const forecastResponse = await fetch(
                `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
            );
            
            if (!forecastResponse.ok) {
                throw new Error('Forecast data not available');
            }

            const forecast = await forecastResponse.json();
            
            this.displayWeather(currentWeather, forecast);
        } catch (error) {
            this.showError('Unable to fetch weather data. Please try again.');
        }
    }

    displayWeather(current, forecast) {
        // Display current weather
        this.cityName.textContent = current.name;
        this.country.textContent = current.sys.country;
        this.temperature.textContent = Math.round(current.main.temp);
        this.feelsLike.textContent = Math.round(current.main.feels_like);
        this.weatherDescription.textContent = current.weather[0].description;
        this.windSpeed.textContent = current.wind.speed;
        this.humidity.textContent = current.main.humidity;
        this.pressure.textContent = current.main.pressure;
        this.visibility.textContent = (current.visibility / 1000).toFixed(1);

        // Set weather icon
        const iconCode = current.weather[0].icon;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherIcon.alt = current.weather[0].description;

        // Set current date and time
        const now = new Date();
        this.currentDate.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        this.currentTime.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        // Display forecast
        this.displayForecast(forecast);

        this.showWeather();
    }

    displayForecast(forecast) {
        this.forecast.innerHTML = '';

        // Get daily forecasts (one per day at noon)
        const dailyForecasts = this.getDailyForecasts(forecast.list);

        dailyForecasts.forEach(day => {
            const date = new Date(day.dt * 1000);
            const temp = Math.round(day.main.temp);
            const iconCode = day.weather[0].icon;
            const description = day.weather[0].description;

            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}" class="forecast-icon">
                <div class="forecast-temp">${temp}°C</div>
                <div class="forecast-desc">${description}</div>
            `;

            this.forecast.appendChild(forecastItem);
        });
    }

    getDailyForecasts(forecastList) {
        const dailyForecasts = [];
        const processedDates = new Set();

        for (const item of forecastList) {
            const date = new Date(item.dt * 1000);
            const dateStr = date.toLocaleDateString();

            // Skip if we already have a forecast for this date
            if (processedDates.has(dateStr)) continue;

            // Try to find the forecast closest to noon (12:00)
            let bestItem = item;
            let minDiff = Math.abs(date.getHours() - 12);

            // Look for a better time slot for the same date
            for (const otherItem of forecastList) {
                const otherDate = new Date(otherItem.dt * 1000);
                if (otherDate.toLocaleDateString() === dateStr) {
                    const diff = Math.abs(otherDate.getHours() - 12);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestItem = otherItem;
                    }
                }
            }

            dailyForecasts.push(bestItem);
            processedDates.add(dateStr);

            // Stop after 5 days
            if (dailyForecasts.length >= 5) break;
        }

        return dailyForecasts;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// For demo purposes, you can use this sample data when API key is not available
class DemoWeatherApp extends WeatherApp {
    constructor() {
        super();
    }

    async getWeatherByCity(city) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Demo data
        const demoData = {
            name: city,
            sys: { country: 'Demo' },
            main: {
                temp: 22,
                feels_like: 20,
                humidity: 65,
                pressure: 1013
            },
            weather: [{
                description: 'partly cloudy',
                icon: '02d'
            }],
            wind: { speed: 3.5 },
            visibility: 10000
        };

        const demoForecast = {
            list: this.generateDemoForecast()
        };

        this.displayWeather(demoData, demoForecast);
    }

    async getWeatherByCoords(lat, lon) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoData = {
            name: 'Current Location',
            sys: { country: 'Demo' },
            main: {
                temp: 18,
                feels_like: 16,
                humidity: 70,
                pressure: 1015
            },
            weather: [{
                description: 'light rain',
                icon: '10d'
            }],
            wind: { speed: 2.8 },
            visibility: 8000
        };

        const demoForecast = {
            list: this.generateDemoForecast()
        };

        this.displayWeather(demoData, demoForecast);
    }

    generateDemoForecast() {
        const forecasts = [];
        const baseTime = Date.now() / 1000;
        const weatherTypes = [
            { description: 'sunny', icon: '01d' },
            { description: 'partly cloudy', icon: '02d' },
            { description: 'cloudy', icon: '03d' },
            { description: 'light rain', icon: '10d' },
            { description: 'clear', icon: '01n' }
        ];

        for (let i = 0; i < 40; i++) {
            const weatherType = weatherTypes[i % weatherTypes.length];
            forecasts.push({
                dt: baseTime + (i * 3 * 3600),
                main: {
                    temp: 15 + Math.random() * 15,
                    humidity: 50 + Math.random() * 30,
                    pressure: 1000 + Math.random() * 30
                },
                weather: [weatherType],
                wind: { speed: 1 + Math.random() * 5 },
                visibility: 5000 + Math.random() * 10000
            });
        }

        return forecasts;
    }
}

// Check if API key is set, otherwise use demo mode
const apiKey = 'YOUR_API_KEY_HERE';
if (apiKey === 'YOUR_API_KEY_HERE') {
    console.log('Using demo mode. To get real weather data, sign up at https://openweathermap.org/api and replace YOUR_API_KEY_HERE in script.js');
    document.addEventListener('DOMContentLoaded', () => {
        new DemoWeatherApp();
    });
}
