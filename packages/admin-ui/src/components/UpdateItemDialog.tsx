import { useId, useMemo, useState } from 'react'
import { ButtonGroup, Button } from '@keystar/ui/button'
import { Dialog, useDialogContainer } from '@keystar/ui/dialog'
import { ComboboxMulti, Item } from '@keystar/ui/combobox'
import { Box, VStack } from '@keystar/ui/layout'
import { Content } from '@keystar/ui/slots'
import { Heading } from '@keystar/ui/typography'
import { toastQueue } from '@keystar/ui/toast'
import { TagGroup } from '@keystar/ui/tag'

import { useList } from '@keystone-6/core/admin-ui/context'
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo'
import { GraphQLErrorNotice } from '@keystone-6/core/admin-ui/components'
import { Fields } from '@keystone-6/core/admin-ui/utils'
import type {
  ActionErrorResult,
  ActionErrors,
} from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/pages/ListPage'
import type { ActionMeta } from '@keystone-6/core/types'

import { useUpdateBuildItem } from '../utils/useUpdateItems'

export function UpdateItemDialog({
  listKey,
  itemIds,
  refetch,
  onErrors,
  action,
}: {
  listKey: string
  itemIds: string[]
  refetch: () => void
  action: ActionMeta
  onErrors: (result: ActionErrorResult) => void
}) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['____________________'])
  const [search, setSearch] = useState('')
  const list = useList(listKey)
  const [updateMany, { loading, error }] = useMutation<{ results?: ({ id: string } | null)[] }>(
    useMemo(
      () =>
        gql`
          mutation($data: [${list.graphql.names.updateManyInputName}!]!) {
            results: ${list.graphql.names.updateManyMutationName}(data: $data) {
              id
              ${list.labelField}
            }
          }
  `,
      [list]
    ),
    { errorPolicy: 'all' }
  )

  const onUpdate = async (subItem: Record<string, unknown>) => {
    try {
      const { errors } = await updateMany({
        variables: { data: [...itemIds].map(id => ({ where: { id }, data: subItem })) },
      })
      const countFail = errors?.length ?? 0
      const countSuccess = itemIds.length - countFail
      const failed = new Set<string>()
      const actionErrors: ActionErrors = {}
      for (const error of errors ?? []) {
        const i = error.path?.[1]
        if (typeof i !== 'number') continue
        const itemId = itemIds[i]

        failed.add(itemId)
        actionErrors[itemId] ??= []
        actionErrors[itemId].push(error)
      }

      if (countFail) {
        toastQueue.critical(`Could not update ${countFail} item${countFail === 1 ? '' : 's'}.`, {
          actionLabel: 'Details',
          onAction: () => onErrors({ action, errors: actionErrors }),
          shouldCloseOnAction: true,
        })
      }
      if (countSuccess) {
        toastQueue.neutral(`Updated ${countSuccess} item${countSuccess === 1 ? '' : 's'}.`, {
          timeout: 5000,
        })
      }

      return failed.size === 0
    } catch (error) {
      console.error(error)
    }
  }
  const builder = useUpdateBuildItem(list, selectedKeys)
  const dialogState = useDialogContainer()
  const formId = useId()
  const fields = useMemo(
    () =>
      Object.values(list.fields)
        .filter(f => f.key !== 'id')
        .map(field => ({ label: field.label, id: field.key })),
    [list.fields]
  )
  return (
    <Dialog aria-label={`Update ${list.plural}`}>
      <Heading>Update {list.plural}</Heading>
      <Content height="container.small">
        <VStack gap="xsmall">
          <ComboboxMulti
            label="Select fields to update"
            autoFocus={true}
            description="Select fields..."
            items={fields}
            selectedKeys={selectedKeys}
            onSelectionChange={selection => {
              setSelectedKeys([...(selection as Set<string>)])
            }}
            onInputChange={setSearch}
            inputValue={search}
            minWidth="alias.singleLineWidth"
            width="auto"
          >
            {item => <Item key={item.id}>{item.label}</Item>}
          </ComboboxMulti>
          <TagGroup
            aria-label={`selected Fields`}
            items={fields.filter(f => selectedKeys.includes(f.id))}
            maxRows={2}
            onRemove={keys => {
              setSelectedKeys(prev => prev.filter(key => !keys.has(key)))
            }}
            renderEmptyState={() => <></>}
          >
            {item => <Item key={item.id}>{item.label}</Item>}
          </TagGroup>
        </VStack>
        <GraphQLErrorNotice errors={[error?.networkError, ...(error?.graphQLErrors ?? [])]} />
        <form
          id={formId}
          onSubmit={async e => {
            if (e.target !== e.currentTarget) return
            e.preventDefault()
            const subItem = await builder.build()

            if (!subItem) return

            const success = await onUpdate(subItem)
            if (success) dialogState.dismiss()
            await refetch()
          }}
        >
          <Box paddingY="xlarge">
            <Fields
              {...builder.props}
              onChange={loading ? (undefined as any) : builder.props.onChange}
            />
          </Box>
        </form>
      </Content>

      <ButtonGroup>
        <Button onPress={dialogState.dismiss} isDisabled={loading}>
          Cancel
        </Button>
        <Button
          form={formId}
          prominence="high"
          type="submit"
          isPending={loading}
          isDisabled={loading || !builder.props.value || !selectedKeys.length}
        >
          Update
        </Button>
      </ButtonGroup>
    </Dialog>
  )
}
