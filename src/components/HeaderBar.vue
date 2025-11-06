<template>
  <header class="topbar">
    <img :src="logoUrl" alt="Garibaldi logo" class="topbar__logo" />
    <div class="brand">Garibaldi Systems</div>
    <div class="actions">
      <template v-if="loggedIn">
        <router-link v-if="onProfile" class="btn btn--small" to="/about">About</router-link>
        <router-link v-else class="btn btn--small" to="/profile">Profile</router-link>
        <button class="btn btn--small secondary" @click="handleLogout">Log out</button>
      </template>
      <template v-else>
        <router-link class="btn btn--small" to="/">Home</router-link>
        <router-link class="btn btn--small secondary" to="/login">Login</router-link>
      </template>
    </div>
  </header>
  
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import logoUrl from '../assets/logo.svg'

const route = useRoute()
const router = useRouter()
const { loggedIn, logout } = useAuth()

const onProfile = computed(() => route.name === 'profile')

function handleLogout() {
  logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped>
.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #0b5d3b; /* dark green */
  color: #ffffff;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}
.brand {
  font-weight: 700;
  letter-spacing: 0.2px;
}
.actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}
.topbar__logo {
  height: 40px;
  width: 40px;
  margin-right: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: rgba(255,255,255,0.2);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
}
.btn--small { width: auto; }
.btn.secondary { background: rgba(255,255,255,0.12); }
</style>
