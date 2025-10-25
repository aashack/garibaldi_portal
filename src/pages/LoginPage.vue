<template>
  <div class="top-actions">
    <router-link class="btn secondary" to="/">Back</router-link>
  </div>
  <section class="stack">
    <LoginForm
      v-if="!showRegister"
      :loading="loading"
      :error="error"
      @login="handleLogin"
      @switchToRegister="showRegister = true"
    />

    <RegisterForm
      v-else
      :loading="loading"
      :error="error"
      @register="handleRegister"
      @backToLogin="showRegister = false"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import { useAuth } from '../composables/useAuth'
import { useProfile } from '../composables/useProfile'

const router = useRouter()
const { token, login, register } = useAuth()
const { loadProfile } = useProfile()

const showRegister = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin({ username, password }) {
  error.value = ''
  loading.value = true
  try {
    await login(username, password)
    if (token.value) await loadProfile(token.value)
    router.replace({ name: 'profile' })
  } catch (e) {
    error.value = e?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

async function handleRegister(payload) {
  error.value = ''
  loading.value = true
  try {
    await register(payload)
    if (token.value) await loadProfile(token.value)
    showRegister.value = false
    router.replace({ name: 'profile' })
  } catch (e) {
    error.value = e?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
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
