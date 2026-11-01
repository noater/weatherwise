
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const weatherResult = document.getElementById("weather-result");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    weatherResult.textContent = "Please enter a city name.";
    return;
  }

  weatherResult.textContent =
    `Weather search for ${city} is coming soon!`;
});
