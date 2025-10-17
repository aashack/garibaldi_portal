<template>
  <HeaderBar>
    <LoginForm
      v-if="!loggedIn && !showRegister"
      :loading="loading"
      :error="error"
      @login="handleLogin"
      @switchToRegister="showRegister = true"
    />

    <RegisterForm
      v-else-if="!loggedIn && showRegister"
      :loading="loading"
      :error="error"
      @register="handleRegister"
      @backToLogin="showRegister = false"
    />

    <HomeView
      v-else-if="loggedIn && view === 'home'"
      :claims="claims"
      :token="token"
      :humanExp="humanExp"
      :profile="profile"
      @goToProfile="goToProfile"
      @logout="handleLogout"
    />

    <ProfileForm
      v-else-if="loggedIn && view === 'profile'"
      :claims="claims"
      :profile="profile"
      :loading="loading"
      :error="error"
      :saveStatus="saveStatus"
      @save="handleSaveProfile"
      @back="backHome"
    />
  </HeaderBar>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import HeaderBar from './components/HeaderBar.vue';
import LoginForm from './components/auth/LoginForm.vue';
import RegisterForm from './components/auth/RegisterForm.vue';
import HomeView from './components/HomeView.vue';
import ProfileForm from './components/profile/ProfileForm.vue';
import { useAuth } from './composables/useAuth';
import { useProfile } from './composables/useProfile';

const { token, claims, loggedIn, humanExp, login, register, logout, initFromStorage } = useAuth();
const { profile, hasProfile, loadProfile, saveProfile } = useProfile();

const showRegister = ref(false);
const loading = ref(false);
const error = ref('');
const saveStatus = ref('');
const view = ref('home'); // 'home' | 'profile'

function goToProfile() {
  error.value = '';
  saveStatus.value = '';
  view.value = 'profile';
  // ensure latest profile is loaded when entering
  if (token.value) loadProfile(token.value).catch((e) => (error.value = e?.message || 'Failed to load profile'));
}

function backHome() {
  error.value = '';
  saveStatus.value = '';
  view.value = 'home';
}

async function handleLogin({ username, password }) {
  error.value = '';
  loading.value = true;
  try {
    await login(username, password);
    if (token.value) await loadProfile(token.value);
  } catch (e) {
    error.value = e?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
}

async function handleRegister(payload) {
  error.value = '';
  loading.value = true;
  try {
    await register(payload);
    if (token.value) await loadProfile(token.value);
    showRegister.value = false;
  } catch (e) {
    error.value = e?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
}

async function handleSaveProfile(formData) {
  error.value = '';
  saveStatus.value = '';
  loading.value = true;
  try {
    await saveProfile(token.value, formData);
    hasProfile.value = true;
    saveStatus.value = 'Profile saved';
  } catch (e) {
    error.value = e?.message || 'Failed to save profile';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  logout();
  showRegister.value = false;
  view.value = 'home';
  saveStatus.value = '';
  error.value = '';
}

onMounted(async () => {
  initFromStorage();
  if (loggedIn.value && token.value) {
    try {
      await loadProfile(token.value);
    } catch (e) {
      error.value = e?.message || 'Failed to load profile';
    }
  }
});
</script>

<style scoped>
</style>

