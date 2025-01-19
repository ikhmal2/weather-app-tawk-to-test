import { defineStore } from 'pinia'
import { Openweather } from '@/types'

export const useProfileDetails = defineStore('profile-details', {
  state: () => ({
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    telNo: '+01 234 567 89',
  }),
  actions: {
    updateName(payload: string) {
      this.name = payload
    },
    updateEmail(payload: string) {
      this.email = payload
    },
    updateTelNo(payload: string) {
      this.telNo = payload
    },
  },
})

interface storedLocations {
  longitude: number
  latitude: number
  name: string
  data: Openweather
}

export const useWeather = defineStore('weather-details', {
  state: () => ({
    list: <storedLocations[]>[],
  }),
  persist: true,
  actions: {
    addList(payload: storedLocations) {
      this.list.push(payload)
    },
    removeList(longitude: number, latitude: number) {
      this.list = this.list.filter(
        (location) => location.longitude !== longitude || location.latitude !== latitude,
      )
    },
  },
})
