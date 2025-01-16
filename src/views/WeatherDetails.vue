<template>
  <!-- <section v-if="Object.keys(weatherData).length !== 0" class="main"> -->
  <section v-if="weatherData" class="main">
    <div class="highlight">

      <div class="nav">
        <RouterLink to="/">
          <img src="../assets/img/left-white.svg" alt="Left" />
        </RouterLink>
        <div class="name">{{ name }}</div>
        <img @click="saveWeather" src="../assets/img/add.svg" alt="Add">
      </div>

      <div class="main-date"> {{
        new Date(weatherData.currentTime).toLocaleDateString(
          "en-GB",
          {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          }
        )
      }}</div>
      div.
      <div class="temperature">
        <div class="current-temperature">{{ Math.round(weatherData.current.temp) }} °C</div>
      </div>
      <div class="current-weather">{{ weatherData.current.weather[0].description }}</div>
      <div class="last-update">Last Update {{
        new Date(weatherData.currentTime).toLocaleTimeString(
          "en-us",
          {
            timeStyle: "short",
          }
        )
      }}</div>

    </div>

  </section>
  <section class="forecast">
    <div>Hourly Forecast</div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Openweather } from '@/types';
const route = useRoute();

const lat = route.query.lat
const long = route.query.long
const name = route.query.name

console.log(lat, long);

const weatherData = ref<Openweather>()

async function getWeatherData() {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&appid=${import.meta.env.VITE_WEATHEROPENAPI__KEY}`
  try {
    const resp = await axios.get(url);

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = resp.data.current.dt * 1000 + localOffset;
    resp.data.currentTime =
      utc + 1000 * resp.data.timezone_offset;

    // cal hourly weather offset
    resp.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime =
        utc + 1000 * resp.data.timezone_offset;
    });
    weatherData.value = resp.data;
  } catch (err) {
    console.log(err);
  }
}

function saveWeather() {

}

onMounted(() => {
  getWeatherData()
})
</script>

<style scoped>
.highlight {
  padding: 2rem;
  background: linear-gradient(118.25deg, #4F80FA 1.2%, #3764D7 59.26%, #335FD1 79.2%);
  color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.nav {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.name {
  font-size: .875rem;
}

.main-date {
  text-align: center;
}

.forecast {
  padding: 2rem;
}
</style>
