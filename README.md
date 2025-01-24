# Weather App tawk.to Test

The project is a simple weather app that fetches weather data from an API and displays it to the user. The app uses Vue 3 + Vite + TypeScript for its frontend development. It also includes Pinia for state management.The app fetches weather data from an API and displays it to the user.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar).

## Project Setup

Replace the `VITE_MAPBOX_API_KEY` and `VITE_WEATHEROPENAPI__KEY` in `.env` file with your own API keys.
[MapBox](http://docs.mapbox.com/help/getting-started/access-tokens/)
[WeatherOpenAPI](https://openweathermap.org/api/one-call-3)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### To deploy to Github Pages

```sh
npm run build
git subtree push --prefix dist origin gh-pages
```
