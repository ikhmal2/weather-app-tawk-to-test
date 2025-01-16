<template>
  <div v-if="Object.keys(weatherData).length !== 0" class="weather-card">
    <div class="location">
      <div class="location-details">
        <p class="location-name">My Location</p>
        <p class="location-subname">{{ locationName }}</p>
      </div>
      <div class="location-weather">{{ weatherData.current.weather[0].description }}</div>
      <div class="location-weather">
        {{
          new Date(weatherData.currentTime).toLocaleTimeString(
            "en-us",
            {
              timeStyle: "short",
            }
          )
        }}</div>
    </div>
    <div class="temperature">
      <div class="current-temperature">{{ Math.round(weatherData.current.temp) }} °</div>
      <div class="hi-low">H: {{ todayWeather.hi }}° L:{{ todayWeather.low }}°</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'

const position = ref<GeolocationPosition>();

const errMsg = ref('')
const weatherData = ref({})
const locationName = ref('');

async function getWeatherData(pos: GeolocationPosition) {
  const lat = await pos.coords.latitude
  const long = await pos.coords.longitude
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
    getLocationName(lat, long)
    weatherData.value = resp.data;
  } catch (err) {
    console.log(err);
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
        position.value = pos;
        getWeatherData(pos)
      },
      (error) => {
        if (position.value) errMsg.value = `Error getting location: ${error.message}`;
      }
    );
  } else {
    if (position.value) errMsg.value = 'Geolocation is not supported by this browser.';
  }
}

const todayWeather = computed(() => {
  const weatherDetails = {
    temp: 0,
    hi: 0,
    low: 0,
    weather: '',
  }

  if (!weatherData.value?.list?.length) return weatherDetails

  const today = new Date().toISOString().slice(0, 10)

  const todayData = weatherData.value.list.find((item) => {
    const itemDate = item.dt_txt
    return itemDate.includes(today)
  })

  if (todayData) {
    weatherDetails.temp = Math.round(todayData.main.temp)
    weatherDetails.hi = Math.round(todayData.main.temp_max)
    weatherDetails.low = Math.round(todayData.main.temp_min)
    weatherDetails.weather = todayData.weather[0]?.description || ''
  }

  return weatherDetails
})
onMounted(() => {
  getLocation()
})
</script>

<style scoped>
.weather-card {
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 1px dotted red;
  background-color: black;
  color: white;
  padding: 0.5rem;
  border-radius: 16px;
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

.temperature>.current-temperature {
  font-size: 3.3125rem;
  line-height: 63.25px;
}

.temperature>.hi-low {
  font-size: 0.9375rem;
  line-height: 20px;
}
</style>
