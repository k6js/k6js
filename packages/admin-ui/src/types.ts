/** @jsxRuntime classic */
/** @jsx jsx */

import { ListMeta } from '@keystone-6/core/types';
import { FunctionComponent } from 'react';
import { ItemData } from './utils';

export type ItemPageComponents = {
  ItemPageHeader?: FunctionComponent<{ listKey: string; item: ItemData; label: string }>;
  ItemPageSidebar?: FunctionComponent<{ listKey: string; item: ItemData }>;
  ItemPageActions?: FunctionComponent<{ listKey: string; item: ItemData }>;
};

export type ListPageComponents = {
  ListPageHeader?: FunctionComponent<{ listKey: string }>;
  ListPageActions?: FunctionComponent<{
    listKey: string;
    refetch: () => void;
  }>;
  ListItemsActions?: FunctionComponent<{
    list: ListMeta;
    selectedItems: ReadonlySet<string>;
    refetch: () => void;
  }>;
};
