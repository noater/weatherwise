
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getRecommendations
} = require("../public/recommendations.js");

const normalWeather = {
  temperature: 22,
  precipitation: 0,
  windSpeed: 10,
  weatherCode: 0
};

test("Cold weather recommends a warm coat", () => {
  const result = getRecommendations({
    ...normalWeather,
    temperature: 5
  });

  assert.match(result.clothing, /warm coat/);
});

test("Mild weather recommends a light jacket", () => {
  const result = getRecommendations({
    ...normalWeather,
    temperature: 15
  });

  assert.match(result.clothing, /light jacket/);
});

test("Hot weather recommends light clothing", () => {
  const result = getRecommendations({
    ...normalWeather,
    temperature: 35
  });

  assert.match(result.clothing, /light, comfortable/);
  assert.match(result.activity, /heat/);
});

test("Rain recommends an umbrella", () => {
  const result = getRecommendations({
    ...normalWeather,
    precipitation: 2
  });

  assert.match(result.clothing, /umbrella/);
  assert.match(result.activity, /indoor/);
});

test("Snow recommends waterproof shoes", () => {
  const result = getRecommendations({
    ...normalWeather,
    weatherCode: 73
  });

  assert.match(result.clothing, /waterproof shoes/);
  assert.match(result.activity, /indoor/);
});

test("Storm recommends staying indoors", () => {
  const result = getRecommendations({
    ...normalWeather,
    weatherCode: 95
  });

  assert.match(result.activity, /Stay indoors/);
});

test("Strong wind recommends indoor activity", () => {
  const result = getRecommendations({
    ...normalWeather,
    windSpeed: 40
  });

  assert.match(result.activity, /indoor/);
});

test("Missing weather data is handled", () => {
  const result = getRecommendations({
    ...normalWeather,
    temperature: undefined
  });

  assert.match(result.clothing, /unavailable/);
});
