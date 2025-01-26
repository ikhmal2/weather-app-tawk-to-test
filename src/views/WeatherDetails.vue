<template>
  <WeatherSection v-if="weatherData" :weather-data="weatherData" />
  <HourlyForecast v-if="weatherData" :weather-data="weatherData" />
  <DailyForecast v-if="weatherData" :weather-data="weatherData" />
</template>

<script setup lang="ts">
import WeatherSection from '@/components/WeatherSection.vue';
import HourlyForecast from '@/components/HourlyForecast.vue';
import DailyForecast from '@/components/DailyForecast.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { Current, Openweather } from '@/types';
import { useLoadingState } from '@/store';

const route = useRoute();
const lat = route.query.lat as unknown as number;
const long = route.query.long as unknown as number;

const store = useLoadingState();

const weatherData = ref<Openweather>();

const getWeatherData = async () => {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&&exclude=minutely,&appid=${import.meta.env.VITE_WEATHEROPENAPI__KEY}`;
  try {
    store.updateLoadingState(true);
    const resp = await axios.get(url);
    store.updateLoadingState(false);
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = resp.data.current.dt * 1000 + localOffset;
    resp.data.currentTime = utc + 1000 * resp.data.timezone_offset;

    resp.data.hourly.forEach((hour: Current) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * resp.data.timezone_offset;
    });

    resp.data.daily.shift();
    weatherData.value = resp.data;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getWeatherData();
});
</script>

<style scoped>
.forecast {
  padding: 2rem;
}

.forecast-title {
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 23.87px;
}
</style>
