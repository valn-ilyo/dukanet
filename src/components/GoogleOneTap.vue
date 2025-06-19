<script setup lang="ts">
import { onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useNotifier } from '@/composables/useNotifier'

const { notify } = useNotifier()

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential: string }) => void
            use_fedcm_for_prompt?: boolean
          }) => void
          prompt: () => void
        }
      }
    }
  }
}

onMounted(() => {
  if (!window.google?.accounts?.id) return

  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    callback: async ({ credential }: { credential: string }) => {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      })

      if (error) notify({ message: "We couldn't sign you in. Please try again.", color: 'error' })
    },
    use_fedcm_for_prompt: true,
  })

  window.google.accounts.id.prompt()
})
</script>
