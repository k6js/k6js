import type { MaybePromise, ListMeta, ActionMeta } from '@keystone-6/core/types'
import type { ActionErrorResult } from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ListPage'

export type ItemData = Record<string, unknown> | null | undefined

export type ItemPageComponents = {
  ItemPageHeader?: (props: {
    list: ListMeta
    item: ItemData
    loading: boolean
    label: string
    title: string
    actions: ActionMeta[],
    onAction: ((action: ActionMeta, resultId: string) => void) | null
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

export type ListItemsActionType = NonNullable<ListPageComponents['ListItemsActions']>[number]
export type ListPageComponents = {
  hideUpdate?: boolean
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
    icon?: string
    onAction: (
      selectedItemIds: string[],
      list: ListMeta,
      refetch: () => void,
      onClear: () => void,
      onErrors: (result: ActionErrorResult) => void
    ) => MaybePromise<void>
    Component?: (props: {
      selectedItemIds: string[]
      list: ListMeta
      refetch: () => void
      onClear: () => void
      onErrors: (result: ActionErrorResult) => void
      isActive: boolean
    }) => React.JSX.Element
  }[]
}
