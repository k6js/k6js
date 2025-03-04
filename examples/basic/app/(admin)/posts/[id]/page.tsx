'use client'
import { use } from 'react'
import { ItemPage } from '@k6js/admin-ui/pages/ItemPage'
import { type ItemPageComponents } from '@k6js/admin-ui'

const components: ItemPageComponents = {
  ItemPageHeader: ({ item }) => <div>Page Header Custom - {item?.id}</div>,
  ItemPageSidebar: ({ item }) => <div>Page sidebar Custom - {item?.id}</div>,
}

export default ({ params }) => {
  const _params = use<any>(params)
  return ItemPage({ ..._params, listKey: 'posts', components })
}
