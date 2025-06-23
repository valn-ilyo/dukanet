import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const hasBusinessProfile = ref<boolean | null>(null)


supabase.auth.getSession().then(async ({ data }) => {
  user.value = data.session?.user ?? null
    if (user.value) await checkIfUserHasBusiness()
})

supabase.auth.onAuthStateChange(async (_event, newSession) => {
  user.value = newSession?.user ?? null
})

async function checkIfUserHasBusiness() {
  const { data, error } = await supabase
  .from('businesses')
  .select('id')
  .eq('id', user.value?.id) 
  .maybeSingle()
  hasBusinessProfile.value = !!data && !error
}


const avatarUrl = computed(() => user.value?.user_metadata?.avatar_url ?? null)
const email = computed(() => user.value?.user_metadata?.email ?? null)
const fullName = computed(() => user.value?.user_metadata?.full_name ?? null)

export function useUserInfo() {
  return {
    avatarUrl,
    email,
    fullName,
    hasBusinessProfile,
    refreshBusinessStatus: checkIfUserHasBusiness
  }
}
