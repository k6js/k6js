/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@keystone-ui/core'
import { type ListPageComponents } from '@k6js/admin-ui'
import { getListPage } from '@k6js/admin-ui/pages/ListPage'
import { Button } from '@keystone-ui/button'
import { Fragment } from 'react'

const components: ListPageComponents = {
  ListPageHeader: ({ listKey }) => <div>List Header Custom - {listKey}</div>,
  ListPageActions: ({}) => (
    <Fragment>
      <Button tone="active">Action 1</Button>
      <Button tone="active">Action 2</Button>
      <Button tone="active">Action 3</Button>
      <Button tone="active">Action 4</Button>
      <Button tone="active">Action 5</Button>
      <Button tone="active">Action 6</Button>
      <Button tone="active">Action 7</Button>
      <Button tone="active">Action 8</Button>
      <Button tone="active">Action 9</Button>
      <Button tone="active">Action 10</Button>
      <Button tone="active">Action 11</Button>
      <Button tone="active">Action 12</Button>
      <Button tone="active">Action 13</Button>
      <Button tone="active">Action 14</Button>
      <Button tone="active">Action 15</Button>
      <Button tone="active">Action 16</Button>
      <Button tone="active">Action 17</Button>
      <Button tone="active">Action 18</Button>
      <Button tone="active">Action 19</Button>
      <Button tone="active">Action 20</Button>
    </Fragment>
  ),
  ListItemsActions: ({ list, refetch, selectedItems }) => (
    <Fragment>
      <Button tone="active">Action 1</Button>
      <Button tone="active">Action 2</Button>
      <Button tone="active">Action 3</Button>
      <Button tone="active">Action 4</Button>
      <Button tone="active">Action 5</Button>
      <Button tone="active">Action 6</Button>
      <Button tone="active">Action 7</Button>
      <Button tone="active">Action 8</Button>
      <Button tone="active">Action 9</Button>
      <Button tone="active">Action 10</Button>
      <Button tone="active">Action 11</Button>
      <Button tone="active">Action 12</Button>
      <Button tone="active">Action 13</Button>
      <Button tone="active">Action 14</Button>
      <Button tone="active">Action 15</Button>
      <Button tone="active">Action 16</Button>
      <Button tone="active">Action 17</Button>
      <Button tone="active">Action 18</Button>
      <Button tone="active">Action 19</Button>
      <Button tone="active">Action 20</Button>
    </Fragment>
  ),
}

export default getListPage({ listKey: 'Post', components })
