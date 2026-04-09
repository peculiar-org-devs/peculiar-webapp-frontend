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
import { waitlistLayout } from './components/waitlistLayout'
import { HowItWorks }  from './features/navlinks/platform/pages/howItWorks'
import { ForClients } from './features/navlinks/platform/pages/forClients'
import { ForVendors } from './features/navlinks/platform/pages/forVendors'
import { Privacy } from './features/navlinks/platform/pages/privacy'
import { storage } from './lib/storage'

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    })

    const hideHeader =
      pathname.startsWith('/signup') || 
      pathname.startsWith('/signin') || 
      pathname.startsWith('/vendor/onboarding') || 
      pathname.startsWith('/waitlist') ||
      pathname.startsWith('/platform')

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


// Waitlist Route — public route
const waitlistLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'waitlist-layout',
  component: waitlistLayout
})


const waitlistRoute = createRoute({
  getParentRoute: () => waitlistLayoutRoute,
  path: '/waitlist',
  component: Waitlist,
})

// Nav - Platform links
const howItWorksRoute = createRoute({
  getParentRoute: () => waitlistLayoutRoute,
  path: '/platform/how-it-works',
  component: HowItWorks,
})

const forVendorsRoute = createRoute({
  getParentRoute: () => waitlistLayoutRoute,
  path: '/platform/for-vendors',
  component: ForVendors
})

const forClientsRoute = createRoute({
  getParentRoute: () => waitlistLayoutRoute,
  path: '/platform/for-clients',
  component: ForClients
})

const privacyRoute = createRoute({
  getParentRoute: () => waitlistLayoutRoute,
  path: '/platform/privacy',
  component: Privacy,
})


// ✅ Route Tree

const waitlistLayoutTree = waitlistLayoutRoute.addChildren([
  howItWorksRoute,
  forVendorsRoute,
  forClientsRoute,
  waitlistRoute,
  privacyRoute
])

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  vendorOnboardingRoute,
  vendorDashboardRoute,
  marketplaceRoute,
  vendorProfileRoute,
  bookingsRoute,
  myEventsRoute,
  profileEditRoute,
  waitlistLayoutTree
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
