<script setup lang="ts">
import Map from '@/components/Map.vue'
import { useGeolocationStore } from '@/stores/geolocation'
import { storeToRefs } from 'pinia'
const geolocationStore = useGeolocationStore()
const { location } = storeToRefs(geolocationStore)
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Set Your Business Location</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    This pin marks your business' precise location on the map. It will be used to provide accurate
    directions to your customers.
  </div>

  <div class="text-subtitle-2 mb-4 barlow text-onSurface font-weight-bold">
    Your current device location has been used as a starting point. Please review the pin's
    placement and adjust if necessary.
  </div>

  <Map :latitude="location.latitude" :longitude="location.longitude" title="Eiffel Tower" />

  <v-btn
    text="Adjust pin to your current location"
    class="text-none mx-auto rounded-0 mb-4"
    color="secondary"
    elevation="0"
    prepend-icon="mdi-crosshairs-gps"
    block
  />
</template>
