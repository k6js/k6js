/** @jsxRuntime classic */
/** @jsx jsx */

import { FunctionComponent } from 'react';
import { ItemData } from './utils';

export type ItemPageComponents = {
  Header?: FunctionComponent<{ listKey: string; item: ItemData }>;
  Sidebar?: FunctionComponent<{ listKey: string; item: ItemData }>;
  Actions?: FunctionComponent<{ listKey: string; item: ItemData }>;
};
