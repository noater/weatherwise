
const express = require("express");
const path = require("node:path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the frontend files from the public folder
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`WeatherWise running at http://localhost:${PORT}`);
});
