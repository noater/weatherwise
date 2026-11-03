
const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server.js");

let server;
let baseUrl;

// Start a temporary server for testing
before(async () => {
  server = await new Promise((resolve) => {
    const instance = app.listen(0, () => {
      resolve(instance);
    });
  });

  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

// Close the server when testing finishes
after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) reject(error);
      else resolve();
    });
  });
});

// Test 1 - Missing coordinates
test("Weather API rejects missing coordinates", async () => {
  const response = await fetch(`${baseUrl}/api/weather`);
  const data = await response.json();

  assert.equal(response.status, 400);
  assert.equal(data.error, "Invalid location coordinates.");
});

// Test 2 - Invalid latitude
test("Weather API rejects invalid latitude", async () => {
  const response = await fetch(
    `${baseUrl}/api/weather?latitude=200&longitude=0`
  );

  const data = await response.json();

  assert.equal(response.status, 400);
  assert.equal(data.error, "Invalid location coordinates.");
});

test("Weather API returns current weather and forecast", async () => {
  // Save the original fetch function
  const realFetch = global.fetch;

  // Mock the external Open-Meteo API
  global.fetch = async (url, options) => {
    if (String(url).startsWith("https://api.open-meteo.com/v1/forecast?")) {
      return {
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 22,
            weather_code: 0,
            wind_speed_10m: 10,
            precipitation: 0
          },
          daily: {
            time: ["2026-11-01", "2026-11-02", "2026-11-03"],
            temperature_2m_max: [25, 24, 23],
            temperature_2m_min: [16, 15, 14],
            weather_code: [0, 1, 3]
          }
        })
      };
    }

    return realFetch(url, options);
  };

  try {
    // Request weather from our Express server
    const response = await realFetch(
      `${baseUrl}/api/weather?latitude=32.08&longitude=34.78`
    );

    const data = await response.json();

    // Verify the current weather
    assert.equal(response.status, 200);
    assert.equal(data.temperature, 22);
    assert.equal(data.weatherCode, 0);
    assert.equal(data.windSpeed, 10);
    assert.equal(data.precipitation, 0);

    // Verify the forecast
    assert.equal(data.forecast.length, 3);
    assert.equal(data.forecast[0].maxTemperature, 25);
    assert.equal(data.forecast[2].minTemperature, 14);

  } finally {
    // Restore the original fetch
    global.fetch = realFetch;
  }
});

test("City API returns matching cities", async () => {
  const realFetch = global.fetch;

  // Mock the Open-Meteo Geocoding API
  global.fetch = async (url, options) => {
    if (
      String(url).startsWith(
        "https://geocoding-api.open-meteo.com/v1/search?"
      )
    ) {
      return {
        ok: true,
        json: async () => ({
          results: [
            {
              id: 123,
              name: "Tel Aviv",
              country: "Israel",
              admin1: "Tel Aviv",
              latitude: 32.08,
              longitude: 34.78
            }
          ]
        })
      };
    }

    return realFetch(url, options);
  };

  try {
    const response = await realFetch(
      `${baseUrl}/api/cities?name=Tel%20Aviv`
    );

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.results.length, 1);
    assert.equal(data.results[0].name, "Tel Aviv");
    assert.equal(data.results[0].country, "Israel");
    assert.equal(data.results[0].latitude, 32.08);
    assert.equal(data.results[0].longitude, 34.78);

  } finally {
    global.fetch = realFetch;
  }
});


