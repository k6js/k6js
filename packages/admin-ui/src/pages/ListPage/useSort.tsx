import { useMemo } from 'react'
import { type ListMeta } from '@keystone-6/core/types'
import { useRouter } from '@keystone-6/core/admin-ui/router'

export function useSort (list: ListMeta, orderableFields: Set<string>) {
  const { query } = useRouter()
  let sortByFromUrl = typeof query.sortBy === 'string' ? query.sortBy : null

  return useMemo(() => {
    if (sortByFromUrl === '') return null
    if (sortByFromUrl === null) return list.initialSort

    if (sortByFromUrl.startsWith('-')) {
      const field = sortByFromUrl.slice(1)
      if (!orderableFields.has(field)) return null

      return {
        field,
        direction: 'DESC' as const
      }
    }

    if (!orderableFields.has(sortByFromUrl)) return null
    return {
      field: sortByFromUrl,
      direction: 'ASC' as const
    }
  }, [sortByFromUrl, list, orderableFields])
}
