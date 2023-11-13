import { presets, type ListType } from '#data/lists'
import { useTokenProvider } from '@commercelayer/app-elements'

import type { FormFullValues } from '@commercelayer/app-elements/dist/ui/resources/useResourceFilters/types'
import castArray from 'lodash/castArray'
import useSWR, { type SWRResponse } from 'swr'
import { metricsApiFetcher } from './fetcher'
import { getLastYearIsoRange } from './utils'

const fetchStockTransfersStats = async ({
  slug,
  accessToken,
  filters
}: {
  slug: string
  accessToken: string
  filters: object
}): Promise<VndApiResponse<MetricsApiStockTransfersStatsData>> =>
  await metricsApiFetcher<MetricsApiStockTransfersStatsData>({
    endpoint: '/stock_transfers/stats',
    slug,
    accessToken,
    body: {
      stats: {
        field: 'stock_transfer.id',
        operator: 'value_count'
      },
      filter: {
        return: {
          ...getLastYearIsoRange(new Date()),
          date_field: 'updated_at',
          ...filters
        }
      }
    }
  })

const fetchAllCounters = async ({
  slug,
  accessToken
}: {
  slug: string
  accessToken: string
}): Promise<{
  on_hold: number
  picking: number
  in_transit: number
}> => {
  function fulfillResult(result?: PromiseSettledResult<number>): number {
    return result?.status === 'fulfilled' ? result.value : 0
  }

  // keep proper order since responses will be assigned for each list in the returned object
  const lists: ListType[] = ['on_hold', 'picking', 'in_transit']

  const allStats = await Promise.allSettled(
    lists.map(async (listType) => {
      return await fetchStockTransfersStats({
        slug,
        accessToken,
        filters: fromFormValuesToMetricsApi(presets[listType])
      }).then((r) => r.data.value)
    })
  )

  return {
    on_hold: fulfillResult(allStats[0]),
    picking: fulfillResult(allStats[1]),
    in_transit: fulfillResult(allStats[2])
  }
}

export function useListCounters(): SWRResponse<{
  on_hold: number
  picking: number
  in_transit: number
}> {
  const {
    settings: { accessToken, organizationSlug }
  } = useTokenProvider()

  const swrResponse = useSWR(
    {
      slug: organizationSlug,
      accessToken
    },
    fetchAllCounters,
    {
      revalidateOnFocus: false
    }
  )

  return swrResponse
}

/**
 * Covert FilterFormValues in Metrics API filter object.
 * Partial implementation: it only supports status, payment_status and fulfillment_status
 */
function fromFormValuesToMetricsApi(formValues: FormFullValues): object {
  return {
    statuses:
      formValues.status_in != null && castArray(formValues.status_in).length > 0
        ? {
            in: formValues.status_in
          }
        : undefined
  }
}
