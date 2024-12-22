import { defineStore } from 'pinia'

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
