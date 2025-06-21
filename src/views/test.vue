<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useForm, Form } from 'vee-validate'

import BusinessAdd1View from '@/components/BusinessAdd1.vue'
import BusinessAdd2View from '@/components/BusinessAdd2.vue'
import BusinessAdd3View from '@/components/BusinessAdd3.vue'
import BusinessAdd4View from '@/components/BusinessAdd4.vue'

const tab = ref(1)
const router = useRouter()

const stepFields: string[][] = [
  ['name', 'handle'],
  ['latitude', 'longitude'],
  ['address', 'city', 'pincode', 'state'],
  [],
]

const schema = yup.object({
  name: yup.string().required().min(3),
  handle: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9_]+$/, 'Handle can only contain letters, numbers, and underscores'),
  latitude: yup.number().required('Latitude is required').min(-90).max(90),
  longitude: yup.number().required('Longitude is required').min(-180).max(180),
  address: yup.string().required(),
  city: yup.string().required(),
  pincode: yup
    .string()
    .required()
    .matches(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit Indian PIN code'),
  state: yup.string().required(),
  email: yup.string().required().email(),
  contact: yup
    .string()
    .required()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

const { validateField, handleSubmit, setFieldValue } = useForm({ validationSchema: schema })

const isLastStep = computed(() => tab.value === stepFields.length)
const formProgress = computed(() => (tab.value / stepFields.length) * 100)

const onSubmit = (finalValues: Record<string, any>) => {
  console.log('Form submitted successfully!', finalValues)
  alert('Form submitted successfully!')
}

const goForward = async () => {
  const currentFields = stepFields[tab.value - 1]

  if (currentFields.length === 0) {
    if (isLastStep.value) {
      handleSubmit(onSubmit, (fail) => console.error('Form submission failed:', fail.errors))()
    } else {
      tab.value++
    }
    return
  }

  const results = await Promise.all(currentFields.map((field) => validateField(field)))
  const allValid = results.every((result) => result.valid)

  if (allValid) {
    if (isLastStep.value) {
      handleSubmit(onSubmit, (fail) => console.error('Form submission failed:', fail.errors))()
    } else {
      tab.value++
    }
  }
}

const goBack = () => {
  if (tab.value === 1) {
    router.back()
  } else {
    tab.value--
  }
}

async function geocodeFromCoords(location: { lat: number; lng: number }) {
  const { lat, lng } = location
  const geocoder = new google.maps.Geocoder()

  try {
    const {
      results,
      status,
    }: { results: google.maps.GeocoderResult[]; status: google.maps.GeocoderStatus } =
      await new Promise((resolve, reject) => {
        geocoder.geocode({ location }, (res, status) => {
          if (status === 'OK' && res) {
            resolve({ results: res, status })
          } else {
            reject(status)
          }
        })
      })

    const components = results[0].address_components
    const get = (type: string) => components.find((c) => c.types.includes(type))?.long_name || ''

    setFieldValue('latitude', lat)
    setFieldValue('longitude', lng)
    setFieldValue('address', `${get('route')} ${get('sublocality')}`.trim())
    setFieldValue('city', get('locality') || get('administrative_area_level_2'))
    setFieldValue('state', get('administrative_area_level_1'))
    setFieldValue('pincode', get('postal_code'))
  } catch (e) {
    console.warn('Geocode failed:', e)
  }
}
</script>

<template>
  <v-app-bar density="compact" scroll-behavior="hide" elevation="0">
    <template #prepend>
      <v-btn icon="mdi-arrow-left" variant="plain" color="onBackground" @click="goBack" />
    </template>
  </v-app-bar>

  <v-main>
    <v-sheet class="mx-4 mb-4 pa-4">
      <div class="pb-2 text-caption text-onSurface">Create profile</div>

      <v-progress-linear class="mb-4" v-model="formProgress" color="primary" />

      <Form :validation-schema="schema" @submit="onSubmit">
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :value="1"><BusinessAdd1View /></v-tabs-window-item>
          <v-tabs-window-item :value="2">
            <BusinessAdd2View @update:location="geocodeFromCoords" />
          </v-tabs-window-item>
          <v-tabs-window-item :value="3"><BusinessAdd3View /></v-tabs-window-item>
          <v-tabs-window-item :value="4"><BusinessAdd4View /></v-tabs-window-item>
        </v-tabs-window>
      </Form>

      <div class="d-flex justify-end mt-4">
        <v-btn
          :text="isLastStep ? 'Submit' : 'Next'"
          class="text-none"
          color="primary"
          elevation="0"
          @click="goForward"
        />
      </div>
    </v-sheet>
  </v-main>
</template>
