<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useForm } from 'vee-validate'
import { supabase } from '@/lib/supabaseClient'
import { useUserInfo } from '@/composables/useUserInfo'
import { useNotifier } from '@/composables/useNotifier'

const { refreshBusinessStatus } = useUserInfo()
const { notify } = useNotifier()
import BusinessAdd1 from '@/components/BusinessAdd1.vue'
import BusinessAdd2 from '@/components/BusinessAdd2.vue'
import BusinessAdd3 from '@/components/BusinessAdd3.vue'
import BusinessAdd4 from '@/components/BusinessAdd4.vue'
import BusinessAdd5 from '@/components/BusinessAdd5.vue'

const inserting = ref(false)

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
  name: yup
    .string()
    .required('Tell us your business name! It’s a must-have.')
    .min(3, 'Your business name should be at least 3 characters long.'),
  handle: yup
    .string()
    .required('A unique handle is essential for your business.')
    .matches(
      /^[a-zA-Z0-9_]+$/,
      'Handles can only contain letters, numbers, and underscores. No spaces or special characters!',
    )
    .test(
      'is-unique',
      'This handle is already taken. Please choose another one.',
      async (value) => {
        if (!value) return true // Let the 'required' rule handle empty values

        try {
          const { data, error } = await supabase
            .from('businesses')
            .select('handle')
            .eq('handle', value)
            .limit(1)

          if (error) {
            notify({
              message: `Error checking handle uniqueness: ${error.message}`,
              color: 'error',
            })
            return false
          }

          return data.length === 0
        } catch (err) {
          notify({
            message: `Unexpected error during handle uniqueness check: ${err}`,
            color: 'error',
          })
          return false
        }
      },
    ),

  latitude: yup.number().required().min(-90).max(90),
  longitude: yup.number().required().min(-180).max(180),

  address: yup.string().required('Your full address is required so we can locate your business.'),
  city: yup.string().required('Which city is your business located in? This field is required.'),
  pincode: yup
    .string()
    .required('Please enter your 6-digit PIN code. It’s essential for accurate location.')
    .matches(
      /^[1-9][0-9]{5}$/,
      "That doesn't look like a valid 6-digit Indian PIN code. Please check again.",
    ),
  state: yup.string().required("Don't forget to tell us which state your business is in!"),

  email: yup
    .string()
    .email('Please enter a valid email address, like "example@domain.com".')
    .notRequired(),
  contact: yup
    .string()
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.')
    .notRequired(),
})

const { validateField, handleSubmit } = useForm({
  validationSchema: schema,
})

const onSubmit = async (values: Record<string, number>) => {
  inserting.value = true

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Prepare form data
    const formData = {
      id: user!.id,
      name: values.name,
      handle: values.handle,
      email: values.email ?? null,
      contact: values.contact ?? null,
      address: `${values.address}, ${values.city}, ${values.state} - ${values.pincode}`,
      location: `POINT(${values.longitude} ${values.latitude})`,
    }

    // Insert data into Supabase
    const { error: insertError } = await supabase.from('businesses').insert([formData])

    if (insertError) {
      notify({
        message: `Oops! Something went wrong while saving your business: ${insertError.message}. Please try again.`,
        color: 'error',
      })
    } else {
      await refreshBusinessStatus()
      tab.value++
    }
  } catch {
    notify({ message: 'An unexpected error occurred. Please try again later.', color: 'error' })
  } finally {
    inserting.value = false
  }
}

const goBack = () => {
  if (tab.value === 1) {
    router.back()
  } else {
    tab.value--
  }
}

const goForward = async () => {
  const fields = stepFields[tab.value - 1]
  const results = await Promise.all(fields.map((field) => validateField(field)))
  const allValid = (results as { valid: boolean }[]).every((r) => r.valid)

  if (allValid) {
    if (isLastStep.value) {
      handleSubmit(onSubmit)()
    } else {
      tab.value++
    }
  } 
}
</script>

<template>
  <v-app-bar v-if="tab !== 5" density="compact" scroll-behavior="hide" elevation="0">
    <template #prepend>
      <v-btn icon="mdi-arrow-left" variant="plain" @click="goBack" />
    </template>
  </v-app-bar>

  <v-main>
    <v-sheet class="mx-4 mb-4">
      <div v-if="tab !== 5" class="pb-2 text-caption">Create profile</div>

      <v-progress-linear
        v-if="tab !== 5"
        class="mb-4"
        :model-value="formProgress"
        color="primary"
      />

      <v-tabs-window v-model="tab" eager>
        <v-tabs-window-item :value="1">
          <BusinessAdd1 />
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <BusinessAdd2 />
        </v-tabs-window-item>
        <v-tabs-window-item :value="3">
          <BusinessAdd3 />
        </v-tabs-window-item>
        <v-tabs-window-item :value="4">
          <BusinessAdd4 />
        </v-tabs-window-item>
        <v-tabs-window-item :value="5">
          <BusinessAdd5 />
        </v-tabs-window-item>
      </v-tabs-window>

      <div v-if="tab !== 5" class="d-flex justify-end mt-4">
        <v-btn color="primary" class="text-none" :loading="inserting" @click="goForward">
          {{ isLastStep ? 'Done' : 'Next' }}
        </v-btn>
      </div>
    </v-sheet>
  </v-main>
</template>
