<template>
  <section class="card">
    <h1 class="title">Update Profile</h1>
    <p class="subtitle">Edit your profile information.</p>
    <form class="stack" @submit.prevent="onSave">
      <div class="field">
        <label class="label" for="user-id">User ID</label>
        <input id="user-id" class="input" :value="claims.sub" disabled />
      </div>
      <div class="field">
        <label class="label" for="firstName">First Name</label>
        <input id="firstName" class="input" v-model.trim="form.firstName" />
      </div>
      <div class="field">
        <label class="label" for="lastName">Last Name</label>
        <input id="lastName" class="input" v-model.trim="form.lastName" />
      </div>
      <div class="field">
        <label class="label" for="country">Country</label>
        <input id="country" class="input" v-model.trim="form.country" />
      </div>
      <div class="field">
        <label class="label" for="city">City</label>
        <input id="city" class="input" v-model.trim="form.city" />
      </div>
      <div class="field">
        <label class="label" for="region">Region (State/Province)</label>
        <input id="region" class="input" v-model.trim="form.region" />
      </div>
      <button class="btn" type="submit" :disabled="loading">
        <span v-if="!loading">Save Profile</span>
        <span v-else>Saving…</span>
      </button>
      <div class="row" style="margin-top:8px">
        <button type="button" class="btn secondary" style="width:auto; padding:8px 12px;" @click="$emit('back')">Back</button>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="saveStatus" class="info">{{ saveStatus }}</div>
    </form>
  </section>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  claims: { type: Object, required: true, default: () => ({}) },
  profile: { type: Object, required: true, default: () => ({}) },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  saveStatus: { type: String, default: '' },
});

const emit = defineEmits(['save', 'back']);

const form = reactive({ firstName: '', lastName: '', country: '', city: '', region: '' });

function syncFromProps() {
  Object.assign(form, {
    firstName: props.profile.firstName || '',
    lastName: props.profile.lastName || '',
    country: props.profile.country || '',
    city: props.profile.city || '',
    region: props.profile.region || '',
  });
}

syncFromProps();

watch(
  () => props.profile,
  () => syncFromProps(),
  { deep: true }
);

function onSave() {
  emit('save', { ...form });
}
</script>

<style scoped>
</style>

