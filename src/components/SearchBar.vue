<template>
  <div id="search" :class="fullScreen ? 'full-screen' : ''" class="flex relative">
    <div class="relative search-container flex">
      <input
        v-model="searchQuery"
        @input="getSearchResult"
        type="text"
        placeholder="Search for a city or airport"
      />
      <img src="../assets/img/search.svg" alt="Search Icon" />
      <img
        @click="clearResult"
        v-show="searchQuery !== ''"
        src="../assets/img/close.svg"
        alt="close"
      />
    </div>
    <ul v-show="searchQuery !== ''" class="search-result">
      <LoaderScreen style="top: 100%" v-if="isLoading" />
      <p v-if="searchError">Something went wrong, try again later</p>
      <li
        v-for="(result, index) in mapboxSearchResult"
        :key="result.id"
        @click="
          saveWeather(
            result.properties.coordinates,
            `${result.properties.name}, ${result.properties.context.country.name}`,
          )
        "
      >
        <span>{{ result.properties.name }}</span
        >,
        <span v-if="index !== 0"
          >{{ result.properties.context.region.region_code }}<span>&nbsp;</span></span
        >
        <span>{{ result.properties.context.country.name }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, watch } from 'vue';
import router from '@/router';
import { Feature } from '@/types';
import LoaderScreen from './LoaderScreen.vue';

const emit = defineEmits(['hideElements']);

const isLoading = ref(false);

const fullScreen = ref(false);
const searchQuery = ref('');
const queryTimeout = ref(0);
const mapboxSearchResult = ref<Feature[]>();
const searchError = ref(false);
const getSearchResult = () => {
  clearTimeout(queryTimeout.value);
  queryTimeout.value = setTimeout(async () => {
    if (searchQuery.value !== '') {
      try {
        isLoading.value = true;
        const result = await axios.get(
          `https://api.mapbox.com/search/geocode/v6/forward?q=${searchQuery.value}&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&types=place`,
        );
        isLoading.value = false;
        mapboxSearchResult.value = result.data.features;
      } catch {
        searchError.value = true;
      }
      return;
    }
    mapboxSearchResult.value = [];
  }, 300);
};

function clearResult() {
  mapboxSearchResult.value = [];
  searchQuery.value = '';
}

interface coords {
  longitude: number;
  latitude: number;
}

function saveWeather(coord: coords, name: string) {
  router.push({
    name: 'weather',
    query: {
      long: coord.longitude,
      lat: coord.latitude,
      name: name,
    },
  });
}

watch(searchQuery, (newVal) => {
  if (newVal !== '') {
    emit('hideElements', true);
    fullScreen.value = true;
  } else if (newVal === '') {
    emit('hideElements', false);
    fullScreen.value = false;
  }
});
</script>

<style scoped>
#search {
  flex-direction: column;
  justify-content: space-between;
}

.full-screen {
  padding-top: 4.25rem;
}

.search-container {
  width: 100%;
  align-items: center;
}

.search-result {
  width: 100%;
}

ul {
  padding: 0;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

li {
  list-style-type: none;
  font-size: 0.875rem;
  border-bottom: 0.5px solid #d4d4d4;
  padding-bottom: 0.5rem;
}

li > span:first-child {
  font-weight: bold;
}

li > span:not(:first-child) {
  color: #545454;
}

input {
  width: 100%;
  padding-left: 40px;
  height: 38px;
  border: none;
  background-color: #f7f7f9;
  border-radius: 5px;
  outline: none;
  font-size: 1rem;
}

img:first-of-type {
  position: absolute;
  left: 1rem;
  width: 1.25rem;
  height: 1.25rem;
  object-fit: cover;
}

img:nth-of-type(2) {
  position: absolute;
  right: 1rem;
  width: 1.125rem;
  height: 1.125rem;
  object-fit: cover;
}
</style>
