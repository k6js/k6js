'use client'
import { CreateButtonLink, type ListPageComponents } from '@k6js/admin-ui'
import { ListPage } from '@k6js/admin-ui/pages/ListPage'
import { Button } from '@keystar/ui/button'
import { HStack } from '@keystar/ui/layout'
import { AlertDialog, DialogContainer } from '@keystar/ui/dialog'
import { useKeystone, useList } from '@keystone-6/core/admin-ui/context'
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon'

import { Fragment } from 'react'

const components: ListPageComponents = {
  ListPageHeader: ({ listKey, showCreate }) => {
    const list = useList(listKey)
    return (
      <div>
        <span>List Header Custom - {listKey}</span>
        {showCreate && (
          <CreateButtonLink
            list={list}
          >{`New ${list.singular.toLocaleLowerCase()}`}</CreateButtonLink>
        )}
      </div>
    )
  },
  ListPageActions: ({}) => (
    <HStack wrap={true}>
      <Button prominence="default">Action 1</Button>
      <Button prominence="low">Action 2</Button>
      <Button prominence="high">Action 3</Button>
      <Button prominence="default" tone="neutral">
        Action 4
      </Button>
      <Button prominence="default" tone="accent">
        Action 5
      </Button>
      <Button prominence="default" tone="critical" borderRadius="large">
        Action 6
      </Button>
      <Button prominence="high" tone="neutral" onClick={() => alert('asdasda')}>
        Action 7
      </Button>
      <Button prominence="high">Action 8</Button>
      <Button prominence="high">Action 9</Button>
      <Button prominence="high">Action 10</Button>
      <Button prominence="high">Action 11</Button>
      {/* <Button prominence="high">Action 12</Button>
      <Button prominence="high">Action 13</Button>
      <Button prominence="high">Action 14</Button>
      <Button prominence="high">Action 15</Button>
      <Button prominence="high">Action 16</Button>
      <Button prominence="high">Action 17</Button>
      <Button prominence="high">Action 18</Button>
      <Button prominence="high">Action 19</Button>
      <Button prominence="high">Action 20</Button> */}
    </HStack>
  ),
  // ListItemsActions: {},

  ListItemsActions: {
    actions: [
      {
        key: 'delete',
        label: 'Action 1',
        onAction: (idsForAction, list, refetch) => {
          console.log('sdadsad', idsForAction, list, refetch)
        },
      },
      {
        key: 'action2',
        label: 'Action 2',
        icon: trash2Icon,
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action3',
        label: 'Action 3',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action4',
        label: 'Action 4',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action5',
        label: 'Action 5',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action6',
        label: 'Action 6',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action7',
        label: 'Action 7',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action8',
        label: 'Action 8',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action9',
        label: 'Action 9',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action10',
        label: 'Action 10',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action11',
        label: 'Action 11',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action12',
        label: 'Action 12',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action13',
        label: 'Action 13',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action14',
        label: 'Action 14',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
      {
        key: 'action15',
        label: 'Action 15',
        onAction: (idsForAction, list, refetch) => {
          console.log('2343242', idsForAction, list, refetch)
        },
      },
    ],
    Component: ({ list, refetch, selectedItems, action, onClear }) => {
      console.log('list', list, selectedItems, action)
      return (
        <Fragment>
          {action === 'delete' && (
            <DialogContainer
              onDismiss={() => {
                onClear?.()
              }}
            >
              {selectedItems && (
                <AlertDialog
                  title="Delete items"
                  cancelLabel="Cancel"
                  primaryActionLabel="Yes, delete"
                  onPrimaryAction={onClear}
                  tone="critical"
                >
                  Are you sure? This will permanently delete {selectedItems.size} item
                  {selectedItems.size === 1 ? '' : 's'}.
                </AlertDialog>
              )}
            </DialogContainer>
          )}
          {/* <Button tone="active">Action 1</Button> */}
          {/* <Button tone="active">Action 2</Button>
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
          <Button tone="active">Action 20</Button> */}
        </Fragment>
      )
    },
  },
}

export default () => ListPage({ listKey: 'posts', components })
