import cacheService from './cacheService.js';

class WeatherService {
    constructor() {
        this.baseUrl = 'https://api.weatherbit.io/v2.0';
        this.cacheTTL = {
            current: 3600000,
            forecast: 7200000
        };
    }

    getApiKey() {
        return process.env.WEATHERBIT_API_KEY;
    }

    getBaseUrl() {
        return process.env.WEATHERBIT_BASE_URL || this.baseUrl;
    }

    getCacheTTL() {
        return {
            current: parseInt(process.env.CACHE_TTL_WEATHER) || this.cacheTTL.current,
            forecast: parseInt(process.env.CACHE_TTL_FORECAST) || this.cacheTTL.forecast
        };
    }

    async getCurrentWeather(lat, lng) {
        const cacheKey = `weather_current_${lat}_${lng}`;
         
        if (cacheService.has(cacheKey)) {
          
            return cacheService.get(cacheKey);
        }

        try {
            const url = `${this.getBaseUrl()}/current?lat=${lat}&lon=${lng}&key=${this.getApiKey()}&units=M`;
          
            
            const response = await fetch(url);
          
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
           
            
            const weatherData = this.formatCurrentWeather(data);
            cacheService.set(cacheKey, weatherData, this.getCacheTTL().current);
            return weatherData;
            
        } catch (error) {
            console.error(' Error fetching current weather:', error);
            throw error;
        }
    }

    async getWeatherForecast(lat, lng, days = 7) {
        const cacheKey = `weather_forecast_${lat}_${lng}_${days}`;
        
        if (cacheService.has(cacheKey)) {
            return cacheService.get(cacheKey);
        }

        try {
            const url = `${this.getBaseUrl()}/forecast/daily?lat=${lat}&lon=${lng}&days=${days}&key=${this.getApiKey()}&units=M`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            const forecastData = this.formatForecast(data);
            
            cacheService.set(cacheKey, forecastData, this.getCacheTTL().forecast);
            return forecastData;
            
        } catch (error) {
            console.error('Error fetching weather forecast:', error);
            throw error;
        }
    }

    formatCurrentWeather(data) {
        if (!data.data || data.data.length === 0) {
            throw new Error('No weather data received');
        }

        const weather = data.data[0];
        return {
            temperature: weather.temp,
            feelsLike: weather.app_temp,
            humidity: weather.rh,
            windSpeed: weather.wind_spd,
            windDirection: weather.wind_dir,
            pressure: weather.pres,
            precipitation: weather.precip,
            condition: weather.weather.description,
            icon: weather.weather.icon,
            timestamp: new Date().toISOString(),
            location: {
                lat: weather.lat,
                lng: weather.lon,
                city: weather.city_name,
                country: weather.country_code
            }
        };
    }

    formatForecast(data) {
        if (!data.data || data.data.length === 0) {
            throw new Error('No forecast data received');
        }

        return {
            location: {
                lat: data.lat,
                lng: data.lon,
                city: data.city_name,
                country: data.country_code
            },
            forecast: data.data.map(day => ({
                date: day.valid_date,
                maxTemp: day.max_temp,
                minTemp: day.min_temp,
                precipitation: day.precip,
                humidity: day.rh,
                windSpeed: day.wind_spd,
                condition: day.weather.description,
                icon: day.weather.icon
            })),
            timestamp: new Date().toISOString()
        };
    }

    getCacheStats() {
        return cacheService.getStats();
    }

    clearCache() {
        cacheService.clear();
    }
}

export default new WeatherService(); 