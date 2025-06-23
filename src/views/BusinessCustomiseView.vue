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
import BusinessCustomise1 from '@/components/BusinessCustomise1.vue'
import BusinessCustomise2 from '@/components/BusinessCustomise2.vue'
import BusinessAdd3View from '@/components/BusinessAdd3.vue'
import BusinessAdd4View from '@/components/BusinessAdd4.vue'
import BusinessAddSuccess from '@/components/BusinessAdd5.vue'

const inserting = ref(false)

const tab = ref(1)
const router = useRouter()

const stepFields: string[][] = [
  ['logo'],
  ['latitude', 'longitude'],
  ['address', 'city', 'pincode', 'state'],
  ['email', 'contact'],
]

const isLastStep = computed(() => tab.value === stepFields.length)
const formProgress = computed(() => (tab.value / stepFields.length) * 100)

const schema = yup.object({
  logo: yup
  .mixed<Blob>()
  .required('Please upload a logo for your business.')
  .test('is-blob', 'Invalid logo data.', (blob): blob is Blob =>
    blob instanceof Blob
  )
  .test('is-image', 'Only image files are allowed.', (blob) =>
    blob?.type?.startsWith('image/')
  )
  .test('file-size', 'Image must be less than 2MB.', (blob) =>
    blob?.size <= 2 * 1024 * 1024
  ),

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

const customise1 = ref<InstanceType<typeof BusinessCustomise1> | null>(null)

const goForward = async () => {
   if(tab.value==1){
    await customise1.value?.getResults()
  }

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
      <div v-if="tab !== 5" class="pb-2 text-caption">Customise profile</div>

      <v-progress-linear
        v-if="tab !== 5"
        class="mb-4"
        :model-value="formProgress"
        color="primary"
      />

      <v-tabs-window v-model="tab" eager>
        <v-tabs-window-item :value="1">
          <BusinessCustomise1 ref="customise1"/>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <BusinessCustomise2 />
        </v-tabs-window-item>
        <v-tabs-window-item :value="3">
          <BusinessAdd3View />
        </v-tabs-window-item>
        <v-tabs-window-item :value="4">
          <BusinessAdd4View />
        </v-tabs-window-item>
        <v-tabs-window-item :value="5">
          <BusinessAddSuccess />
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
