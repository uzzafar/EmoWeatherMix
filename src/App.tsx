import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmojiWeatherMixer: React.FC = () => {
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [emojiGif, setEmojiGif] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryList, setCountryList] = useState<string[]>([]);

  const fetchCountryList = async () => {
    try {
      const countryResponse = await axios.get('https://restcountries.com/v3.1/all');
      const countries = countryResponse.data;
      const countryNames = countries.map((country: any) => country.name.common);
      setCountryList(countryNames);
    } catch (error) {
      console.error('Error fetching country list:', error);
      alert('Error fetching country list')
    }
  };

  const fetchData = async (country: string | null = null) => {
    try {
      let selectedCountryName = country;

      if (!selectedCountryName) {
        const randomIndex = Math.floor(Math.random() * countryList.length);
        selectedCountryName = countryList[randomIndex];
        setSelectedCountry(selectedCountryName);
      }

      const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountryName}&appid=67ecc74b00d86c3418a6134e56ef3d54`);
      setWeatherData(weatherResponse.data);

      const weatherDescription = weatherResponse.data.weather[0].description;
      const giphyResponse = await axios.get(`https://api.giphy.com/v1/gifs/search?q=${weatherDescription}&api_key=J3942ZbRQ17kDDHep5X7NuaZIARWdXkj&limit=1`);
      
      if (giphyResponse.data.data.length > 0) {
        setEmojiGif(giphyResponse.data.data[0].images.original.url);
      } else {
        setEmojiGif(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data:');
      fetchData();
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value;
    setSelectedCountry(selectedCountry);
    fetchData(selectedCountry);
  };

  useEffect(() => {
    fetchCountryList();
  }, []);

  useEffect(() => {
    if (countryList.length > 0) {
      fetchData();
    }
  }, [countryList]);

  return (
    <div className="weather-container">
      <h1>Emoji Weather Mixer</h1>
      {selectedCountry && (
        <p>Weather in {selectedCountry}</p>
      )}
      <div className="select-container">
        <label htmlFor="countrySelect">Select Country:</label>
        <select id="countrySelect" value={selectedCountry || ''} onChange={handleCountryChange}>
          <option value="" disabled>Select a country</option>
          {countryList.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {weatherData && (
        <div>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      )}
      {emojiGif && (
        <img src={emojiGif} alt="Emoji GIF" />
      )}
      <div className="refresh-button">
        <button onClick={handleRefresh}>Refresh</button>
      </div>
    </div>
  );
};

export default EmojiWeatherMixer;
