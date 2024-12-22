<template>
  <div class="container">
    <div class="header-container">
      <div class="flex header">
        <span>
          <RouterLink to="/">
            <img src="../assets/img/chevron_left.svg" alt="Left" />
          </RouterLink>
        </span>
        <span>Edit Profile</span>
        <span> </span>
      </div>
      <div class="profile-details">
        <div class="profile-container">
          <img class="profile-picture" src="../assets/img/default_profile.png" alt="profile" />
          <img v-show="isEdit" class="edit-icon" src="../assets/img/edit-icon.png" alt="edit" />
        </div>
        <div class="profile-details-inner">
          <p class="name">{{ store.name }}</p>
          <div class="contacts">
            <p>{{ store.email }} | {{ store.telNo }}</p>
          </div>
        </div>
      </div>
    </div>
    <form class="flex" action="#">
      <div class="form-item-container">
        <label for="name">Full Name</label>
        <input :disabled="!isEdit" type="text" id="name" v-model="profile.name" />
      </div>
      <div class="form-item-container">
        <label for="email">Email</label>
        <input :disabled="!isEdit" type="text" id="email" v-model="profile.email" />
      </div>
      <div class="form-item-container">
        <label for="phone">Phone Number</label>
        <IntlTelInput
          id="iti"
          :options="{
            initialCountry: 'us',
          }"
          :inputProps="{
            placeholder: '+01 234 567 89',
            class: 'full',
          }"
          v-model="profile.telNum"
          :disabled="!isEdit"
        />
      </div>
    </form>
    <div class="error" v-if="displayError.length > 0">Error: {{ displayError }}</div>
    <div class="btn-container">
      <div class="inner">
        <BaseButton v-if="!isEdit" class="btn" @click="isEdit = !isEdit">edit</BaseButton>
        <BaseButton
          v-if="isEdit"
          class="btn"
          :disabled="displayError.length > 0"
          @click.prevent="editProfile"
        >
          submit</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue'
import BaseButton from '@/singleton/BaseButton.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import IntlTelInput from 'intl-tel-input/vueWithUtils'
import 'intl-tel-input/styles'
import { useProfileDetails } from '@/store'

const store = useProfileDetails()
const profile = ref({
  name: ' ',
  email: ' ',
  telNum: ' ',
})

interface errLabel {
  name: {
    valid: null | boolean
    nameErrMsg: string
  }
  email: {
    valid: null | boolean
    nameErrMsg: string
  }
  telNum: {
    valid: null | boolean
    nameErrMsg: string
  }
}

const err = ref<errLabel>({
  name: {
    valid: true,
    nameErrMsg: '',
  },
  email: {
    valid: true,
    nameErrMsg: '',
  },
  telNum: {
    valid: true,
    nameErrMsg: '',
  },
})

const displayError = computed(() => {
  const errList: string[] = []
  if (!err.value.name.valid) {
    errList.push(err.value.name.nameErrMsg)
  }
  if (!err.value.email.valid) {
    errList.push(err.value.email.nameErrMsg)
  }
  if (!err.value.telNum.valid) {
    errList.push(err.value.telNum.nameErrMsg)
  }
  return errList.join(', ')
})

const isEdit = ref(false)

onMounted(() => {
  const telNumberInputContainer = <HTMLElement>document.querySelector('.iti')
  if (telNumberInputContainer != null) {
    telNumberInputContainer.style.width = '100%'
  }
  profile.value.name = store.name
  profile.value.email = store.email
  profile.value.telNum = store.telNo
})

function editProfile() {
  store.updateName(profile.value.name)
  store.updateEmail(profile.value.email)
  store.updateTelNo(profile.value.telNum)
  isEdit.value = false
}

watch(
  profile,
  async (newProfile) => {
    let pattern = null
    if (newProfile.name !== '') {
      pattern = /^[a-zA-Z][a-zA-Z0-9_ ]{4,18}[a-zA-Z0-9_]$/
      if (pattern.test(newProfile.name)) {
        err.value.name.valid = true
      } else {
        err.value.name.nameErrMsg = 'Invalid Name'
        err.value.name.valid = false
      }
    } else {
      err.value.name.valid = false
      err.value.name.nameErrMsg = 'Name cannot be empty'
    }

    if (newProfile.email !== '') {
      pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (pattern.test(newProfile.email)) {
        err.value.email.valid = true
      } else {
        err.value.email.nameErrMsg = 'Invalid Email'
        err.value.email.valid = false
      }
    } else {
      err.value.email.valid = false
      err.value.email.nameErrMsg = 'Email cannot be empty'
    }
  },
  { deep: true },
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-container {
  padding: 32px;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 18.75rem;
  z-index: 1;
}

.header-container::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 18.625rem;
  background: url('../assets/img/wave.png');
  background-position-y: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;
}

@media only screen and (max-width: 600px) {
  .header-container::before {
    background-position-y: -9rem;
  }
}

.profile-container {
  position: relative;
}

.profile-container .edit-icon {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.header {
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.header span:nth-child(2) {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 20px;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  text-align: center;
}

.profile-details-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-details img {
  max-width: 120px;
  max-height: 120px;
}

.contacts {
  display: block;
}

form {
  flex-direction: column;
  gap: 1rem;
  padding: 32px;
  width: 100%;
}

.form-item-container {
  position: relative;
}

.form-item-container label {
  position: absolute;
  top: 0;
  left: 0;
}

label {
  font-size: 0.5rem;
  padding: 0.5rem;
  color: #757575;
}

input {
  background-color: #ffffff;
  border: 1px solid #ededed;
  box-shadow: 0 2px 25px 1px #00000005;
  padding-left: 12px;
  padding-right: 12px;
  height: 50px;
  border-radius: 0.5rem;
  width: 100%;
  color: #212121;
  font-weight: normal;
  font-size: 0.875rem;
}

input[disabled] {
  background-color: #f5f5f5;
  border: 0;
}

input::placeholder {
  color: #212121;
  font-size: 14px;
  font-weight: 500;
}

.error {
  color: #d8000c;
  background-color: #ffbaba;
  border: 1px solid;
  margin: 10px 0px;
  padding: 5px 10px 5px 10px;
  border-radius: 8px;
  background-repeat: no-repeat;
  background-position: 10px center;
}

.btn-container {
  position: fixed;
  bottom: 0;
  border-top: 0;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  z-index: 10;
  flex-wrap: wrap;
  left: 0;
  right: 0;
}

.btn-container .inner {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
}

.btn {
  margin-bottom: 0.5rem;
  margin-left: 0px;
  margin-right: 0px;
}

/* button {
	width: 100%;
	background-color: #2E3A5A;
	color: white;
	font-weight: bold;
	border-radius: 8px;
	padding-top: 12.5px;
	padding-bottom: 12.5px;
	padding-left: 16px;
	padding-right: 16px;
} */
</style>
