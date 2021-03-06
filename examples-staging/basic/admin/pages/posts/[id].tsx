/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, useTheme } from '@keystone-ui/core';

import {
  getItemPage,
  ItemPageHooksProps,
} from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ItemPage';

// import { gql } from '@keystone-6/core';
import { Fragment } from 'react';
import { useList } from '@keystone-6/core/admin-ui/context';

const hooks: ItemPageHooksProps = {
  ItemPageSidebar({ listKey, item }) {
    const { spacing } = useTheme();
    return (
      <Fragment>
        <div
          css={{
            marginTop: spacing.large,
          }}
        >
          <div>{listKey}</div>
          <div>{item?.id}</div>
          <div>{item?.author?.label}</div>
        </div>
      </Fragment>
    );
  },
  ItemPageHeader({ listKey, item }) {
    const list = useList(listKey);
    return (
      <div>
        {listKey} {`>>`} {item?.[list.labelField] || item?.id}
      </div>
    );
  },
};

export default getItemPage({ listKey: 'Post', hooks });
