/** @jsxRuntime classic */
/** @jsx jsx */
'use client'

import { jsx } from '@keystone-ui/core'
import { ItemPage } from '@k6js/admin-ui/pages/ItemPage'
import { type ItemPageComponents } from '@k6js/admin-ui'

const components: ItemPageComponents = {
  ItemPageHeader: ({ item }) => <div>Page Header Custom - {item?.id}</div>,
  ItemPageSidebar: ({ item }) => <div>Page sidebar Custom - {item?.id}</div>,
}

export default ({ params }) => ItemPage({ params: { ...params, listKey: 'posts' }, components })
