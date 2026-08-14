<script setup lang="ts">
withDefaults(defineProps<{
  showBack?: boolean;
}>(), {
  showBack: false,
});

defineEmits<{
  back: [];
}>();
</script>

<template>
  <header class="header">
    <button v-if="showBack" class="back-btn" type="button" @click="$emit('back')">← All games</button>
    <div class="title">QUAKELE</div>
    <div class="subtitle">Daily earthquake puzzle</div>
  </header>
</template>
