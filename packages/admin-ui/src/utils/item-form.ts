import type { GraphQLError } from 'graphql'
import { useMemo } from 'react'
import isDeepEqual from 'fast-deep-equal'
import type { FieldMeta } from '@keystone-6/core/types'
import { type ItemData, deserializeValue, serializeValueToObjByFieldKey } from './serialization'
import type { DataGetter } from './dataGetter'

export type Value = Record<
  string,
  | { kind: 'error'; errors: readonly [GraphQLError, ...GraphQLError[]] }
  | { kind: 'value'; value: any }
>

export function useChangedFieldsAndDataForUpdate(
  fields: Record<string, FieldMeta>,
  itemGetter: DataGetter<ItemData>,
  value: Value
) {
  const serializedValuesFromItem = useMemo(() => {
    const value = deserializeValue(fields, itemGetter)
    return serializeValueToObjByFieldKey(fields, value)
  }, [fields, itemGetter])
  const serializedFieldValues = useMemo(() => {
    return serializeValueToObjByFieldKey(fields, value)
  }, [value, fields])

  return useMemo(() => {
    const changedFields = new Set<string>()
    Object.keys(serializedFieldValues).forEach(fieldKey => {
      let isEqual = isDeepEqual(serializedFieldValues[fieldKey], serializedValuesFromItem[fieldKey])
      if (!isEqual) {
        changedFields.add(fieldKey)
      }
    })

    const dataForUpdate: Record<string, any> = {}
    changedFields.forEach(fieldKey => {
      Object.assign(dataForUpdate, serializedFieldValues[fieldKey])
    })

    Object.keys(serializedFieldValues)
      .filter(fieldKey => fields[fieldKey].graphql.isNonNull?.includes('update'))
      .filter(fieldKey => !changedFields.has(fieldKey))
      .forEach(fieldKey => {
        Object.assign(dataForUpdate, serializedFieldValues[fieldKey])
      })

    return { changedFields: changedFields as ReadonlySet<string>, dataForUpdate }
  }, [serializedFieldValues, serializedValuesFromItem, fields])
}
