<script setup lang="ts">
import { Field } from 'vee-validate'
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Start building your Business Profile</div>

  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    This will help you get discovered by customers
  </div>

  <Field name="name" v-slot="{ field, errorMessage }">
    <v-text-field
      v-bind="field"
      clearable
      color="primary"
      label="Business name*"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
  <div class="my-4" />
  <Field name="handle" v-slot="{ field, errorMessage }">
    <v-text-field
      v-bind="field"
      prefix="@"
      clearable
      color="primary"
      label="Unique handle*"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
</template>
