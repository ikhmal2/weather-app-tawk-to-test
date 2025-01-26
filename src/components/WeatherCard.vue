<template>
  <div
    @click="goToWeatherDetails"
    v-if="weatherData && weather && weather.current && store.showCurrent"
    class="weather-card"
    :class="[dayTime ? 'day' : 'night']"
  >
    <div class="location">
      <div class="location-details">
        <p class="location-name">My Location</p>
        <p class="location-subname">{{ locationName }}</p>
      </div>
      <div class="location-weather">{{ weatherData.current.weather[0].description }}</div>
    </div>
    <div class="temperature">
      <div class="current-temperature">{{ Math.round(weatherData.current.temp) }} °</div>
      <div class="hi-low">
        H: {{ Math.round(weatherData.daily[0].temp.max) }}° L:{{
          Math.round(weatherData.daily[0].temp.min)
        }}°
      </div>
    </div>
  </div>
  <div
    @click="goToWeatherDetails"
    v-if="weather && weatherData && !weather.current"
    class="weather-card"
    :class="[dayTime ? 'day' : 'night']"
  >
    <div class="location">
      <div class="location-details">
        <p class="location-subname">{{ locationName }}</p>
        <p class="time">
          {{
            new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
              timeStyle: 'short',
            })
          }}
        </p>
      </div>
      <div class="location-weather">{{ weatherData.current.weather[0].description }}</div>
    </div>
    <div class="temperature">
      <div class="current-temperature">{{ Math.round(weatherData.current.temp) }} °</div>
      <div class="hi-low">
        H: {{ Math.round(weatherData.daily[0].temp.max) }}° L:{{
          Math.round(weatherData.daily[0].temp.min)
        }}°
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { Current, Openweather } from '@/types';
import { useWeather, useLoadingState, storedLocations } from '@/store';
import router from '@/router';

const props = defineProps({
  weather: {
    type: [Object],
    required: false,
  },
});

const position = ref<GeolocationPosition>();
const store = useWeather();
const loadingStore = useLoadingState();

const errMsg = ref('');
const weatherData = ref<Openweather>();
const locationName = ref('');

async function getWeatherData(lat: number, long: number) {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&&exclude=minutely,&appid=${import.meta.env.VITE_WEATHEROPENAPI__KEY}`;
  try {
    loadingStore.updateLoadingState(true);
    const resp = await axios.get(url);
    loadingStore.updateLoadingState(false);

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000;
    const utc = resp.data.current.dt * 1000 + localOffset;
    resp.data.currentTime = utc + 1000 * resp.data.timezone_offset;

    // cal hourly weather offset
    resp.data.hourly.forEach((hour: Current) => {
      const utc = hour.dt * 1000 + localOffset;
      hour.currentTime = utc + 1000 * resp.data.timezone_offset;
    });
    getLocationName(lat, long);
    weatherData.value = resp.data;
    if (!props.weather) {
      const currentLocation: storedLocations = {
        longitude: long,
        latitude: lat,
        name: locationName.value,
      };
      store.addList(currentLocation);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getLocationName(lat: number, long: number) {
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&limit=1&types=place&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`;
  const resp = await axios.get(url);
  locationName.value = resp.data.features[0].properties.name;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = pos;
        getWeatherData(pos.coords.latitude, pos.coords.longitude);
      },
      (error) => {
        if (position.value) errMsg.value = `Error getting location: ${error.message}`;
      },
    );
  } else {
    if (position.value) errMsg.value = 'Geolocation is not supported by this browser.';
  }
}

const dayTime = computed(() => {
  let currTime;
  if (weatherData.value) {
    currTime = new Date(weatherData.value.currentTime);
  } else if (props.weather && !weatherData.value) {
    currTime = new Date(props.weather.data.currentTime);
  }

  if (!currTime) return true;

  const hours = currTime.getHours();

  return hours >= 6 && hours < 18;
});

function goToWeatherDetails() {
  router.push({
    name: 'weather',
    query: {
      long: props.weather?.longitude,
      lat: props.weather?.latitude,
      name: props.weather?.name,
      current: props.weather?.current,
    },
  });
}

onMounted(() => {
  if (!props.weather) {
    getLocation();
  } else if (props.weather) {
    getWeatherData(props.weather.latitude, props.weather.longitude);
  }
});
</script>

<style scoped>
.weather-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: white;
  padding: 0.5rem;
  border-radius: 16px;
  background-repeat: no-repeat;
  background-size: cover;
}

.night {
  background-color: #24282f;
  background-image: url(../assets/img/night.png);
}

.day {
  background-color: #2a4e7b;
  background-image: url(../assets/img/day.png);
}

.location {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 0.5rem;
  padding-top: 0.2rem;
}

.location-name {
  font-weight: bold;
  font-size: 1.5625rem;
  line-height: 1.8644rem;
}

.location-subname {
  line-height: 1.25rem;
  font-weight: 500;
}

.location-weather {
  line-height: 1.25rem;
  font-weight: 500;
  text-transform: capitalize;
}

.temperature {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.temperature > .current-temperature {
  font-size: 3.3125rem;
  line-height: 63.25px;
}

.temperature > .hi-low {
  font-size: 0.9375rem;
  line-height: 20px;
}
</style>
