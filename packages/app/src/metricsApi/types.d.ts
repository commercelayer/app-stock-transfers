interface MetricsApiStockTransfersStatsData {
  value: number
}

interface VndApiResponse<Data> {
  data: Data
  meta: {
    pagination: {
      record_count: number
      cursor: string | null
    }
  }
}
