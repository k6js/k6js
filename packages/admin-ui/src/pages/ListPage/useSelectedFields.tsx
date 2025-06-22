'use client'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import { type ListMeta } from '@keystone-6/core/types'

export function useSelectedFields(list: ListMeta): ReadonlySet<string> {
  const searchparams = useSearchParams()
  const selectedFieldsFromUrl = searchparams.get('fields')
  return useMemo(() => {
    const selectedFieldsArray = selectedFieldsFromUrl
      ? selectedFieldsFromUrl.split(',')
      : list.initialColumns
    const fields = selectedFieldsArray.filter(fieldKey => {
      const field = list.fields[fieldKey]
      if (!field) return false
      return field.listView.fieldMode === 'read'
    })

    return new Set(fields.length === 0 ? [list.labelField] : fields)
  }, [list, selectedFieldsFromUrl])
}
