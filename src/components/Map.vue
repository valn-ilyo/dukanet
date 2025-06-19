<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Loader } from '@googlemaps/js-api-loader'

const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    default: 'Location',
  },
})

const mapDiv = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAP_API_KEY as string,
    libraries: ['marker'],
  })

  const { Map } = await loader.importLibrary('maps')
  const { AdvancedMarkerElement } = await loader.importLibrary('marker')

  const position: google.maps.LatLngLiteral = {
    lat: props.latitude,
    lng: props.longitude,
  }

  if (mapDiv.value) {
    const map = new Map(mapDiv.value, {
      center: position,
      zoom: 16,
      mapId: import.meta.env.VITE_GOOGLE_MAP_ID as string,
      disableDefaultUI: true,
    })

    new AdvancedMarkerElement({
      map,
      position: position,
      title: props.title,
    })
  } else {
    console.error('Map div element not found.')
  }
})
</script>

<template>
  <div>
    <div ref="mapDiv" style="height: 50vh; width: 100%" />
  </div>
</template>
