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

const emit = defineEmits<{
  (e: 'update:location', payload: { lat: number; lng: number }): void
}>()

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

    const initialPosition = { lat: coords.value.latitude, lng: coords.value.longitude }

    // Guard against cases where initial geolocation might be invalid
    if (isNaN(initialPosition.lat) || isNaN(initialPosition.lng)) {
      throw new Error('Initial geolocation not available or invalid. Please ensure location services are enabled.')
    }

    if (!mapDiv.value) throw new Error('Map display area not found.')

    map = new Map(mapDiv.value, {
      center: initialPosition,
      zoom: 18,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      disableDefaultUI: true,
      zoomControl: true,
    })

    marker = new AdvancedMarkerElement({
      map,
      position: initialPosition,
      title: 'Your Business Location',
      gmpDraggable: true,
    })

    infoWindow = new InfoWindow({
      content: 'Your Business Location',
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    infoWindow.open(map, marker) // Open info window on initial load

    emit('update:location', initialPosition)

    marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
      const newLat = event.latLng?.lat()
      const newLng = event.latLng?.lng()

      if (typeof newLat === 'number' && typeof newLng === 'number') {
        const newPosition = { lat: newLat, lng: newLng }
        emit('update:location', newPosition)

        // Update the info window position after drag
        infoWindow.setPosition(newPosition);
        infoWindow.open(map, marker);
      } else {
        console.error('Could not get new position after marker dragend event.');
      }
    })

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
  const newPosition = { lat, lng }

  // Ensure valid coordinates before attempting to move marker/map
  if (isNaN(lat) || isNaN(lng)) {
    notify({
      message: 'Your current location is not available or invalid. Please check device settings.',
      color: 'warning',
    })
    loading.value = false
    return;
  }

  marker.position = newPosition
  map.setCenter(newPosition)
  map.setZoom(18)

  // Update info window position
  if (infoWindow) {
    infoWindow.setPosition(newPosition)
    infoWindow.open(map, marker)
  }

  emit('update:location', newPosition)

  loading.value = false
}
</script>

<template>
  <div>
    <div ref="mapDiv" style="width: 100%; aspect-ratio: 1 / 1" />
    <v-btn
      text="Update Pin to My Location"
      class="text-none rounded-0"
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