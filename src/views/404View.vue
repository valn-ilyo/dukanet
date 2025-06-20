<script setup lang="ts">
import logo from '@/components/icons/dukanet-icon.vue'
</script>

<template>
  <v-app>
    <v-app-bar title="dukanet" :elevation="0" color="background">
      <template #title
        ><div class="text-onBackground fill-height d-flex align-center justify-center">
          <v-icon size="small" class="mx-2"> <logo /> </v-icon>
          dukanet
        </div>
      </template>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center">
      <v-container class="d-flex flex-column align-center justify-center">
        <v-alert type="info" text="404 - Page Not Found" variant="tonal" class="mb-4" />
        <v-btn to="/" class="text-none" color="primary rounded-xl">Take me home</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
