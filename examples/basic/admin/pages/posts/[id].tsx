/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core';
import { getItemPage } from '@k6js/admin-ui/pages/ItemPage';
import { ItemPageComponents } from '@k6js/admin-ui';

const components: ItemPageComponents = {
  Header: ({ item }) => <div>Page Header Custom - {item?.id}</div>,
  Sidebar: ({ item }) => <div>Page sidebar Custom - {item?.id}</div>,
};

export default getItemPage({ listKey: 'Post', components });
