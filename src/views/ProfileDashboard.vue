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
					<img v-show="isEdit" class="edit-icon" src="../assets/img/edit-icon.png" alt="edit">
				</div>
				<div class="profile-details-inner">
					<p class="name">John Doe</p>
					<div class="contacts">
						<p>jane@gmail.com | +01 234 567 89</p>
					</div>
				</div>
			</div>
		</div>
		<form class="flex" action="#">
			<div class="form-item-container">
				<label for="name">Full Name</label>
				<input :disabled="!isEdit" type="text" id="name" value="John Doe" />
			</div>
			<div class="form-item-container">
				<label for="email">Email</label>
				<input :disabled="!isEdit" type="text" id="email" value="jane@gmail.com" />
			</div>
			<div class="form-item-container">
				<label for="phone">Phone Number</label>
				<IntlTelInput id="iti" :options="{
					initialCountry: 'us',
				}" :inputProps="{
					placeholder: '+01 234 567 89',
					class: 'full',
				}" :disabled="!isEdit" />
			</div>
		</form>
		<div class="btn-container">
			<div class="inner">
				<BaseButton class="btn" @click="isEdit = !isEdit">{{ isEdit ? 'submit' : 'edit' }}</BaseButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseButton from '@/singleton/BaseButton.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import IntlTelInput from 'intl-tel-input/vueWithUtils'
import 'intl-tel-input/styles'

onMounted(() => {
	const telNumberInputContainer = <HTMLElement>document.querySelector('.iti')
	if (telNumberInputContainer != null) {
		telNumberInputContainer.style.width = '100%'
	}
})

const isEdit = ref(false)

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

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
	background: url("../assets/img/wave.png");
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
	background-color: #FFFFFF;
	border: 1px solid #EDEDED;
	box-shadow: 0 2px 25px 1px #00000005;
	padding-left: 12px;
	padding-right: 12px;
	height: 50px;
	border-radius: 0.5rem;
	width: 100%;
	color: #212121;
	font-weight: normal;
	font-size: .875rem;
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
