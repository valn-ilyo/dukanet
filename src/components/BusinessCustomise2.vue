<script setup lang="ts">
import { ref, watch } from 'vue'
import { useField } from 'vee-validate'

const { value: logo } = useField<Blob>('logo') // tell TS that logo is a Blob
const logoPreviewUrl = ref<string | null>(null)

// Watch for changes in logo and update preview URL
watch(logo, (newBlob) => {
  if (newBlob instanceof Blob) {
    if (logoPreviewUrl.value) {
      URL.revokeObjectURL(logoPreviewUrl.value) // cleanup
    }
    logoPreviewUrl.value = URL.createObjectURL(newBlob)
  }
})
</script>


<template>
  <v-img
  v-if="logoPreviewUrl"
  :src="logoPreviewUrl"
  width="100"
  height="100"
  alt="Logo preview"
  class="my-4 rounded"
/>

</template>