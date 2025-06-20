<script setup lang="ts">
import DefaultAppbar from '@/components/DefaultAppbar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const path = localStorage.getItem('postAuthRedirect')
if (path) {
  localStorage.removeItem('postAuthRedirect')
  router.replace(path)
} else router.replace('/')
</script>

<template>
  <DefaultAppbar />
  <v-main>
    <RouterView />
  </v-main>
  <v-footer> This is a footer </v-footer>
</template>
