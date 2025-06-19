import { defineStore } from 'pinia'
import { useGeolocation } from '@vueuse/core'
import { ref, watch, reactive } from 'vue'

export const useGeolocationStore = defineStore('geolocation', () => {
  const { coords, error } = useGeolocation({ immediate: true })

  const hasGeolocationAccess = ref<boolean | null>(null)

  interface location {
    latitude: number
    longitude: number
  }

  const location: location = reactive({
    latitude: 0,
    longitude: 0,
  })

  watch(coords, (newCoords) => {
    if (isFinite(newCoords.latitude)) {
      hasGeolocationAccess.value = true
      if (newCoords.latitude !== location.latitude || newCoords.longitude !== location.longitude) {
        location.latitude = newCoords.latitude
        location.longitude = newCoords.longitude
      }
    }
  })

  watch(error, () => {
    hasGeolocationAccess.value = false
  })

  return {
    location,
    error,
    hasGeolocationAccess,
  }
})
