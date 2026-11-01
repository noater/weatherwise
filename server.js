
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

app.listen(PORT, () => {
  console.log(`WeatherWise running at http://localhost:${PORT}`);
});
