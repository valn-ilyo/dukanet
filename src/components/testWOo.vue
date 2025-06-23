<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'

// State variables
const fileInput = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)

// Methods
// Triggered when user selects file
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    logoFile.value = files[0]
    // Create a preview URL
    previewUrl.value = URL.createObjectURL(files[0])
  }
  // Allow selecting the same file again
  input.value = ''
}

// Clears the selected image and preview
function removeImage() {
  logoFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value) // Clean up the object URL
  }
  previewUrl.value = null
}
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Add your business Logo</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    This will help you develop a strong brand identity and make your business more recognizable.
  </div>

  <div>
    <v-btn
      v-if="previewUrl"
      icon="mdi-close"
      class="position-absolute right-0"
      color="onSurface"
      variant="plain"
      @click="removeImage"
    />

    <v-card variant="outlined" class="rounded-circle" color="primary">
      <v-img :src="previewUrl || undefined" aspect-ratio="1" class="bg-surfaceVariant" cover>
        <template v-slot:placeholder>
          <div class="d-flex align-center justify-center fill-height">
            <v-btn
              variant="flat"
              color="primary"
              @click="fileInput?.click()"
              icon="mdi-image-plus"
              size="x-large"
            />
          </div>
        </template>
      </v-img>
    </v-card>
  </div>

  <Field name="logo" v-slot="{ errorMessage }">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileChange"
    />

    <div v-if="errorMessage" class="text-center text-caption text-error">
      {{ errorMessage }}
    </div>
  </Field>
</template>
