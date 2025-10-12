<template>
  <div class="header">Garibadli Systems</div>
  <main class="viewport">
    <section v-if="!loggedIn" class="card">
      <h1 class="title">Welcome</h1>
      <p class="subtitle">Please log in to continue.</p>
      <form class="stack" @submit.prevent="onSubmit">
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
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </section>

    <section v-else class="landing">
      <h1 class="title">You're logged in</h1>
      <p class="subtitle">Below is what we can show from your token.</p>
      <div class="stack" style="margin-top: 12px;">
        <div class="row"><strong>User ID</strong><span class="mono">{{ claims.sub }}</span></div>
        <div class="row"><strong>Username</strong><span class="mono">{{ claims.username }}</span></div>
        <div class="row"><strong>Request ID</strong><span class="mono">{{ claims.reqId }}</span></div>
        <div class="row"><strong>Expires</strong><span>{{ humanExp }}</span></div>
        <details>
          <summary>View raw token</summary>
          <div class="mono info" style="margin-top: 8px;">{{ token }}</div>
        </details>
        <div class="row" style="margin-top: 8px;">
          <button class="btn" style="width:auto; padding:8px 12px;" @click="logout">Log out</button>
        </div>
      </div>
    </section>
  </main>
  
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { AUTH_BASE_URL } from './config';

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const state = reactive({ token: '', claims: null });
const loggedIn = computed(() => !!state.token && !!state.claims);
const token = computed(() => state.token);
const claims = computed(() => state.claims || {});
const humanExp = computed(() => {
  if (!state.claims?.exp) return '—';
  const d = new Date(state.claims.exp * 1000);
  return d.toLocaleString();
});

function base64UrlToJson(b64url) {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const str = atob(b64);
    const json = decodeURIComponent(
      Array.from(str).map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeJwt(t) {
  const parts = t.split('.');
  if (parts.length !== 3) return null;
  return base64UrlToJson(parts[1]);
}

function setSession(t) {
  const c = decodeJwt(t);
  if (!c) throw new Error('Invalid token');
  state.token = t;
  state.claims = c;
  localStorage.setItem('auth_token', t);
}

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    });
    if (!res.ok) {
      let msg = 'Login failed';
      try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    if (!data?.token) throw new Error('No token returned');
    setSession(data.token);
  } catch (e) {
    error.value = e?.message || 'Something went wrong';
  } finally {
    loading.value = false;
  }
}

function logout() {
  localStorage.removeItem('auth_token');
  state.token = '';
  state.claims = null;
  username.value = '';
  password.value = '';
}

onMounted(() => {
  const t = localStorage.getItem('auth_token');
  if (t) {
    try { setSession(t); } catch { localStorage.removeItem('auth_token'); }
  }
});
</script>

<style scoped>
</style>

