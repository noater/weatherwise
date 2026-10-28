
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

    weatherResult.textContent =
      `Selected: ${place.name}, ${place.country}. ` +
      `Weather details coming next.`;
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
