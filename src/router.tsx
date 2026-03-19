import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from './components/Header'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import SplashCarousel from './components/SplashCarousel'
import Signup from './features/auth/pages/Signup'
import { useRouterState } from '@tanstack/react-router'

// Root Route
const rootRoute = createRootRoute({
  component: () => {
    const pathname = useRouterState({
      select: (state) => state.location.pathname,
    })

    const hideHeader =
      pathname.startsWith('/signup') || pathname.startsWith('/signin')

    return (
      <>
        {!hideHeader && <Header />}
        <Outlet />
      </>
    )
  },
})

// Home Route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashCarousel,
})

// ✅ Login Route
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
})

// ✅ Route Tree
const routeTree = rootRoute.addChildren([indexRoute, loginRoute])

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
