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
import Waitlist from './features/waitlist/pages/Waitlist'
import VendorOnboarding from './features/vendors/pages/VendorOnboarding'
import VendorDashboard from './features/vendors/pages/VendorDashboard'
import Marketplace from './features/marketplace/pages/Marketplace'
import VendorProfilePage from './features/marketplace/pages/VendorProfilePage'
import MyBookings from './features/bookings/pages/MyBookings'
import MyEvents from './features/events/pages/MyEvents'
import ProfileEdit from './features/profile/pages/ProfileEdit'
import { storage } from './lib/storage'

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    })

    const hideHeader =
      pathname.startsWith('/signup') || pathname.startsWith('/signin') || pathname.startsWith('/vendor/onboarding') || pathname.startsWith('/waitlist')

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
// Waitlist Route — public route
const waitlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/waitlist',
  component: Waitlist,
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

// Marketplace — public route
const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marketplace',
  component: Marketplace,
})

// Vendor Public Profile — public route with dynamic param
const vendorProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendors/$vendorId',
  component: () => {
    const { vendorId } = vendorProfileRoute.useParams()
    return <VendorProfilePage vendorId={vendorId} />
  },
})

// Bookings — requires authentication
const bookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/bookings',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: MyBookings,
})

// My Events — requires authentication
const myEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/events',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: MyEvents,
})

// Profile Edit — requires authentication
const profileEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/edit',
  beforeLoad: () => {
    if (!storage.isAuthenticated()) {
      throw redirect({ to: '/signup' })
    }
  },
  component: ProfileEdit,
})

// ✅ Route Tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  waitlistRoute,
  vendorOnboardingRoute,
  vendorDashboardRoute,
  marketplaceRoute,
  vendorProfileRoute,
  bookingsRoute,
  myEventsRoute,
  profileEditRoute,
])

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
