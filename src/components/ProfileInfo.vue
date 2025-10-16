<template>
  <hr />
    <h2 class="title">Your Profile</h2>
    <div class="stack" style="margin-top: 12px;">
      <div v-for="f in visibleFields" :key="f.key" class="row">
        <strong>{{ f.label }}</strong>
        <span>{{ f.value }}</span>
      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  profile: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const fields = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'region', label: 'Region' },
];

const visibleFields = computed(() => {
  return fields
    .map(f => ({ ...f, value: (props.profile?.[f.key] ?? '').toString().trim() }))
    .filter(f => !!f.value);
});
</script>

<style scoped>
</style>

