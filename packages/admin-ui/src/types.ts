/** @jsxRuntime classic */
/** @jsx jsx */

import { ListMeta } from '@keystone-6/core/types';
import { FunctionComponent } from 'react';
import { ItemData } from './utils';

export type ItemPageComponents = {
  Header?: FunctionComponent<{ listKey: string; item: ItemData; label: string }>;
  Sidebar?: FunctionComponent<{ listKey: string; item: ItemData }>;
  Actions?: FunctionComponent<{ listKey: string; item: ItemData }>;
};

export type ListPageComponents = {
  Header?: FunctionComponent<{ listKey: string }>;
  Actions?: FunctionComponent<{
    listKey: string;
    refetch: () => void;
  }>;
  SelectionActions?: FunctionComponent<{
    list: ListMeta;
    selectedItems: ReadonlySet<string>;
    refetch: () => void;
  }>;
};
