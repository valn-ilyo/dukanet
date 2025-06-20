<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { useUserInfo } from '@/composables/useUserInfo'
import { useNotifier } from '@/composables/useNotifier'
import logo from '@/components/icons/dukanet-icon.vue'

const { avatarUrl, email, fullName } = useUserInfo()
const { notify } = useNotifier()
const router = useRouter()

const youDrawer = ref(false)
const loggingOut = ref(false)

const firstName = computed(() => fullName.value?.split(' ')[0] ?? '')

const logout = async () => {
  loggingOut.value = true
  const { error } = await supabase.auth.signOut()
  if (error) notify({ message: "We couldn't sign you out. Please try again.", color: 'error' })
  else router.push('/auth')
  loggingOut.value = false
}
</script>

<template>
  <v-navigation-drawer color="surfaceVariant" v-model="youDrawer" location="right" temporary>
    <v-sheet color="surfaceVariant" class="d-flex flex-column align-center">
      <div class="w-100 position-relative pa-2 d-flex align-center justify-center">
        <div class="text-caption text-onSurfaceVariant">{{ email }}</div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="x-small"
          color="onSurfaceVariant"
          @click.stop="youDrawer = !youDrawer"
          class="position-absolute right-0"
        />
      </div>

      <v-avatar color="primary">
        <v-img :src="avatarUrl" />
      </v-avatar>

      <div class="text-h6 barlow pa-2 text-onSurfaceVariant">Hi, {{ firstName }}!</div>

      <v-container>
        <v-btn
          prepend-icon="mdi-storefront-outline"
          text="Add your business"
          class="text-none justify-start rounded-t-xl rounded-b-0"
          color="surface"
          variant="flat"
          block
          to="/business"
        />
        <v-divider></v-divider>
        <v-btn
          prepend-icon="mdi-bookmark-outline"
          text="Your saved items"
          class="text-none justify-start rounded-0"
          color="surface"
          variant="flat"
          block
        />
        <v-divider></v-divider>
        <v-btn
          prepend-icon="mdi-logout"
          text="Logout"
          class="text-none justify-start rounded-b-xl rounded-t-0"
          color="surface"
          variant="flat"
          block
          @click="logout"
          :loading="loggingOut"
          :disabled="loggingOut"
        />
      </v-container>
    </v-sheet>
  </v-navigation-drawer>

  <v-app-bar density="compact" elevation="0" scroll-behavior="hide" extended>
    <template #prepend>
      <v-app-bar-nav-icon variant="plain" color="onBackground" density="comfortable" />
    </template>

    <template #title
      ><div class="text-onBackground fill-height d-flex align-center justify-center">
        <v-icon size="small" class="mx-2"> <logo /> </v-icon>
        dukanet
      </div>
    </template>

    <template #append>
      <v-btn icon="mdi-bell-outline" color="onBackground" density="comfortable" variant="plain" />
      <v-btn icon density="comfortable" @click.stop="youDrawer = !youDrawer">
        <v-avatar color="primary" size="x-small">
          <v-img :src="avatarUrl" />
        </v-avatar>
      </v-btn>
    </template>

    <template #extension>
      <v-autocomplete
        class="px-4 pt-4"
        density="compact"
        menu-icon=""
        placeholder="Search for Products"
        auto-select-first
        rounded
        variant="outlined"
        color="primary"
      >
        <template #append-inner>
          <v-btn variant="text" color="primary" icon="mdi-magnify" density="compact" />
        </template>
      </v-autocomplete>
    </template>
  </v-app-bar>
</template>
