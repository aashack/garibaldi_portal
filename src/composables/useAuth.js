import { reactive, computed } from 'vue';
import { AUTH_BASE_URL } from '../config';

// Module-scoped state to behave like a simple store
const state = reactive({ token: '', claims: null });

function base64UrlToJson(b64url) {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const str = atob(b64);
    const json = decodeURIComponent(
      Array.from(str)
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function decodeJwt(t) {
  const parts = t.split('.');
  if (parts.length !== 3) {
    return null;
  }
  return base64UrlToJson(parts[1]);
}

function setSession(t) {
  const c = decodeJwt(t);
  if (!c) {
    throw new Error('Invalid token');
  }
  state.token = t;
  state.claims = c;
  localStorage.setItem('auth_token', t);
}

function clearSession() {
  localStorage.removeItem('auth_token');
  state.token = '';
  state.claims = null;
}

const token = computed(() => state.token);
const claims = computed(() => state.claims || {});
const loggedIn = computed(() => {
  return !!state.token && !!state.claims;
});
const humanExp = computed(() => {
  if (!state.claims?.exp) {
    return '—';
  }
  const d = new Date(state.claims.exp * 1000);
  return d.toLocaleString();
});

async function login(username, password) {
  const res = await fetch(`${AUTH_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let msg = 'Login failed';
    try {
      const j = await res.json();
      if (j?.error) {
        msg = j.error;
      }
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data?.token) {
    throw new Error('No token returned');
  }
  
  setSession(data.token);
  return data;
}

async function register({ username, email, password, confirm }) {
  if (password !== confirm) {
    throw new Error('Passwords do not match');
  }

  const res = await fetch(`${AUTH_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      username, 
      email, 
      password, 
      confirmPassword: confirm 
    }),
  });

  if (!res.ok) {
    let msg = 'Registration failed';
    try {
      const j = await res.json();
      if (j?.error) {
        msg = j.error;
      }
    } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  if (!data?.token) {
    throw new Error('No token returned');
  }

  setSession(data.token);
  return data;
}

function logout() {
  clearSession();
}

function initFromStorage() {
  const t = localStorage.getItem('auth_token');
  if (t) {
    try {
      setSession(t);
    } catch {
      localStorage.removeItem('auth_token');
    }
  }
}

export function useAuth() {
  return {
    token,
    claims,
    loggedIn,
    humanExp,
    setSession,
    login,
    register,
    logout,
    initFromStorage,
  };
}

