<script setup lang="ts">
import Map from '@/components/Map.vue'

const emit = defineEmits<{
  (e: 'update:location', location: { lat: number; lng: number }): void
}>()

function forwardLocation(location: { lat: number; lng: number }) {
  emit('update:location', location)
}
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Set Your Business Location</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    This pin marks your business' precise location on the map, guiding customers directly to you.
  </div>

  <div class="text-subtitle-2 mb-4 barlow text-onSurface font-weight-bold">
    The map currently shows your device's location. If you're at your business, press "Update Pin to
    My Location" to try for better accuracy. If not, please move to your business location and try
    again.
  </div>

  <Map @update:location="forwardLocation" />
</template>
