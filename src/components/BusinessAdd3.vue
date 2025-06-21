<script setup lang="ts">
import { Field } from 'vee-validate'
const states = [
  'Andaman & Nicobar',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli & Daman & Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telengana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]
</script>

<template>
  <div class="text-h5 mb-4 barlow text-onSurface">Enter your business address</div>
  <div class="text-subtitle-2 mb-4 barlow text-onSurface">
    Add a location where customers can visit your business in person
  </div>
  <Field name="address" v-slot="{ field, errorMessage, value }">
    <v-text-field
      v-bind="field"
      :model-value="value"
      clearable
      color="primary"
      label="Street Address"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
  <div class="my-4" />
  <Field name="city" v-slot="{ field, errorMessage, value }">
    <v-text-field
      v-bind="field"
      :model-value="value"
      clearable
      color="primary"
      label="City"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
  <div class="my-4" />
  <Field name="pincode" v-slot="{ field, errorMessage, value }">
    <v-text-field
      v-bind="field"
      :model-value="value"
      clearable
      color="primary"
      label="Pincode"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
  <div class="my-4" />

  <Field name="state" v-slot="{ field, errorMessage, value }">
    <v-select
      v-bind="field"
      :model-value="value"
      clearable
      color="primary"
      label="State"
      :items="states"
      variant="outlined"
      :error="!!errorMessage"
      :error-messages="errorMessage"
    />
  </Field>
</template>
<!-- This PIN is not recognised. -->
<!-- This PIN does not appear to match the rest of this address. -->
