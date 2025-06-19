<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from 'vue-router'
import { ref, watch } from 'vue'

interface routeMeta {
  progress: number
  nextRoute: string
  prevRoute: string
}

const route = useRoute() as RouteLocationNormalizedLoaded & { meta: routeMeta }
const router = useRouter()

const formProgress = ref(0)

watch(
  route,
  (newRoute) => {
    formProgress.value = newRoute.meta.progress
  },
  { immediate: true },
)

const goBack = () => {
  router.push(route.meta.prevRoute)
}
</script>

<template>
  <v-app-bar density="compact" scroll-behavior="hide" elevation="0">
    <template #prepend>
      <v-btn icon="mdi-arrow-left" variant="plain" color="onBackground" @click="goBack" />
    </template>
  </v-app-bar>
  <v-main>
    <v-sheet class="pa-4">
      <div class="pb-2 text-caption text-onSurface">Create profile</div>
      <v-progress-linear class="mb-4" v-model="formProgress" color="primary"></v-progress-linear>
      <RouterView />
      <div class="position-relative">
        <v-btn
          text="Next"
          class="text-none position-absolute right-0"
          color="primary"
          elevation="0"
          :to="route.meta.nextRoute"
        />
      </div>
    </v-sheet>
  </v-main>
</template>
