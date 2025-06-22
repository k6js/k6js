import type { MaybePromise, ListMeta } from '@keystone-6/core/types'
import type { Key } from 'react'
import type { ItemData } from './utils'

export type ItemPageComponents = {
  ItemPageHeader?: (props: {
    list: ListMeta
    item: ItemData
    loading: boolean
    label: string
  }) => React.JSX.Element
  ItemPageSidebar?: (props: {
    list: ListMeta
    item: ItemData
    loading: boolean
    hasChanges?: boolean
  }) => React.JSX.Element
  ItemPageActions?: (props: {
    list: ListMeta
    item: ItemData
    loading: boolean
    hasChanges?: boolean
  }) => React.JSX.Element
}

export type ListPageComponents = {
  ListPageHeader?: (props: { listKey: string; showCreate: boolean }) => React.JSX.Element
  ListPageActions?: {
    key: string
    label: string
    icon?: React.JSX.Element
    onAction: (list: ListMeta, refetch: () => void) => MaybePromise<void>
    Component?: (props: {
      isActive: boolean
      list: ListMeta
      refetch: () => void
      onComplete: () => void
    }) => React.JSX.Element
  }[]
  ListItemsActions?: {
    key: string
    label: string
    icon?: React.JSX.Element
    onAction: (
      selectedItems: Set<Key> | null,
      list: ListMeta,
      refetch: () => void,
      onClear: () => void
    ) => MaybePromise<void>
    Component?: (props: {
      selectedItems: Set<Key> | null
      list: ListMeta
      refetch: () => void
      onClear: () => void
      isActive: boolean
    }) => React.JSX.Element
  }[]
}
