import type { MaybePromise, ListMeta } from '@keystone-6/core/types'
import type { FunctionComponent, Key } from 'react'
import type { ItemData } from './utils'

export type ItemPageComponents = {
  ItemPageHeader?: FunctionComponent<{ listKey: string, item: ItemData, label: string }>
  ItemPageSidebar?: FunctionComponent<{ listKey: string, item: ItemData }>
  ItemPageActions?: FunctionComponent<{ listKey: string, item: ItemData }>
}

export type ListPageComponents = {
  ListPageHeader?: FunctionComponent<{ listKey: string, showCreate: boolean }>
  ListPageActions?: FunctionComponent<{
    listKey: string
    refetch: () => void
  }>
  ListItemsActions?: {
    actions: {
      key: string
      label: string
      icon?: React.JSX.Element
      onAction: (selectedItems: Set<Key> | null, list: ListMeta, refetch: () => void, onClear: () => void) => MaybePromise<void>
    }[]
    Component?: (props: {
      list: ListMeta
      refetch: () => void
      selectedItems: Set<Key> | null
      action: Key | null
      onClear: () => void
    }) => React.JSX.Element
  }
}
