import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  useRouterState,
} from '@tanstack/react-router'
import Header from './components/Header'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import SplashCarousel from './components/SplashCarousel'
import Signup from './features/auth/pages/Signup'
import VendorOnboarding from './features/vendors/pages/VendorOnboarding'
import VendorDashboard from './features/vendors/pages/VendorDashboard'
import { storage } from './lib/storage'

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    })

    const hideHeader =
      pathname.startsWith('/signup') || pathname.startsWith('/signin') || pathname.startsWith('/vendor/onboarding')

    return (
      <>
        {!hideHeader && <Header />}
        <Outlet />
      </>
    )
  },
})

// Home Route — requires authentication
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: SplashCarousel,
})

// ✅ Signup Route — only for unauthenticated users
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  beforeLoad: () => {
    if (storage.isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: Signup,
})

// Vendor Onboarding — requires authentication
const vendorOnboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor/onboarding',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: VendorOnboarding,
})

// Vendor Dashboard — requires authentication
const vendorDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor/dashboard',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: VendorDashboard,
})

// ✅ Route Tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute, vendorOnboardingRoute, vendorDashboardRoute])

// React Query Context
const TanStackQueryProviderContext = TanStackQueryProvider.getContext()

// Router
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Type Safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router, TanStackQueryProviderContext }
