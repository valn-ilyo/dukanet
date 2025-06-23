<script setup lang="ts">
import BusinessAddMap from '@/components/BusinessAddMap.vue'
import { useField } from 'vee-validate'

const { value: latitude } = useField('latitude')
const { value: longitude } = useField('longitude')

const { value: address } = useField('address')
const { value: city } = useField('city')
const { value: pincode } = useField('pincode')
const { value: state } = useField('state')

function setValues(location: { lat: number; lng: number }) {
  latitude.value = location.lat
  longitude.value = location.lng
  reverseGeocode(location.lat, location.lng)
}

async function reverseGeocode(lat: number, lng: number) {
  const key = import.meta.env.VITE_GOOGLE_MAP_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`

  const res = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK') throw new Error('Geocoding failed')

  interface AddressComponent {
    long_name: string
    short_name: string
    types: string[]
  }
  const c: AddressComponent[] = data.results[0].address_components
  const get = (type: string) =>
    c.find((x: AddressComponent) => x.types.includes(type))?.long_name || ''

  const parts = [
    get('subpremise'),
    get('premise'),
    [get('street_number'), get('route')].filter(Boolean).join(' '),
    get('neighborhood'),
  ]

  address.value = parts.filter(Boolean).join(', ')
  city.value = get('locality') || get('sublocality') || get('administrative_area_level_2')
  pincode.value = get('postal_code')
  state.value = get('administrative_area_level_1')
}
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Pinpoint Your Business on the Map</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    Help customers find you easily by marking your exact location.
  </div>

  <div class="font-weight-bold text-subtitle-2 mb-4 barlow text-onSurface">
    Drag the pin to precisely mark your business
    address, or press "Update Pin to My Location" for better accuracy if you're currently at your
    business.
  </div>

  <BusinessAddMap @update:location="setValues" />

  <div class="mt-4  text-center text-caption ">
    Press 'Next' if the marker is correctly placed.
  </div>
</template>
