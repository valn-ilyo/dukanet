<script setup lang="ts">
import { ref } from 'vue'
import { Field } from 'vee-validate'
import { Cropper, CircleStencil, type CropperResult } from 'vue-advanced-cropper' // Import CropperResult for better typing
import { useField } from 'vee-validate'

const { value: logo } = useField('logo')

// State variables
const fileInput = ref<HTMLInputElement | null>(null)
const logoFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const showGrid = ref<string | null>(null) // Using null as initial state, 'grid' when active

// Cropper specific refs and state
const myCropper = ref<InstanceType<typeof Cropper> | null>(null) // Correctly typed and initialized ref for the Cropper component

// Methods
function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (files && files.length > 0) {
    logoFile.value = files[0]
    previewUrl.value = URL.createObjectURL(files[0])
  }
  input.value = ''
}

function removeImage() {
  logoFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = null
}

async function getResults(): Promise<Blob | null> {
  if (myCropper.value) {
    const { canvas } = myCropper.value.getResult() as CropperResult
    if (canvas) {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            logo.value = blob
            resolve(blob)
          } else {
            resolve(null)
          }
        }, 'image/png')
      })
    }
  }
  return null
}




defineExpose ({ getResults })
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Add your business Logo</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    This will help you develop a strong brand identity and make your business more recognizable.
  </div>

  <v-card
    width="300"
    height="300"
    variant="outlined"
    color="primary"
    class="mx-auto rounded-0 position-relative"
  >
    <svg
      v-if="showGrid"
      class="position-absolute top-0 left-0 grid-svg-display"
      style="z-index: 999; pointer-events: none"
      width="300"
      height="300"
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="100" y1="0" x2="100" y2="300" stroke="black" stroke-width="1" />
      <line x1="200" y1="0" x2="200" y2="300" stroke="black" stroke-width="1" />
      <line x1="0" y1="100" x2="300" y2="100" stroke="black" stroke-width="1" />
      <line x1="0" y1="200" x2="300" y2="200" stroke="black" stroke-width="1" />
    </svg>

    <v-btn-toggle
      v-model="showGrid"
      class="position-absolute left-0 rounded-circle"
      style="z-index: 999"
      base-color="surface"
      :class="showGrid ? 'opacity-100' : 'opacity-50'"
    >
      <v-btn value="grid" icon="mdi-grid-large" color="surface" variant="text" />
    </v-btn-toggle>

    <v-btn
      v-if="previewUrl"
      icon="mdi-close"
      color="surface"
      variant="text"
      @click="removeImage"
      class="position-absolute right-0 opacity-50"
      style="z-index: 999"
    />

    <Cropper
      ref="myCropper" v-if="previewUrl"
      :src="previewUrl"
      :stencil-component="CircleStencil"
      :stencil-size="{ width: 300, height: 300 }"
      :stencil-props="{
        handlers: {},
        movable: false,
        resizable: false,
        aspectRatio: 1,
      }"
      image-restriction="stencil"
      style="width: 100%; height: 100%"
    />

    <div v-else class="d-flex align-center justify-center fill-height">
      <v-btn
        variant="flat"
        color="primary"
        icon="mdi-image-plus"
        size="x-large"
        @click="fileInput?.click()"
      />
    </div>
  </v-card>

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