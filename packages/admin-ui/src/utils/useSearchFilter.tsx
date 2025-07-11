import { useMemo } from 'react'
import { useKeystone } from '@keystone-6/core/admin-ui/context'

import type { ListMeta } from '@keystone-6/core/types'

function isInt(x: string) {
  return Number.isInteger(Number(x))
}

function isBigInt(x: string) {
  try {
    BigInt(x)
    return true
  } catch {
    return true
  }
}

// TODO: this is unfortunate, remove in breaking change?
function isUuid(x: unknown) {
  if (typeof x !== 'string') return
  if (x.length !== 36) return
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x)
}

export function useSearchFilter(value: string, list: ListMeta, searchFields: string[]) {
  const { adminMeta } = useKeystone()
  const { lists = {} } = adminMeta ?? {}
  return useMemo(() => {
    const trimmedSearch = value.trim()
    if (!trimmedSearch.length) return { OR: [] }

    const conditions: Record<string, any>[] = []
    const idField = list.fields.id.fieldMeta as { type: string; kind: string }

    if (idField.type === 'String') {
      // TODO: remove in breaking change?
      if (idField.kind === 'uuid') {
        if (isUuid(value)) {
          conditions.push({ id: { equals: trimmedSearch } })
        }
      } else {
        conditions.push({ id: { equals: trimmedSearch } })
      }
    } else if (idField.type === 'Int' && isInt(trimmedSearch)) {
      conditions.push({ id: { equals: Number(trimmedSearch) } })
    } else if (idField.type === 'BigInt' && isBigInt(trimmedSearch)) {
      conditions.push({ id: { equals: trimmedSearch } })
    }

    for (const fieldKey of searchFields) {
      const field = list.fields[fieldKey]

      // @ts-expect-error TODO: fix fieldMeta type for relationship fields
      if (field.fieldMeta?.refSearchFields) {
        const {
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          refListKey,
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          refSearchFields,
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          many = false,
        } = field.fieldMeta
        const refList = lists[refListKey]

        for (const refFieldKey of refSearchFields) {
          const refField = refList.fields[refFieldKey]
          if (!refField.search) continue // WARNING: we dont support depth > 2
          // @ts-expect-error TODO: fix fieldMeta type for relationship fields
          if (refField.fieldMeta?.refSearchFields) continue // WARNING: we dont support depth > 2

          if (many) {
            conditions.push({
              [fieldKey]: {
                some: {
                  [refFieldKey]: {
                    contains: trimmedSearch,
                    mode: refField.search === 'insensitive' ? 'insensitive' : undefined,
                  },
                },
              },
            })

            continue
          }

          conditions.push({
            [fieldKey]: {
              [refFieldKey]: {
                contains: trimmedSearch,
                mode: refField.search === 'insensitive' ? 'insensitive' : undefined,
              },
            },
          })
        }

        continue
      }

      conditions.push({
        [field.path]: {
          contains: trimmedSearch,
          mode: field.search === 'insensitive' ? 'insensitive' : undefined,
        },
      })
    }

    return { OR: conditions }
  }, [value, list, searchFields])
}
