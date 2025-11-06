<template>
  <div class="page-container">
    <section class="stack">
      <HomeView
        v-if="showHome"
        :claims="claims"
        :token="token"
        :humanExp="humanExp"
        :profile="profile"
        :showLogout="false"
        @goToProfile="goToProfile"
        @logout="handleLogout"
      />

      <ProfileForm
        v-else
        :claims="claims"
        :profile="profile"
        :loading="loading"
        :error="error"
        :saveStatus="saveStatus"
        @save="handleSaveProfile"
        @back="backHome"
      />
    </section>
  </div>
 </template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HomeView from '../components/HomeView.vue'
import ProfileForm from '../components/profile/ProfileForm.vue'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'
import { useView } from '../composables/useView'

const router = useRouter()
const { token, claims, humanExp, loggedIn, logout } = useAuth()
const { profile, hasProfile, loadProfile, saveProfile } = useProfile()
const { view, error, saveStatus, goToProfile, backHome } = useView()

const loading = ref(false)
const showHome = computed(() => view.value === 'home')

function handleLogout() {
  logout()
  error.value = ''
  saveStatus.value = ''
  router.replace({ name: 'login' })
}

async function handleSaveProfile(formData) {
  error.value = ''
  saveStatus.value = ''
  loading.value = true
  try {
    await saveProfile(token.value, formData)
    hasProfile.value = true
    saveStatus.value = 'Profile saved'
  } catch (e) {
    error.value = e?.message || 'Failed to save profile'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (!loggedIn.value) {
    router.replace({ name: 'login' })
    return
  }
  if (token.value) {
    try {
      await loadProfile(token.value)
    } catch (e) {
      error.value = e?.message || 'Failed to load profile'
    }
  }
})
</script>

<style scoped>

/* Make content fill ~90% width across child components */
:deep(.landing), :deep(.card) { max-width: none; }
</style>
