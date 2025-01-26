<template>
  <section class="forecast">
    <div class="forecast-title">Weekly Forecast</div>
    <div class="weekly-forecast">
      <div class="weekly-item" v-for="day in weatherData?.daily" :key="day.dt">
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
import { Openweather } from '@/types';

defineProps<{
  weatherData: Openweather;
}>();
</script>

<style scoped>
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
