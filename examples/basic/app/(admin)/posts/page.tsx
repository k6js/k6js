'use client'
import { CreateButtonLink, type ListPageComponents } from '@k6js/admin-ui'
import { ListPage } from '@k6js/admin-ui/pages/ListPage'
import { Button } from '@keystar/ui/button'
import { HStack } from '@keystar/ui/layout'
import { AlertDialog, DialogContainer } from '@keystar/ui/dialog'
import { useList } from '@keystone-6/core/admin-ui/context'
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon'

import { Fragment, useState } from 'react'

const components: ListPageComponents = {
  ListPageHeader: ({ listKey, showCreate }) => {
    const list = useList(listKey)
    return (
      <HStack width={'100%'} justifyContent="space-between">
        <span>List Header Custom - {listKey}</span>
        {showCreate && (
          <CreateButtonLink
            list={list}
          >{`New ${list.singular.toLocaleLowerCase()}`}</CreateButtonLink>
        )}
      </HStack>
    )
  },
  ListPageActions: [
    {
      key: 'action1',
      label: 'Action 1',
      // icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 1111', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <DialogContainer
            onDismiss={() => {
              console.log('Dialog dismissed')
              onComplete?.()
            }}
          >
            <AlertDialog
              title="Delete items"
              cancelLabel="Cancel"
              primaryActionLabel="Yes, delete"
              onPrimaryAction={() => {
                console.log('Items deleted')
                onComplete?.()
              }}
              tone="critical"
            >
              Are you sure? This will permanently delete item.
            </AlertDialog>
          </DialogContainer>
        )
      },
    },
    {
      key: 'action2',
      label: 'Action 2',
      icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 2222', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <Button
            tone="accent"
            onPress={() => {
              console.log('Action 2222 Button pressed')
              onComplete?.()
            }}
          >
            Action 2
          </Button>
        )
      },
    },
    {
      key: 'action3',
      label: 'Action 3',
      icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 3333', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <Button
            tone="critical"
            onPress={() => {
              console.log('Action 3333 Button pressed')
              onComplete?.()
            }}
          >
            Action 3
          </Button>
        )
      },
    },
    {
      key: 'action4',
      label: 'Action 4',
      icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 4444', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <Button
            tone="neutral"
            onPress={() => {
              console.log('Action 4444 Button pressed')
              onComplete?.()
            }}
          >
            Action 4
          </Button>
        )
      },
    },
    {
      key: 'action5',
      label: 'Action 5',
      icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 5555', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <Button
            tone="accent"
            onPress={() => {
              console.log('Action 5555 Button pressed')
              onComplete?.()
            }}
          >
            Action 5
          </Button>
        )
      },
    },
    {
      key: 'action6',
      label: 'Action 6',
      icon: pencilIcon,
      onAction: (list, refetch) => {
        console.log('Action 6666', list, refetch)
      },
      Component({ isActive, list, refetch, onComplete }) {
        if (!isActive) return null
        return (
          <Button
            tone="accent"
            onPress={() => {
              console.log('Action 6666 Button pressed')
              onComplete?.()
            }}
          >
            Action 6
          </Button>
        )
      },
    },
  ],
  ListItemsActions: [
    {
      key: 'delete',
      label: 'Action 1',
      icon: 'cableCarIcon',
      onAction: (idsForAction, list, refetch) => {
        console.log('delete1', idsForAction, list, refetch)
      },
      Component: ({ list, refetch, selectedItemIds, isActive, onClear }) => {
        if (!isActive) return null
        return (
          <DialogContainer
            onDismiss={() => {
              onClear?.()
            }}
          >
            {selectedItemIds && (
              <AlertDialog
                title="Delete items"
                cancelLabel="Cancel"
                primaryActionLabel="Yes, delete"
                onPrimaryAction={() => {
                  console.log('Items deleted')
                  onClear?.()
                }}
                tone="critical"
              >
                Are you sure? This will permanently delete {selectedItemIds.length} item
                {selectedItemIds.length === 1 ? '' : 's'}.
              </AlertDialog>
            )}
          </DialogContainer>
        )
      },
    },
    {
      key: 'action2',
      label: 'Action 2',
      icon: 'trash2Icon',
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
}

export default () => ListPage({ listKey: 'posts', components })
