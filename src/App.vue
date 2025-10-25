<template>
  <HeaderBar />
  <main class="viewport">
    <router-view />
  </main>
</template>

<script setup>
import HeaderBar from './components/HeaderBar.vue'
import { useAuth } from './composables/useAuth'

// Initialize session from storage on app mount
const { initFromStorage } = useAuth()
initFromStorage()
</script>

<style scoped>
</style>

