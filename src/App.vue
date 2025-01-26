<template>
  <main>
    <LoaderScreen v-if="store.isLoading" />
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import LoaderScreen from './components/LoaderScreen.vue';
import { useLoadingState } from './store';

const store = useLoadingState();
</script>

<style scoped></style>
