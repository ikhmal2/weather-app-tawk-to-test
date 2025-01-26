<template>
  <div class="dashboard">
    <div v-show="!hideElementsStatus" class="flex header">
      <h1>Weather</h1>
      <RouterLink to="/profile"><img src="../assets/img/profile.svg" alt="Profile" /></RouterLink>
    </div>
    <SearchBar @hide-elements="hideElements" />
    <template v-if="!hideElementsStatus">
      <WeatherCard v-for="(saved, index) in store.list" :key="index" :weather="saved" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SearchBar from '@/components/SearchBar.vue';
import WeatherCard from '@/components/WeatherCard.vue';
import { storedLocations, useLoadingState, useWeather } from '@/store';
import axios from 'axios';

const hideElementsStatus = ref(false);
const coords = ref({});

function hideElements(status: boolean) {
  hideElementsStatus.value = status;
}

const store = useWeather();
const loadingStore = useLoadingState();

async function getWeatherData(lat: number, long: number) {
  const name = await getLocationName(lat, long);
  const coord = { lat: lat, long: long };
  coords.value = await coord;
  const currentLocation: storedLocations = {
    longitude: long,
    latitude: lat,
    name: name,
    current: true,
  };
  store.addList(currentLocation);
}

async function getLocationName(lat: number, long: number) {
  const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${long}&latitude=${lat}&limit=1&types=place&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}`;
  let name: string = '';
  try {
    loadingStore.updateLoadingState(true);
    const resp = await axios.get(url);
    loadingStore.updateLoadingState(false);
    name = resp.data.features[0].properties.name;
  } catch (error) {
    console.log(error);
  } finally {
    return name;
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      getWeatherData(pos.coords.latitude, pos.coords.longitude);
    });
  }
}

onMounted(() => {
  getLocation();
  store.resetCurrentLocation();
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-family: serif;
}

.header {
  justify-content: space-between;
  align-items: center;
}
</style>
