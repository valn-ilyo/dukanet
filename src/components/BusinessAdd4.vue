<script setup lang="ts">
import { Field, useField } from 'vee-validate'
import { useUserInfo } from '@/composables/useUserInfo'
const { email: userEmail } = useUserInfo()

const {value: email} = useField('email')

email.value = userEmail.value
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">
    What contact details do you want to show to customers?
  </div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    Help customers get in touch by including this info on your profile
  </div>

  <Field name="email" v-slot="{ field, errorMessage, value }">
    <v-text-field
      v-bind="field"
      :model-value="value"
      clearable
      color="primary"
      label="Email"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
  <div class="my-4" />
  <Field name="contact" v-slot="{ field, errorMessage }">
    <v-text-field
      v-bind="field"
      prefix="+91"
      color="primary"
      label="Contact"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
</template>
