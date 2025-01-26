<template>
  <section v-if="weatherData" class="main">
    <div class="highlight">
      <div class="nav">
        <RouterLink to="/">
          <img src="../assets/img/left-white.svg" alt="Left" />
        </RouterLink>
        <div class="name">{{ name }}</div>
        <img v-if="!saved && !current" @click="saveWeather" src="../assets/img/add.svg" alt="Add" />
        <span v-else-if="!saved && current" style="width: 0.875rem" alt="Add" />
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Openweather } from '@/types';
import { storedLocations, useWeather } from '@/store';

defineProps<{
  weatherData: Openweather;
}>();

const store = useWeather();
const route = useRoute();

const lat = route.query.lat as unknown as number;
const long = route.query.long as unknown as number;
const name = route.query.name as unknown as string;
const current = route.query.current;

const saved = ref(false);

function checkSaved() {
  saved.value = store.list.some((item) => {
    const itemLatitude =
      typeof item.latitude === 'string' ? parseFloat(item.latitude) : item.latitude;
    const itemLongitude =
      typeof item.longitude === 'string' ? parseFloat(item.longitude) : item.longitude;

    const latitude = typeof lat === 'string' ? parseFloat(lat) : lat;
    const longitude = typeof long === 'string' ? parseFloat(long) : long;

    return itemLatitude === latitude && itemLongitude === longitude;
  });
}

function saveWeather() {
  const details: storedLocations = {
    longitude: long,
    latitude: lat,
    name: name,
  };

  if (current) {
    details.current = true;
  }

  store.addList(details);
  saved.value = true;
}

function removeWeather() {
  store.removeList(long, lat);
  saved.value = false;
  if (current) {
    store.removeCurrentLocationCard();
  }
}

function refresh() {
  window.location.reload();
}

onMounted(() => {
  checkSaved();
});
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
</style>
