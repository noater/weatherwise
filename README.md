# WeatherWise 🌤️

**Check the weather. Plan your day.**

## Project Description

WeatherWise is a web application that helps users check weather conditions and plan their day with personalized clothing and activity recommendations.

This project was developed as part of a web development practices course, focusing on Git, Agile, testing, security, Docker, and CI/CD.

## Features

- Search for cities using the Open-Meteo Geocoding API.
- View current weather conditions, including temperature, wind, and precipitation.
- Receive clothing recommendations based on weather conditions.
- Receive activity recommendations based on weather conditions.
- View a three-day weather forecast.

The application uses real weather data provided by Open-Meteo.

## Technologies

- **Backend:** Node.js, Express.js
- **Frontend:** HTML, CSS, JavaScript
- **Weather data:** Open-Meteo API
- **Version control:** Git and GitHub
- **Project management:** GitHub Projects (Kanban)
- **Testing:** Node.js built-in test runner
- **Continuous integration:** GitHub Actions
- **Containerization:** Docker
- **Logging:** Custom Node.js file logger

## Installation

1. Clone the repository:

   `git clone https://github.com/noater/weatherwise.git`

2. Open the project folder:

   `cd weatherwise`

3. Install dependencies:

   `npm install`

4. Start the server:

   `node server.js`

5. Open the application in your browser:

   http://localhost:3000

**Windows PowerShell:** Use `npm.cmd install` if the `npm` command is blocked by the PowerShell execution policy.

## API Endpoints

### GET /api/cities

Searches for cities using Open-Meteo.

Example:

`http://localhost:3000/api/cities?name=London`

Returns matching city information, including coordinates.

### GET /api/weather

Retrieves current weather and a three-day forecast for the requested coordinates.

Example:

`http://localhost:3000/api/weather?latitude=32.08&longitude=34.78`

Returns weather data in JSON format.

The server validates input and returns HTTP 400 for invalid parameters.

## Project Structure

- `server.js` — Express server and API endpoints
- `logger.js` — File-based logging utility
- `public/index.html` — Application page structure
- `public/style.css` — Website styling
- `public/script.js` — Frontend interactions and weather display
- `public/recommendations.js` — Clothing and activity recommendation rules
- `tests/recommendations.test.js` — Recommendation unit tests
- `tests/weather.test.js` — Backend API tests
- `Dockerfile` — Docker container configuration
- `.dockerignore` — Files excluded from Docker builds
- `.github/workflows/ci.yml` — Automated test workflow
- `.github/workflows/docker.yml` — Docker build and smoke-test workflow
- `package.json` — Project metadata, scripts, and dependencies
- `package-lock.json` — Locked dependency versions
- `LICENSE` — WeatherWise project license
- `ALL_LICENSES.md` — Selected third-party dependency licenses

## Testing

WeatherWise includes **13 automated tests**:

- 9 unit tests for clothing and activity recommendation rules.
- 4 backend API tests for input validation and successful API responses.

Run all tests using:

`npm test`

On Windows PowerShell:

`npm.cmd test`

Tests also run automatically through GitHub Actions when code is pushed or a Pull Request is opened, according to the configured workflow triggers.

## Logging

WeatherWise uses a custom logging utility implemented with Node.js built-in modules.

Logs are written to `logs/app.log` and displayed in the terminal.

Three logging levels are supported:

- **INFO** — Normal application events and completed HTTP requests.
- **WARN** — Invalid city-search input.
- **ERROR** — API failures and server errors handled by the application.

HTTP request logs include the request method, path, response status, and timestamp.

The `logs/` directory is excluded from Git using `.gitignore`.

## Docker and CI/CD

The project includes a Dockerfile for packaging the application into a container.

GitHub Actions workflows automatically:

- Run the project's automated tests.
- Build a Docker image.
- Run a Docker smoke test to verify the containerized application responds.

Docker build and smoke testing were verified using GitHub-hosted runners.

## Security

WeatherWise applies input validation to its API parameters, including city names and geographic coordinates.

Invalid inputs are rejected with appropriate HTTP error responses.

The application uses external weather APIs but does not have a user authentication system or a SQL database.

## Development Workflow

Development followed an Agile Kanban workflow using GitHub Projects and GitHub Issues.

Features were developed on separate Git branches and integrated through Pull Requests.

The project includes peer code reviews, review comments, corrections, and documented test results.

## Licensing

WeatherWise is released under the **MIT License**. See the `LICENSE` file for the complete terms.

Selected third-party package licenses are documented in `ALL_LICENSES.md`, including Express, qs, and cookie.

## Contributors

- **Noa Terliuc** — Project development
- **Dani** — Peer code review and feedback