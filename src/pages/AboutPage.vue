<template>
  <div v-if="loggedIn" class="top-actions">
    <router-link class="btn" to="/profile">Profile</router-link>
    <button class="btn secondary" @click="handleLogout">Log out</button>
  </div>
    <div class="top-actions">
    <router-link class="btn" to="/">Home</router-link>
    <router-link class="btn secondary" to="/login">Login</router-link>
  </div>
  <section class="card">
    <h1 class="title">About</h1>
    <p class="subtitle">This is the about page.</p>
  </section>
  
</template>



<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { loggedIn, logout } = useAuth()

function handleLogout() {
  logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped>
.top-actions {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}
.top-actions :deep(.btn), .top-actions .btn {
  width: auto;
  padding: 8px 12px;
}
</style>
