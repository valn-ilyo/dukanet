<script setup lang="ts">
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
  'Kerela',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Neghalaya',
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
  <v-text-field clearable color="primary" label="Street Address" variant="outlined"></v-text-field>
  <v-text-field clearable color="primary" label="City" variant="outlined"></v-text-field>
  <v-text-field clearable color="primary" label="Pincode" variant="outlined"></v-text-field>
  <!-- This PIN is not recognised. -->
  <!-- This PIN does not appear to match the rest of this address. -->
  <v-select clearable color="primary" label="State" :items="states" variant="outlined" />
</template>
