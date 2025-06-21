import { createRouter, createWebHashHistory, type RouteLocationNormalized } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { useGeolocationStore } from '@/stores/geolocation'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGeolocation?: boolean
    progress?: number
    nextRoute?: { name: string }
    prevRoute?: { name: string }
  }
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      meta: { requiresAuth: true, requiresGeolocation: true },
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
      ],
    },
    {
      path: '/business',
      component: () => import('@/layouts/BusinessLayout.vue'),
      meta: { requiresAuth: true, requiresGeolocation: true },
      children: [
        { path: '', redirect: '/business/create-profile' },
        {
          path: 'create-profile',
          component: () => import('@/views/BusinessAddView.vue'),
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      children: [
        {
          path: '',
          name: 'auth',
          component: () => import('@/views/AuthView.vue'),
        },
        {
          path: 'geolocation',
          name: 'geolocation',
          component: () => import('@/views/AuthGeolocationView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/404View.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const geolocationStore = useGeolocationStore()
  const isLoggedIn = !!session
  const hasGeoAccess = geolocationStore.hasGeolocationAccess

  if ((to.name === 'auth' && isLoggedIn) || (to.name === 'geolocation' && hasGeoAccess)) {
    const fallback = (to.query.next as string) || '/'
    return next(fallback)
  }

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next({ name: 'auth', query: { next: to.fullPath } })
  }

  if (to.meta.requiresGeolocation && !hasGeoAccess) {
    return next({ name: 'geolocation', query: { next: to.fullPath } })
  }

  return next()
})

export default router
