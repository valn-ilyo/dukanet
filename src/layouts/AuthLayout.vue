<script setup lang="ts">
import logo from '@/components/icons/dukanet-logo.vue'
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
      <RouterView />
    </v-main>
  </v-app>
</template>
