<template>
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
</template>

<script setup lang="ts">
import { Current, Openweather } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  weatherData: Openweather;
}>();

const hourlyWeather = computed(() => {
  const now = new Date();
  const fourHoursWeather: Current[] = [];

  if (!props.weatherData?.hourly) return fourHoursWeather;

  for (const hourData of props.weatherData.hourly) {
    const hourTime = new Date(hourData.currentTime);

    if (hourTime < now) continue;

    if (fourHoursWeather.length < 4) {
      fourHoursWeather.push(hourData);
    } else {
      break;
    }
  }

  return fourHoursWeather;
});
</script>

<style scoped>
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

@media (min-width: 768px) {
  .hourly-item {
    width: 100%;
    height: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
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
</style>
