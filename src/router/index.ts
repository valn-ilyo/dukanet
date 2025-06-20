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
          component: () => import('@/layouts/BusinessCreateProfileLayout.vue'),
          children: [
            { path: '', redirect: { name: 'Step 1' } },
            {
              path: 'step-1',
              name: 'Step 1',
              component: () => import('@/views/CreateProfileStep1View.vue'),
              meta: {
                progress: 25,
                nextRoute: { name: 'Step 2' },
                prevRoute: { name: 'home' },
              },
            },
            {
              path: 'step-2',
              name: 'Step 2',
              component: () => import('@/views/CreateProfileStep2View.vue'),
              meta: {
                progress: 50,
                prevRoute: { name: 'Step 1' },
                nextRoute: { name: 'Step 3' },
              },
            },
            {
              path: 'step-3',
              name: 'Step 3',
              component: () => import('@/views/CreateProfileStep3View.vue'),
              meta: {
                progress: 75,
                prevRoute: { name: 'Step 2' },
                nextRoute: { name: 'Step 4' },
              },
            },
            {
              path: 'step-4',
              name: 'Step 4',
              component: () => import('@/views/CreateProfileStep4View.vue'),
              meta: {
                progress: 100,
                prevRoute: { name: 'Step 3' },
                nextRoute: { name: 'home' },
              },
            },
          ],
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

  if (to.name === 'auth' && isLoggedIn) {
    const fallback = (to.query.next as string) || '/'
    return next(fallback)
  }

  if (to.name === 'geolocation' && hasGeoAccess) {
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
