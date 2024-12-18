<template>
  <div id="search" class="flex relative">
    <input type="text" class="pl-10" placeholder="Search for a city or airport" />
    <img src="../assets/img/search.svg" alt="Search Icon" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
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

img {
  position: absolute;
  left: 1rem;
  transform: translate(0%, 50%);
  width: 1.25rem;
  height: 1.25rem;
  object-fit: cover;
}
</style>
