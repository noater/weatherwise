
function getRecommendations(weather) {
  const {
    temperature,
    precipitation,
    windSpeed,
    weatherCode
  } = weather;

  if (
    ![temperature, precipitation, windSpeed, weatherCode]
      .every(Number.isFinite)
  ) {
    return {
      clothing: "Weather information is unavailable.",
      activity: "Please try again later."
    };
  }

  const rainy =
    precipitation > 0 ||
    (weatherCode >= 51 && weatherCode <= 67) ||
    (weatherCode >= 80 && weatherCode <= 82);

  const snowy =
    (weatherCode >= 71 && weatherCode <= 77) ||
    (weatherCode >= 85 && weatherCode <= 86);

  const stormy = weatherCode >= 95 && weatherCode <= 99;

  let clothing;

  if (temperature < 10) {
    clothing = "Wear a warm coat.";
  } else if (temperature < 20) {
    clothing = "A light jacket is recommended.";
  } else {
    clothing = "Wear light, comfortable clothing.";
  }

  if (rainy) {
    clothing += " Bring an umbrella or raincoat.";
  }

  if (snowy) {
    clothing += " Wear warm, waterproof shoes.";
  }

  let activity;

  if (stormy) {
    activity = "Stay indoors until the storm passes.";
  } else if (rainy || snowy || windSpeed >= 35) {
    activity = "Consider an indoor activity today.";
  } else if (temperature >= 32) {
    activity = "Avoid strenuous outdoor activities in the heat.";
  } else {
    activity = "Great weather for a walk or outdoor activity!";
  }

  return { clothing, activity };
}

// Export function for Node.js automated tests
if (typeof module !== "undefined") {
  module.exports = { getRecommendations };
}
