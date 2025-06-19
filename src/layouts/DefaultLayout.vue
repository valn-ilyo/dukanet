<script setup lang="ts">
import DefaultAppbar from '@/components/DefaultAppbar.vue'
</script>

<template>
  <DefaultAppbar />
  <v-main>
    <RouterView />
  </v-main>
  <v-footer> This is a footer </v-footer>
</template>
