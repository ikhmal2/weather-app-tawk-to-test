<template>
	<div class="highlight">
		<RouterLink to="/">
			<img src="../assets/img/left-white.svg" alt="Left" />
		</RouterLink>
		<div class="name">{{ name }}</div>
		<img src="../assets/img/add.svg" alt="Add">
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

const lat = route.query.lat
const long = route.query.long
const name = route.query.name
console.log(name);

async function getWeatherData() {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&units=metric&appid=3e4ab56c9ba5a0c2807affcd2226e2a3`
	try {
		if (lat !== null || long !== null) {
			const resp = await fetch(url)
			if (!resp.ok) {
				throw new Error(`Response status: ${resp.status}`)
			}
			const response = await resp.json()
			console.log(response);
		} else {
			throw new Error("Can't retrieve Long Lang")
		}
	} catch (error) {
		console.log(error)
	}
}

onMounted(() => {
	// getWeatherData()
})
</script>

<style scoped>
.highlight {
	background: linear-gradient(118.25deg, #4F80FA 1.2%, #3764D7 59.26%, #335FD1 79.2%);
	color: white;
	display: flex;
	justify-content: space-between;
}

.name {
	font-size: .875rem;
}
</style>
