<template>
  <section v-if="weatherData" class="main">
    <div class="highlight">
      <div class="nav">
        <RouterLink to="/">
          <img src="../assets/img/left-white.svg" alt="Left" />
        </RouterLink>
        <div class="name">{{ name }}</div>
        <img v-if="!saved" @click="saveWeather" src="../assets/img/add.svg" alt="Add" />
        <img v-if="saved" @click="removeWeather" src="../assets/img/delete.svg" alt="Delete" />
      </div>

      <div class="main-date">
        {{
          new Date(weatherData.currentTime).toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        }}
      </div>
      <div class="icon">
        <img
          :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`"
          alt=""
        />
      </div>
      <div class="temperature">
        <div class="current-temperature">{{ Math.round(weatherData.current.temp) }} °C</div>
      </div>
      <div class="current-weather">{{ weatherData.current.weather[0].description }}</div>
      <div class="last-update">
        <div @click="refresh">
          Last Update
          {{
            new Date(weatherData.currentTime).toLocaleTimeString('en-us', {
              timeStyle: 'short',
            })
          }}
        </div>
        <span><img src="../assets/img/refresh.png" alt="refresh" /></span>
      </div>
    </div>
  </section>
  <section class="forecast">
    <div class="forecast-title">Hourly Forecast</div>
    <div class="hourly-forecast">
      <div class="hourly-item" v-for="hour in hourlyWeather" :key="hour.dt">
        <img :src="`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`" alt="" />
        <div class="hour-temp">{{ Math.round(hour.temp) }}°</div>
        <div class="hour-time">
          {{
            new Date(hour.currentTime).toLocaleTimeString('en-us', {
              timeStyle: 'short',
            })
          }}
        </div>
      </div>
    </div>
  </section>

  <section class="forecast">
    <div class="forecast-title">Weekly Forecast</div>
    <div class="weekly-forecast">
      <div class="weekly-item" v-for="(day, index) in weatherData?.daily" :key="day.dt">
        <div class="weekly-details">
          <div class="weekly-icon">
            <img :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`" alt="" />
          </div>
          <div class="weekly-weather">
            <div class="day">
              {{
                new Date(day.dt * 1000).toLocaleDateString('en-us', {
                  weekday: 'long',
                })
              }}
            </div>
            <div class="weather-weekly">{{ day.weather[0].main }}</div>
          </div>
        </div>
        <div class="weekly-temp">
          <div class="hour-temp">{{ Math.round(day.temp.day) }}°C</div>
          <span><img src="../assets/img/caret_right.png" alt="caret_right" /></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Current, Openweather } from '@/types'
import { useWeather } from '@/store'
const route = useRoute()
const store = useWeather()

const lat = route.query.lat
const long = route.query.long
const name = route.query.name

const weatherData = ref<Openweather>()

async function getWeatherData() {
  const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&appid=${import.meta.env.VITE_WEATHEROPENAPI__KEY}`
  try {
    const resp = await axios.get(url)
    const localOffset = new Date().getTimezoneOffset() * 60000
    const utc = resp.data.current.dt * 1000 + localOffset
    resp.data.currentTime = utc + 1000 * resp.data.timezone_offset

    resp.data.hourly.forEach((hour: Current) => {
      const utc = hour.dt * 1000 + localOffset
      hour.currentTime = utc + 1000 * resp.data.timezone_offset
    })

    resp.data.daily.shift()
    weatherData.value = resp.data
  } catch (err) {
    console.log(err)
  }
}

const hourlyWeather = computed(() => {
  const now = new Date()
  const fourHoursWeather: Current[] = []

  if (!weatherData.value?.hourly) return fourHoursWeather

  for (const hourData of weatherData.value.hourly) {
    const hourTime = new Date(hourData.currentTime)

    if (hourTime < now) continue

    if (fourHoursWeather.length < 4) {
      fourHoursWeather.push(hourData)
    } else {
      break
    }
  }

  return fourHoursWeather
})

function saveWeather() {
  const details = {
    longitude: long,
    latitude: lat,
    name: name,
    data: weatherData.value,
  }
  store.addList(details)
  saved.value = true
}

function removeWeather() {
  store.removeList(long, lat)
  saved.value = false
}

const saved = ref(false)

function checkSaved() {
  saved.value = store.list.some((item) => {
    const itemLatitude =
      typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude
    const itemLongitude =
      typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude

    const latitude = typeof lat === 'string' ? parseFloat(lat) : lat
    const longitude = typeof long === 'string' ? parseFloat(long) : long

    return itemLatitude === latitude && itemLongitude === longitude
  })
}

function refresh() {
  window.location.reload()
}

onMounted(() => {
  checkSaved()
  getWeatherData()
})
</script>

<style scoped>
.highlight {
  padding: 2rem;
  background: linear-gradient(118.25deg, #4f80fa 1.2%, #3764d7 59.26%, #335fd1 79.2%);
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
  font-size: 0.875rem;
  font-weight: 500;
}

.main-date {
  text-align: center;
  font-size: 0.875rem;
}

.current-temperature {
  font-size: 1.25rem;
  line-height: 23.87px;
}

.current-weather {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 23.87px;
  text-transform: capitalize;
}

.last-update {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}

.last-update span {
  width: 1rem;
  height: 1rem;
  margin-top: -0.1rem;
}

.forecast {
  padding: 2rem;
}

.forecast-title {
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 23.87px;
}

.hourly-forecast {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.hourly-item {
  border-radius: 4px;
  width: 4.875rem;
  height: 6.6875rem;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.hourly-item img {
  width: 2.5rem;
  height: 2.5rem;
}

.hourly-item .hour-temp {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 16.71px;
}

.hourly-item .hour-time {
  color: #494343;
  font-size: 0.75rem;
  line-height: 14.32px;
}

.weekly-forecast {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.weekly-icon {
  background-color: #9ab6ff;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 25px;
}

.weekly-icon img {
  width: 100%;
}

.weekly-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #d2dfff;
  border-radius: 12px;
  height: 4.5rem;
  padding: 1rem;
}

.weekly-details {
  display: flex;
  width: 50%;
  gap: 0.5rem;
  align-items: center;
}

.weekly-details .day {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 16.71px;
}

.weekly-details .weather-weekly {
  color: #494343;
  font-size: 0.8125rem;
}

.weekly-temp {
  display: flex;
  align-items: center;
}

.weekly-temp span {
  width: 24px;
  height: 24px;
}

.weekly-temp .hour-temp {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 16.71px;
}

.weekly-weather {
  display: flex;
  flex-direction: column;
}
</style>
