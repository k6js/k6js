'use client'
import { use } from 'react'
import { ItemPage } from '@k6js/admin-ui/pages/ItemPage'
import { type ItemPageComponents } from '@k6js/admin-ui'
import { Button } from '@keystar/ui/button'

const components: ItemPageComponents = {
  ItemPageHeader: ({ item }) => <div>Page Header Custom - {item?.id}</div>,
  ItemPageSidebar: ({ item }) => <div>Page sidebar Custom - {item?.id}</div>,
  ItemPageActions: ({ item, loading, hasChanges }) => (
    <Button
      isDisabled={hasChanges}
      isPending={loading}
      prominence="high"
      type="button"
      onClick={() => {
        console.log('Action clicked', item)
      }}
    >
      Action
    </Button>
  ),
}

export default ({ params }) => {
  const _params = use<any>(params)
  return ItemPage({ ..._params, listKey: 'posts', components })
}
