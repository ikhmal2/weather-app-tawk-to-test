<template>
  <div class="dashboard">
    <div class="flex header">
      <h1>Weather</h1>
      <RouterLink to="/profile"><img src="../assets/img/profile.svg" alt="Profile" /></RouterLink>
    </div>
    <SearchBar />
    <WeatherCard />
  </div>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
import WeatherCard from '@/components/WeatherCard.vue'
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
