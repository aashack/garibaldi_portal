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

    <component 
      :is="loggedIn ? currentView : null"
      v-bind="viewProps"
      v-on="viewEvents"
    />
  </HeaderBar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import LoginForm from './components/auth/LoginForm.vue'
import RegisterForm from './components/auth/RegisterForm.vue'
import HomeView from './components/HomeView.vue'
import ProfileForm from './components/profile/ProfileForm.vue'
import { useAuth } from './composables/useAuth'
import { useProfile } from './composables/useProfile'
import { useView } from './composables/useView'

const { token, claims, loggedIn, humanExp, login, register, logout, initFromStorage } = useAuth()
const { profile, hasProfile, loadProfile, saveProfile } = useProfile()
const { view, error, saveStatus, goToProfile, backHome } = useView()

const showRegister = ref(false)
const loading = ref(false)

const currentView = computed(() => 
  view.value === 'home' ? HomeView : ProfileForm
)

const viewProps = computed(() => ({
  claims: claims.value,
  token: token.value,
  humanExp: humanExp.value,
  profile: profile.value,
  loading: loading.value,
  error: error.value,
  saveStatus: saveStatus.value
}))

const viewEvents = computed(() => ({
  goToProfile,
  logout: handleLogout,
  save: handleSaveProfile,
  back: backHome
}))

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

