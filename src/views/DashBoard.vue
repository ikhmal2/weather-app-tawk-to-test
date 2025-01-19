<template>
  <div class="dashboard">
    <div v-show="!hideElementsStatus" class="flex header">
      <h1>Weather</h1>
      <RouterLink to="/profile"><img src="../assets/img/profile.svg" alt="Profile" /></RouterLink>
    </div>
    <SearchBar @hide-elements="hideElements" />
    <WeatherCard v-show="!hideElementsStatus" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
import { useWeather } from '@/store'

const hideElementsStatus = ref(false)

function hideElements(status: boolean) {
  hideElementsStatus.value = status
}

const store = useWeather()
const savedWeather = store.list
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
