<template>
  <section class="card">
    <h1 class="title">Create Account</h1>
    <p class="subtitle">Enter your details to register.</p>
    <form class="stack" @submit.prevent="submit">
      <div class="field">
        <label class="label" for="reg-username">Username</label>
        <input id="reg-username" class="input" v-model.trim="reg.username" autocomplete="username" required />
      </div>
      <div class="field">
        <label class="label" for="reg-email">Email</label>
        <input id="reg-email" class="input" type="email" v-model.trim="reg.email" autocomplete="email" required />
      </div>
      <div class="field">
        <label class="label" for="reg-password">Password</label>
        <input id="reg-password" class="input" type="password" v-model="reg.password" autocomplete="new-password" required />
      </div>
      <div class="field">
        <label class="label" for="reg-confirm">Confirm Password</label>
        <input id="reg-confirm" class="input" type="password" v-model="reg.confirm" autocomplete="new-password" required />
      </div>
      <button class="btn" type="submit" :disabled="loading">
        <span v-if="!loading">Register</span>
        <span v-else>Registering…</span>
      </button>
      <div class="row" style="margin-top:8px">
        <button type="button" class="btn secondary" style="width:auto; padding:8px 12px;" @click="$emit('backToLogin')">Back to login</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </section>
</template>

<script setup>
import { reactive } from 'vue';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['register', 'backToLogin']);

const reg = reactive({ username: '', email: '', password: '', confirm: '' });

function submit() {
  emit('register', { ...reg });
}
</script>

<style scoped>
</style>

