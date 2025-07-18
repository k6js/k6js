import { useRouter } from 'next/navigation'
import { type ComponentProps, useEffect, useMemo, useRef, useState } from 'react'

import { toastQueue } from '@keystar/ui/toast'

import type { ListMeta } from '@keystone-6/core/types'
import { type ApolloError, gql, useMutation } from '@keystone-6/core/admin-ui/apollo'
import {
  makeDefaultValueState,
  serializeValueToOperationItem,
  useHasChanges,
  useInvalidFields,
} from '@keystone-6/core/admin-ui/utils'
import { useKeystone } from '@keystone-6/core/admin-ui/context'

import { usePreventNavigation } from './usePreventNavigation'
import type { Fields } from '.'

type UpdateItemsHookResult = {
  state: 'editing' | 'loading' | 'updated'
  shouldPreventNavigation: boolean
  error?: ApolloError
  props: ComponentProps<typeof Fields>
  create: () => Promise<{ id: string; label: string | null } | undefined>
}

export function useUpdateItems(list: ListMeta): UpdateItemsHookResult {
  const router = useRouter()
  const { adminPath } = useKeystone()
  const [tryCreateItem, { loading, error, data: returnedData }] = useMutation(
    gql`mutation($data: ${list.graphql.names.createInputName}!) {
      item: ${list.graphql.names.createMutationName}(data: $data) {
        id
        label: ${list.labelField}
      }
    }`
  )

  const isRequireds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(list.fields).map(([key, field]) => [key, field.createView.isRequired])
      ),
    [list.fields]
  )

  const [forceValidation, setForceValidation] = useState(false)
  const [value, setValue] = useState(() => makeDefaultValueState(list.fields))
  const invalidFields = useInvalidFields(list.fields, value, isRequireds)

  const hasChangedFields = useHasChanges(
    'create',
    list.fields,
    value,
    makeDefaultValueState(list.fields)
  )
  const shouldPreventNavigation = !returnedData?.item && hasChangedFields
  const shouldPreventNavigationRef = useRef(shouldPreventNavigation)

  useEffect(() => {
    shouldPreventNavigationRef.current = shouldPreventNavigation
  }, [shouldPreventNavigation])
  usePreventNavigation(shouldPreventNavigationRef)

  return {
    state: loading ? 'loading' : !returnedData?.item ? 'updated' : 'editing',
    shouldPreventNavigation,
    error,
    props: {
      view: 'createView',
      position: 'form',
      fields: list.fields,
      groups: list.groups,
      forceValidation,
      invalidFields,
      value,
      isRequireds,
      onChange: newItemValue => setValue(newItemValue),
    },
    async create(): Promise<{ id: string; label: string | null } | undefined> {
      const newForceValidation = invalidFields.size !== 0
      setForceValidation(newForceValidation)

      if (newForceValidation) return

      let outputData: { item: { id: string; label: string | null } }
      try {
        outputData = await tryCreateItem({
          variables: {
            data: serializeValueToOperationItem('create', list.fields, value),
          },
          update(cache, { data }) {
            if (typeof data?.item?.id === 'string') {
              cache.evict({
                id: 'ROOT_QUERY',
                fieldName: `${list.graphql.names.itemQueryName}(${JSON.stringify({
                  where: { id: data.item.id },
                })})`,
              })
            }
          },
        }).then(x => x.data)
      } catch {
        // TODO: what about `error` returned from the mutation? do we need
        // to handle that too, should they be combined? does this code path
        // even happen?
        toastQueue.critical(`Unable to create ${list.singular.toLocaleLowerCase()}`)
        return
      }

      shouldPreventNavigationRef.current = false
      toastQueue.positive(`${list.singular} created`, {
        timeout: 5000,
        actionLabel: 'Create another',
        onAction: () => {
          router.push(`${adminPath}/${list.path}/create`)
        },
        shouldCloseOnAction: true,
      })

      return outputData.item
    },
  }
}

type BuildItemHookResult = {
  state: 'editing'
  error?: ApolloError
  props: ComponentProps<typeof Fields>
  build: () => Promise<Record<string, unknown> | undefined>
}

export function useUpdateBuildItem(list: ListMeta, fieldKeys: string[] = []): BuildItemHookResult {
  const [forceValidation, setForceValidation] = useState(false)
  const fields = fieldKeys.length
    ? Object.fromEntries(Object.entries(list.fields).filter(([key]) => fieldKeys.includes(key)))
    : list.fields
  const [value, setValue] = useState(() => makeDefaultValueState(list.fields))

  const isRequireds = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(list.fields).map(([key, field]) => [key, field.itemView.isRequired])
      ),
    [list.fields]
  )

  const invalidFields = useInvalidFields(fields, value, isRequireds)
  return {
    state: 'editing',
    props: {
      view: 'itemView',
      position: 'form',
      fields,
      groups: list.groups,
      forceValidation,
      invalidFields,
      value,
      isRequireds,
      onChange: newItemValue => {
        setValue(newItemValue)
      },
    },
    async build() {
      const newForceValidation = invalidFields.size !== 0
      setForceValidation(newForceValidation)
      if (newForceValidation) return
      return Object.values(fields).reduce((acc, field) => {
        const fieldValue = value[field.path]
        const fieldValueSerialized = field.controller.serialize(fieldValue)
        Object.assign(acc, fieldValueSerialized)
        return acc
      }, {}) as Record<string, unknown>
    },
  }
}
