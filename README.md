# Quakele

A daily puzzle game about real earthquakes. Every day a new M7+ earthquake is selected and you have to identify it - first by guessing the nearest major city, then the year it struck.

## How it works

- A new earthquake is featured each day (same one for all players, resets at midnight UTC)
- You get 5 guesses per round — city first, then year
- To make it easier, cities from the dropdown menu are displayed on the map

All earthquake data comes from the [USGS FDSN API](https://earthquake.usgs.gov/fdsnws/event/1/). No backend - the daily selection is seeded from the UTC date so it's deterministic in the browser.

## Running locally

```bash
bun install # installs the required dependencies
bun dev # starts an http server
bun run build   # production build
bun preview     # serve the production build
```
