<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useForm, Form } from 'vee-validate'

const tab = ref(1)
const router = useRouter()

const totalSteps = 4

const isLastStep = computed(() => tab.value === totalSteps)
const formProgress = computed(() => (tab.value / totalSteps) * 100)

const goBack = () => {
  if (tab.value === 1) {
    router.back()
  } else {
    tab.value--
  }
}

const goForward = () => {
  if (!isLastStep.value) {
    tab.value++
  } else {
    alert('Submit form')
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

      <v-tabs-window v-model="tab" :eager="true">
        <v-tabs-window-item :value="1">
          <div class="text-h6">Step 1 – Business Name</div>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <div class="text-h6">Step 2 – Location</div>
        </v-tabs-window-item>
        <v-tabs-window-item :value="3">
          <div class="text-h6">Step 3 – Address</div>
        </v-tabs-window-item>
        <v-tabs-window-item :value="4">
          <div class="text-h6">Step 4 – Contact</div>
        </v-tabs-window-item>
      </v-tabs-window>

      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" class="text-none" @click="goForward">
          {{ isLastStep ? 'Submit' : 'Next' }}
        </v-btn>
      </div>
    </v-sheet>
  </v-main>
</template>
