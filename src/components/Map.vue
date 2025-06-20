<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { useGeolocationStore } from '@/stores/geolocation'
import { storeToRefs } from 'pinia'
import { useNotifier } from '@/composables/useNotifier'

const { coords } = storeToRefs(useGeolocationStore())
const { notify } = useNotifier()

const mapDiv = ref<HTMLDivElement | null>(null)
let map: google.maps.Map
let marker: google.maps.marker.AdvancedMarkerElement
let infoWindow: google.maps.InfoWindow

const loading = ref(false)

onMounted(async () => {
  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY,
      libraries: ['marker'],
    })

    const [{ Map, InfoWindow }, { AdvancedMarkerElement }] = await Promise.all([
      loader.importLibrary('maps'),
      loader.importLibrary('marker'),
    ])

    const position = { lat: coords.value.latitude, lng: coords.value.longitude }

    if (!mapDiv.value) throw new Error('Map display area not found.')

    map = new Map(mapDiv.value, {
      center: position,
      zoom: 18,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
    })

    marker = new AdvancedMarkerElement({
      map,
      position,
      title: 'Your Business Location',
    })

    infoWindow = new InfoWindow({
      content: 'Your Business Location',
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    infoWindow.open(map, marker)
  } catch (err) {
    notify({
      message: (err as Error).message || 'Failed to load the map. Please try again.',
      color: 'error',
    })
  }
})

const repositionMarker = () => {
  loading.value = true

  const { latitude: lat, longitude: lng } = coords.value
  const pos = { lat, lng }

  marker.position = pos
  map.setCenter(pos)
  map.setZoom(18)

  if (infoWindow) {
    infoWindow.setPosition(pos)
    infoWindow.open(map, marker)
  }

  loading.value = false
}
</script>

<template>
  <div>
    <div ref="mapDiv" style="width: 100%; aspect-ratio: 1 / 1" />
    <v-btn
      text="Update Pin to My Location"
      class="text-none rounded-0 mb-4"
      color="error"
      elevation="0"
      prepend-icon="mdi-crosshairs-gps"
      block
      @click="repositionMarker"
      :loading="loading"
      :disabled="loading"
    />
  </div>
</template>
