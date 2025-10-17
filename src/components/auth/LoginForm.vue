<template>
  <section class="card">
    <h1 class="title">Welcome</h1>
    <p class="subtitle">Please log in to continue.</p>
    <form class="stack" @submit.prevent="submit">
      <div class="field">
        <label class="label" for="username">Username</label>
        <input id="username" class="input" v-model.trim="username" autocomplete="username" required />
      </div>
      <div class="field">
        <label class="label" for="password">Password</label>
        <input id="password" class="input" type="password" v-model="password" autocomplete="current-password" required />
      </div>
      <button class="btn" type="submit" :disabled="loading">
        <span v-if="!loading">Log In</span>
        <span v-else>Logging in…</span>
      </button>
      <div class="row" style="margin-top:8px">
        <button type="button" class="btn secondary" style="width:auto; padding:8px 12px;" @click="$emit('switchToRegister')">Register</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['login', 'switchToRegister']);

const username = ref('');
const password = ref('');

function submit() {
  emit('login', { username: username.value, password: password.value });
}
</script>

<style scoped>
</style>

