import { defineStore } from 'pinia';

export const useProfileDetails = defineStore('profile-details', {
  state: () => ({
    name: 'Jane Doe',
    email: 'jane@gmail.com',
    telNo: '',
  }),
  persist: true,
  actions: {
    updateName(payload: string) {
      this.name = payload;
    },
    updateEmail(payload: string) {
      this.email = payload;
    },
    updateTelNo(payload: string) {
      this.telNo = payload;
    },
  },
});

export interface storedLocations {
  longitude: number;
  latitude: number;
  name: string;
  current?: boolean;
}

export const useWeather = defineStore('weather-details', {
  state: () => ({
    list: <storedLocations[]>[],
    showCurrent: true,
  }),
  persist: {
    pick: ['list'],
  },
  actions: {
    addList(payload: storedLocations) {
      const isDuplicate = this.list.some(
        (location) =>
          location.longitude == payload.longitude && location.latitude == payload.latitude,
      );

      if (!isDuplicate) {
        if (payload.current) {
          this.list.forEach((location) => {
            if (location.current) {
              location.current = false;
            }
          });
          this.list.unshift(payload);
        } else {
          this.list.push(payload);
        }
      }
    },
    removeList(longitude: number, latitude: number) {
      this.list = this.list.filter(
        (location) => location.longitude !== longitude || location.latitude !== latitude,
      );
    },
    removeCurrentLocationCard() {
      this.showCurrent = false;
    },
    resetCurrentLocation() {
      if (this.list[0]?.current) {
        this.list.shift();
      }
    },
  },
});

export const useLoadingState = defineStore('loading-state', {
  state: () => ({
    isLoading: false,
  }),
  actions: {
    updateLoadingState(status: boolean) {
      this.isLoading = status;
    },
  },
});
