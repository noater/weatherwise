
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");
let selectedCity = null;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (city.length < 2) {
    weatherResult.textContent = "Please enter at least 2 characters.";
    return;
  }

  weatherResult.textContent = "Searching for cities...";

  try {
    const response = await fetch(
      `/api/cities?name=${encodeURIComponent(city)}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "City search failed.");
    }

    if (!data.results || data.results.length === 0) {
      weatherResult.textContent = "No matching cities found.";
      return;
    }

    weatherResult.replaceChildren();

    const list = document.createElement("ul");

    
data.results.forEach((place) => {
  const item = document.createElement("li");
  const button = document.createElement("button");

  button.type = "button";

  button.textContent = [
    place.name,
    place.region,
    place.country
  ].filter(Boolean).join(", ");

 button.addEventListener("click", () => {
  selectedCity = place;
  displayCurrentWeather(place);
});

  item.appendChild(button);
  list.appendChild(item);
});


    weatherResult.appendChild(list);

  } catch (error) {
    weatherResult.textContent =
      error.message || "Unable to search for cities.";
  }
});

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if ((code >= 51 && code <= 67) ||
      (code >= 80 && code <= 82)) return "Rain or drizzle";
  if ((code >= 71 && code <= 77) ||
      (code >= 85 && code <= 86)) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorm";

  return "Other weather conditions";
}

async function displayCurrentWeather(place) {
  weatherResult.textContent =
    `Loading weather for ${place.name}...`;

  try {
    const params = new URLSearchParams({
      latitude: String(place.latitude),
      longitude: String(place.longitude)
    });

    const response = await fetch(`/api/weather?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Weather request failed");
    }

    const cityTitle = document.createElement("h3");
    cityTitle.textContent = `${place.name}, ${place.country}`;

    const details = document.createElement("p");
    details.textContent =
      `Temperature: ${data.temperature}°C | ` +
      `${getWeatherDescription(data.weatherCode)} | ` +
      `Wind: ${data.windSpeed} km/h | ` +
      `Precipitation: ${data.precipitation} mm`;

    weatherResult.replaceChildren(cityTitle, details);
    
    // Get clothing and activity recommendations
    const recommendations = getRecommendations(data);

    // Display clothing recommendation
    const clothingAdvice =
      document.getElementById("clothing-advice");

    clothingAdvice.textContent = recommendations.clothing;

    // Display activity recommendation
    const activityAdvice =
      document.getElementById("activity-advice");

    activityAdvice.textContent = recommendations.activity;
    // Display the 3-day weather forecast
displayForecast(data.forecast);


  } catch (error) {
    weatherResult.textContent =
      error.message || "Unable to load weather.";
  }
}

function displayForecast(forecast) {
  const forecastResult =
    document.getElementById("forecast-result");

  if (!Array.isArray(forecast) || forecast.length === 0) {
    forecastResult.textContent = "Forecast unavailable.";
    return;
  }

  const forecastGrid = document.createElement("div");
  forecastGrid.className = "forecast-grid";

  forecast.forEach((day) => {
    const card = document.createElement("div");
    card.className = "forecast-day";

    const date = document.createElement("h3");
    date.textContent = day.date;

    const temperature = document.createElement("p");
    temperature.textContent =
      `High: ${day.maxTemperature}°C | Low: ${day.minTemperature}°C`;

    const condition = document.createElement("p");
    condition.textContent =
      getWeatherDescription(day.weatherCode);

    card.append(date, temperature, condition);
    forecastGrid.appendChild(card);
  });

  forecastResult.replaceChildren(forecastGrid);
}


