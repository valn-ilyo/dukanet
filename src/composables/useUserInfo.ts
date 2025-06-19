import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)

supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null
})

supabase.auth.onAuthStateChange((_event, newSession) => {
  user.value = newSession?.user ?? null
})

const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? null)
const email = computed(() => user.value?.user_metadata?.email ?? null)
const fullName = computed(() => user.value?.user_metadata?.full_name ?? null)

export function useUserInfo() {
  return {
    avatarUrl,
    email,
    fullName,
  }
}
