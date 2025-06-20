import { defineStore } from 'pinia'
import { useGeolocation } from '@vueuse/core'
import { ref, watch } from 'vue'

export const useGeolocationStore = defineStore('geolocation', () => {
  const { coords, error } = useGeolocation({
    immediate: true,
    enableHighAccuracy: true,
  })

  const hasGeolocationAccess = ref<boolean | null>(null)

  watch(coords, (newCoords) => {
    if (isFinite(newCoords.latitude)) {
      hasGeolocationAccess.value = true
    }
  })

  watch(error, () => {
    hasGeolocationAccess.value = false
  })

  return {
    coords,
    hasGeolocationAccess,
  }
})
