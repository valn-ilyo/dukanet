<script setup lang="ts">
import logo from '@/components/icons/dukanet-icon.vue'
</script>

<template>
  <v-app>
    <v-app-bar title="dukanet" :elevation="0" color="background">
      <template #title>
        <div class="text-onBackground fill-height d-flex align-center justify-center">
          <v-icon size="small" class="mx-2"><logo /></v-icon>
          dukanet
        </div>
      </template>
    </v-app-bar>
    <v-main class="d-flex align-center justify-center">

        <v-sheet :max-width="400" class="d-flex flex-column align-center justify-center">
    <v-card-title class="text-h3 text-wrap text-center font-weight-bold text-primary">
     404
    </v-card-title>
    <v-card-title class="text-h4 text-wrap text-center font-weight-bold text-onBackground">
     Oops! Page not found
    </v-card-title>

    <v-card-subtitle class="pb-4 text-subtitle-2 text-wrap text-center text-onBackground">
     The page you are looking for doesn't exist or has been moved.
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        text="Go home"
        prepend-icon="mdi-home-outline"
        class="text-none rounded-xl "
        color="primary"
        variant="elevated"
        block
   to="/"
      />
        
    </v-card-actions>
  </v-sheet>
    </v-main>
  </v-app>
</template>
