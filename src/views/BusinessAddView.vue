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
  ['email', 'contact'],
]

const isLastStep = computed(() => tab.value === stepFields.length)
const formProgress = computed(() => (tab.value / stepFields.length) * 100)

const schema = yup.object({
  name: yup.string().required('Business name is required').min(3),
  handle: yup
    .string()
    .required('Handle is required')
    .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores allowed'),

  latitude: yup.number().required().min(-90).max(90),
  longitude: yup.number().required().min(-180).max(180),

  address: yup.string().required(),
  city: yup.string().required(),
  pincode: yup
    .string()
    .required()
    .matches(/^[1-9][0-9]{5}$/, 'Enter a valid 6-digit PIN code'),
  state: yup.string().required(),

  email: yup.string().required().email(),
  contact: yup
    .string()
    .required()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
})

// VeeValidate form setup
const { validateField, handleSubmit } = useForm({
  validationSchema: schema,
})

const onSubmit = (values: Record<string, any>) => {
  console.log('Form submitted successfully:', values)
  alert('Form submitted successfully!')
}

const goBack = () => {
  if (tab.value === 1) {
    router.back()
  } else {
    tab.value--
  }
}

const goForward = async () => {
  const currentFields = stepFields[tab.value - 1]
  console.log('Fields to validate:', currentFields) // Keep this for clarity

  const validationPromises = currentFields.map((field) => validateField(field))
  const results = await Promise.all(validationPromises)

  let allValid = true
  results.forEach((r, index) => {
    // Log the full result for each field to see 'valid' status and 'errors'
    console.log(`Field '${currentFields[index]}' validation result:`, r)
    if (!r.valid) {
      console.error(`Validation failed for '${currentFields[index]}':`, r.errors)
      allValid = false // Set to false if any field is invalid
    }
  })

  if (allValid) {
    if (isLastStep.value) {
      handleSubmit(onSubmit)()
    } else {
      tab.value++
    }
  } else {
    console.log(
      'Validation failed for the current step. Please fill out all required fields correctly.',
    )
    // Optionally, you might want to scroll to the first error or highlight them more prominently.
  }
}
</script>

<template>
  <v-app-bar density="compact" scroll-behavior="hide" elevation="0">
    <template #prepend>
      <v-btn icon="mdi-arrow-left" variant="plain" @click="goBack" />
    </template>
  </v-app-bar>

  <v-main>
    <v-sheet class="mx-4 mb-4">
      <div class="pb-2 text-caption">Create profile</div>

      <v-progress-linear class="mb-4" :model-value="formProgress" color="primary" />

      <Form :validation-schema="schema" @submit="handleSubmit(onSubmit)">
        <v-tabs-window v-model="tab" eager>
          <v-tabs-window-item :value="1"><BusinessAdd1View /></v-tabs-window-item>
          <v-tabs-window-item :value="2"><BusinessAdd2View /></v-tabs-window-item>
          <v-tabs-window-item :value="3"><BusinessAdd3View /></v-tabs-window-item>
          <v-tabs-window-item :value="4"><BusinessAdd4View /></v-tabs-window-item>
        </v-tabs-window>
      </Form>

      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" class="text-none" @click="goForward">
          {{ isLastStep ? 'Submit' : 'Next' }}
        </v-btn>
      </div>
    </v-sheet>
  </v-main>
</template>
