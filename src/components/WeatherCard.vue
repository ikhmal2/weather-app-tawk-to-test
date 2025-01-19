<template>
  <div v-if="weatherData" class="weather-card night">
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
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { Openweather } from '@/types'

const position = ref<GeolocationPosition>()

const errMsg = ref('')
const weatherData = ref<Openweather>()
const locationName = ref('')

async function getWeatherData(pos: GeolocationPosition) {
  const lat = await pos.coords.latitude
  const long = await pos.coords.longitude
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&appid=${import.meta.env.VITE_WEATHEROPENAPI__KEY}`
  try {
    const resp = await axios.get(url)

    // cal current date & time
    const localOffset = new Date().getTimezoneOffset() * 60000
    const utc = resp.data.current.dt * 1000 + localOffset
    resp.data.currentTime = utc + 1000 * resp.data.timezone_offset

    // cal hourly weather offset
    resp.data.hourly.forEach((hour) => {
      const utc = hour.dt * 1000 + localOffset
      hour.currentTime = utc + 1000 * resp.data.timezone_offset
    })
    getLocationName(lat, long)
    weatherData.value = resp.data
  } catch (err) {
    console.log(err)
  }
}

async function getLocationName(lat, long) {
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&limit=1&types=place&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`
  const resp = await axios.get(url)
  locationName.value = resp.data.features[0].properties.name
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = pos
        getWeatherData(pos)
      },
      (error) => {
        if (position.value) errMsg.value = `Error getting location: ${error.message}`
      },
    )
  } else {
    if (position.value) errMsg.value = 'Geolocation is not supported by this browser.'
  }
}

onMounted(() => {
  getLocation()
})
</script>

<style scoped>
.weather-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: white;
  padding: 0.5rem;
  border-radius: 16px;
}

.night {
  background-image: url(../assets/img/night.png);
}

.day {
  background-image: url(../assets/img/day.png);
}

.location {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
