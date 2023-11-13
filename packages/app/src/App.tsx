import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Filters } from '#pages/Filters'
import { Home } from '#pages/Home'
import { StockTransferDetails } from '#pages/StockTransferDetails'
import { StockTransfersList } from '#pages/StockTransfersList'
import {
  CoreSdkProvider,
  ErrorBoundary,
  MetaTags,
  PageSkeleton,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)

export function App(): JSX.Element {
  const basePath =
    import.meta.env.PUBLIC_PROJECT_PATH != null
      ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
      : undefined

  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          appSlug='stock_transfers'
          kind='stock_transfers'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          loadingElement={<PageSkeleton />}
          devMode={isDev}
          organizationSlug={import.meta.env.PUBLIC_SELF_HOSTED_SLUG}
        >
          <MetaTags />
          <CoreSdkProvider>
            <Router base={basePath}>
              <Switch>
                <Route path={appRoutes.home.path}>
                  <Home />
                </Route>
                <Route path={appRoutes.list.path}>
                  <StockTransfersList />
                </Route>
                <Route path={appRoutes.filters.path}>
                  <Filters />
                </Route>
                <Route path={appRoutes.details.path}>
                  <StockTransferDetails />
                </Route>
                <Route>
                  <ErrorNotFound />
                </Route>
              </Switch>
            </Router>
          </CoreSdkProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
