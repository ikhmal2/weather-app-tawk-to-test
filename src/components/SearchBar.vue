<template>
	<div id="search" :class="fullScreen ? 'full-screen' : ''" class="flex relative">
		<div class="relative search-container flex">
			<input v-model="searchQuery" @input="getSearchResult" type="text"
				placeholder="Search for a city or airport" />
			<img src="../assets/img/search.svg" alt="Search Icon" />
			<img @click="clearResult" v-show="searchQuery !== ''" src="../assets/img/close.svg" alt="close" />
		</div>
		<ul v-show="searchQuery !== ''" class="search-result">
			<li v-for="result in mapboxSearchResult" :key="result.id"
				@click="saveWeather(result.properties.coordinates, `${result.properties.name_preferred}, ${result.properties.place_formatted}`)">
				<span>{{ result.properties.name_preferred }}</span>, <span>{{ result.properties.place_formatted
					}}</span>
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useWeather } from '@/store'
import router from '@/router'
const store = useWeather()

const emit = defineEmits(['hideElements'])

const fullScreen = ref(false)
const searchQuery = ref('')
const queryTimeout = ref(0)
const mapboxSearchResult = ref({})
const getSearchResult = () => {
	clearTimeout(queryTimeout.value)
	queryTimeout.value = setTimeout(async () => {
		if (searchQuery.value !== '') {
			const result = await axios.get(
				`https://api.mapbox.com/search/geocode/v6/forward?q=${searchQuery.value}&access_token=${import.meta.env.VITE_MAPBOX_API_KEY}&types=place`,
			)
			mapboxSearchResult.value = result.data.features
			return
		}
		mapboxSearchResult.value = {}
	}, 300)
}

function clearResult() {
	mapboxSearchResult.value = {}
	searchQuery.value = ''
}

interface coords {
	longitude: number
	latitude: number
}

function saveWeather(coord: coords, name: string) {
	store.addList(coord)
	router.push({
		name: 'weather', query: {
			long: coord.longitude, lat: coord.latitude, name: name
		}
	})
}

watch(searchQuery, (newVal, oldVal) => {
	if (newVal !== '') {
		emit('hideElements', true)
		fullScreen.value = true
	} else if (newVal === '') {
		emit('hideElements', false)
		fullScreen.value = false
	}
})
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

li>span:first-child {
	font-weight: bold;
}

li>span:nth-child(2) {
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
	/* transform: translate(0%, 40%); */
	width: 1.25rem;
	height: 1.25rem;
	object-fit: cover;
}

img:nth-of-type(2) {
	position: absolute;
	right: 1rem;
	/* transform: translate(0%, 40%); */
	width: 1.125rem;
	height: 1.125rem;
	object-fit: cover;
}
</style>
