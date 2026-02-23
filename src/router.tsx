import { Outlet, createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from './components/Header'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import SplashCarousel from './components/SplashCarousel'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashCarousel,
})


const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const routeTree = rootRoute.addChildren([indexRoute])
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


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router, TanStackQueryProviderContext }
