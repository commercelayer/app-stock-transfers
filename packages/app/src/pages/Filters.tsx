import { instructions } from '#data/filters'
import { appRoutes } from '#data/routes'
import { PageLayout, useResourceFilters } from '@commercelayer/app-elements'
import { useLocation } from 'wouter'

export function Filters(): JSX.Element {
  const [, setLocation] = useLocation()
  const { FiltersForm, adapters } = useResourceFilters({
    instructions
  })

  return (
    <PageLayout
      title='Filters'
      navigationButton={{
        onClick: () => {
          setLocation(
            appRoutes.list.makePath(
              adapters.adaptUrlQueryToUrlQuery({
                queryString: location.search
              })
            )
          )
        },
        label: 'Stock Transfers',
        icon: 'arrowLeft'
      }}
    >
      <FiltersForm
        onSubmit={(filtersQueryString) => {
          setLocation(appRoutes.list.makePath(filtersQueryString))
        }}
      />
    </PageLayout>
  )
}
