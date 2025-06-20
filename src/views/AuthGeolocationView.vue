<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useGeolocationStore } from '@/stores/geolocation'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()

const geolocationStore = useGeolocationStore()
const { hasGeolocationAccess } = storeToRefs(geolocationStore)

const nextUrl = (route.query.next as string) || '/'

watch(hasGeolocationAccess, (newValue) => {
  if (newValue) {
    router.replace(nextUrl)
  }
})
</script>

<template>
  <v-container :max-width="400" class="d-flex flex-column align-center justify-center">
    <v-card-title class="text-h4 text-wrap text-center font-weight-bold text-onBackground">
      Unlock Your Local Hub
    </v-card-title>

    <v-card-subtitle class="pb-4 text-subtitle-2 text-wrap text-center text-onBackground">
      For the best local experience, please enable
      <span class="font-weight-bold text-onSurface">geolocation permission</span>. It's how we help
      you easily find and connect with your nearby community!
    </v-card-subtitle>

    <v-alert :type="hasGeolocationAccess === false ? 'warning' : 'info'" variant="tonal">
      <span v-if="hasGeolocationAccess === false">
        Location access failed. If permission was denied, refresh the page to try again.
      </span>

      <span v-else>
        <span v-if="hasGeolocationAccess === true">Redirecting you </span>
        <span v-else>Attempting to locate you </span>
        <span
          v-motion
          :initial="{ y: 0 }"
          :enter="{
            y: -5,
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 400,
              ease: 'easeOut',
              delay: 0,
            },
          }"
          style="display: inline-block"
          >.
        </span>
        <span
          v-motion
          :initial="{ y: 0 }"
          :enter="{
            y: -5,
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 400,
              ease: 'easeOut',
              delay: 100,
            },
          }"
          style="display: inline-block"
          >.
        </span>
        <span
          v-motion
          :initial="{ y: 0 }"
          :enter="{
            y: -5,
            transition: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 400,
              ease: 'easeOut',
              delay: 200,
            },
          }"
          style="display: inline-block"
          >.</span
        >
      </span>
    </v-alert>
  </v-container>
</template>

<style scoped>
.text-h4 {
  line-height: 1.2;
}

.v-alert span[style*='display: inline-block'] {
  margin-right: 0.05em;
  margin-left: 0.05em;
}
</style>
