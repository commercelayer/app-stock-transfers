import { instructions } from '#data/filters'
import { presets } from '#data/lists'
import { appRoutes } from '#data/routes'
import { useHomeCounter } from '#hooks/useHomeCounter'
import {
  Icon,
  List,
  ListItem,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  StatusIcon,
  Text,
  useResourceFilters,
  useTokenProvider
} from '@commercelayer/app-elements'
import { Link, useLocation } from 'wouter'
import { useSearch } from 'wouter/use-location'

export function Home(): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()

  const [, setLocation] = useLocation()
  const search = useSearch()

  const { adapters, SearchWithNav } = useResourceFilters({
    instructions
  })

  const { data: counterPicking, isLoading: isLoadingPicking } =
    useHomeCounter('picking')

  const { data: counterInTransit, isLoading: isLoadingIntransit } =
    useHomeCounter('in_transit')

  const { data: counterOnHold, isLoading: isLoadingOnHold } =
    useHomeCounter('on_hold')

  const isLoadingCounters =
    isLoadingPicking || isLoadingIntransit || isLoadingOnHold

  return (
    <PageLayout
      title='Stock transfers'
      mode={mode}
      gap='only-top'
      navigationButton={{
        onClick: () => {
          window.location.href =
            dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
        },
        label: 'Hub',
        icon: 'arrowLeft'
      }}
    >
      <SearchWithNav
        hideFiltersNav
        onFilterClick={() => {}}
        onUpdate={(qs) => {
          setLocation(appRoutes.list.makePath(qs))
        }}
        queryString={search}
      />

      <SkeletonTemplate isLoading={isLoadingCounters}>
        <Spacer bottom='14'>
          <List title='Open'>
            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.picking
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <StatusIcon name='check' background='orange' gap='small' />
                }
              >
                <Text weight='semibold'>
                  {presets.picking.viewTitle}{' '}
                  {formatCounter(counterPicking?.meta.recordCount)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.in_transit
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <StatusIcon
                    name='arrowUpRight'
                    background='orange'
                    gap='small'
                  />
                }
              >
                <Text weight='semibold'>
                  {presets.in_transit.viewTitle}{' '}
                  {formatCounter(counterInTransit?.meta.recordCount)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.on_hold
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <StatusIcon
                    name='chatCircle'
                    background='orange'
                    gap='small'
                  />
                }
              >
                <Text weight='semibold'>
                  {presets.on_hold.viewTitle}{' '}
                  {formatCounter(counterOnHold?.meta.recordCount)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
          </List>
        </Spacer>

        <Spacer bottom='14'>
          <List title='Browse'>
            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.history
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <StatusIcon name='asterisk' background='black' gap='small' />
                }
              >
                <Text weight='semibold'>{presets.history.viewTitle}</Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
          </List>
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}

function formatCounter(counter = 0): string {
  return `(${Intl.NumberFormat().format(counter)})`
}
