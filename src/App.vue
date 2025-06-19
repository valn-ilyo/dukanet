<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useNotifier } from '@/composables/useNotifier'
const { isActive, message, color, timeout } = useNotifier()
</script>

<template>
  <v-app>
    <v-Snackbar v-model="isActive" :color="color" :timeout="timeout" multi-line>
      {{ message }}
    </v-Snackbar>
    <RouterView />
  </v-app>
</template>
