<template>
  <section class="landing">
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
        <button class="btn" style="width:auto; padding:8px 12px; margin-right:8px;" @click="$emit('goToProfile')">Update Profile</button>
        <button class="btn" style="width:auto; padding:8px 12px;" @click="$emit('logout')">Log out</button>
      </div>
    </div>
    <ProfileInfo :profile="profile" />
  </section>
</template>

<script setup>
import ProfileInfo from './ProfileInfo.vue';

defineProps({
  claims: { type: Object, required: true, default: () => ({}) },
  token: { type: String, required: true, default: '' },
  humanExp: { type: String, required: true, default: '' },
  profile: { type: Object, required: true, default: () => ({}) },
});

defineEmits(['goToProfile', 'logout']);
</script>

<style scoped>
</style>
