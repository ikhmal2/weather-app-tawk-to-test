<template>
	<div v-if="Object.keys(weatherData).length !== 0" class="weather-card">
		<div class="location">
			<div class="location-details">
				<p class="location-name">My Location</p>
				<p class="location-subname">{{ weatherData.city.name }}</p>
			</div>
			<div class="location-weather">{{ todayWeather.weather }}</div>
		</div>
		<div class="temperature">
			<div class="current-temperature">{{ todayWeather.temp }} °</div>
			<div class="hi-low">H: {{ todayWeather.hi }}° L:{{ todayWeather.low }}°</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

interface coords {
	accuracy?: number | null
	altitude?: number | null
	altitudeAccuracy?: number | null
	heading?: number | null
	latitude: number | null
	longitude: number | null
	speed?: number | null
}

const currentLocation = ref<coords>({
	latitude: null,
	longitude: null,
})

const errMsg = ref('')
const weatherData = ref({})

const date = new Date()
date.setHours(0, 0, 0, 0)
// const unixDate = new Date(convertUnixToGMT8(1734890400))

// async function getWeatherData(lat: number | null, long: number | null) {
async function getWeatherData(position) {
	const lat = position.coords.latitude
	const long = position.coords.longitude
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=3e4ab56c9ba5a0c2807affcd2226e2a3`
	try {
		if (lat !== null || long !== null) {
			const resp = await fetch(url)
			if (!resp.ok) {
				throw new Error(`Response status: ${resp.status}`)
			}
			const response = await resp.json()
			weatherData.value = await response
		} else {
			throw new Error("Can't retrieve Long Lang")
		}
	} catch (error) {
		console.log(error)
	}
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getWeatherData)
	} else {
		if (currentLocation.value) errMsg.value = 'Geolocation is not supported by this browser.'
	}
}

const todayWeather = computed(() => {
	const weatherDetails = {
		temp: 0,
		hi: 0,
		low: 0,
		weather: '',
	}

	if (!weatherData.value?.list?.length) return weatherDetails

	const today = new Date().toISOString().slice(0, 10)

	const todayData = weatherData.value.list.find((item) => {
		const itemDate = item.dt_txt
		return itemDate.includes(today)
	})

	if (todayData) {
		weatherDetails.temp = Math.round(todayData.main.temp)
		weatherDetails.hi = Math.round(todayData.main.temp_max)
		weatherDetails.low = Math.round(todayData.main.temp_min)
		weatherDetails.weather = todayData.weather[0]?.description || ''
	}

	return weatherDetails
})

onMounted(() => {
	getLocation()
})
</script>

<style scoped>
.weather-card {
	width: 100%;
	display: flex;
	justify-content: space-between;
	border: 1px dotted red;
	background-color: black;
	color: white;
	padding: 0.5rem;
	border-radius: 16px;
}

.location {
	display: flex;
	flex-direction: column;
	/* gap: 0.625rem; */
	justify-content: space-between;
}

.location-name {
	font-weight: bold;
	font-size: 1.5625rem;
	line-height: 1.8644rem;
}

.location-subname {
	line-height: 1.25rem;
	font-weight: 500;
}

.location-weather {
	line-height: 1.25rem;
	font-weight: 500;
}

.temperature {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.temperature>.current-temperature {
	font-size: 3.3125rem;
	line-height: 63.25px;
}

.temperature>.hi-low {
	font-size: 0.9375rem;
	line-height: 20px;
}
</style>
