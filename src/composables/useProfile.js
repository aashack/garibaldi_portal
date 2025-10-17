import { reactive, ref } from 'vue';
import { PORTAL_BASE_URL } from '../config';
import { getProfile, saveProfile as persistProfile } from '../services/profile';

const profile = reactive({ firstName: '', lastName: '', country: '', city: '', region: '' });
const hasProfile = ref(false);

async function loadProfile(token) {
  const data = await getProfile(PORTAL_BASE_URL, token);
  if (!data) {
    hasProfile.value = false;
    Object.assign(profile, { firstName: '', lastName: '', country: '', city: '', region: '' });
    return null;
  }
  hasProfile.value = true;
  Object.assign(profile, {
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    country: data.country || '',
    city: data.city || '',
    region: data.region || '',
  });
  return data;
}

async function saveProfile(token, dataOverride) {
  // Allow passing in a form snapshot; fall back to module state
  const payload = dataOverride || profile;
  const resp = await persistProfile(
    PORTAL_BASE_URL,
    token,
    payload,
    hasProfile.value
  );
  hasProfile.value = true;
  // Sync module state with saved data if override was used
  if (dataOverride) {
    Object.assign(profile, {
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      country: payload.country || '',
      city: payload.city || '',
      region: payload.region || '',
    });
  }
  return resp;
}

export function useProfile() {
  return {
    profile,
    hasProfile,
    loadProfile,
    saveProfile,
  };
}

