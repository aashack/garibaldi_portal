<template>
  <div class="top-actions">
    <router-link class="btn" to="/about">About</router-link>
    <router-link class="btn secondary" to="/login">Login</router-link>
  </div>
  <section class="center" style="text-align:center;">
    <h1 class="title">Welcome</h1>
  </section>
  
</template>

<script setup>
</script>

<style scoped>
.center {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-actions {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
}
.top-actions :deep(.btn) {
  width: auto;
  padding: 8px 12px;
}
</style>
