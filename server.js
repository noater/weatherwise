
const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Search for cities using Open-Meteo
app.get("/api/cities", async (req, res) => {
  const city = req.query.name;

  // Validate the user's input
  if (
    typeof city !== "string" ||
    city.trim().length < 2 ||
    city.length > 100
  ) {
    return res.status(400).json({
      error: "Please enter a valid city name."
    });
  }

  try {
    const params = new URLSearchParams({
      name: city.trim(),
      count: "5",
      language: "en",
      format: "json"
    });

    const url =
      `https://geocoding-api.open-meteo.com/v1/search?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    const cities = (data.results || []).map((place) => ({
      id: place.id,
      name: place.name,
      country: place.country,
      region: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude
    }));

    res.json({ results: cities });

  } catch (error) {
    console.error("City search error:", error.message);

    res.status(502).json({
      error: "Unable to search for cities right now."
    });
  }
});

/* Get current weather for a selected location */
app.get("/api/weather", async (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate coordinates
  if (
    typeof latitude !== "string" ||
    typeof longitude !== "string" ||
    !latitude.trim() ||
    !longitude.trim()
  ) {
    return res.status(400).json({
      error: "Invalid location coordinates."
    });
  }

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return res.status(400).json({
      error: "Invalid location coordinates."
    });
  }

  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current:
        "temperature_2m,weather_code,wind_speed_10m,precipitation",
      timezone: "auto"
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error("Current weather data unavailable");
    }

    res.json({
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation
    });

  } catch (error) {
    console.error("Weather API error:", error.message);

    res.status(502).json({
      error: "Unable to retrieve weather information."
    });
  }
});


app.listen(PORT, () => {
  console.log(`WeatherWise running at http://localhost:${PORT}`);
});
