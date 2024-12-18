<template>
  <div>
    <div class="flex header">
      <h1>Weather</h1>
      <RouterLink to="/profile"><img src="../assets/img/profile.svg" alt="Profile" /></RouterLink>
    </div>
    <SearchBar />
  </div>
</template>

<script setup lang="ts">
import SearchBar from '@/components/SearchBar.vue'
</script>

<style scoped>
.header {
  justify-content: space-between;
  align-items: center;
}
</style>
