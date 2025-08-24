import { type Key, useId, useMemo, useState } from 'react'
import { ButtonGroup, Button } from '@keystar/ui/button'
import { Dialog, useDialogContainer } from '@keystar/ui/dialog'
import { ComboboxMulti, Item } from '@keystar/ui/combobox'
import { Box, VStack } from '@keystar/ui/layout'
import { Content } from '@keystar/ui/slots'
import { Heading } from '@keystar/ui/typography'
import { toastQueue } from '@keystar/ui/toast'

import { useList } from '@keystone-6/core/admin-ui/context'

import { Fields } from '../utils/Fields'
import { useUpdateBuildItem } from '../utils/useUpdateItems'
import { TagGroup } from '@keystar/ui/tag'
import { gql, useMutation } from '@keystone-6/core/admin-ui/apollo'
import { GraphQLErrorNotice } from './GraphQLErrorNotice'

export function UpdateItemDialog({
  listKey,
  items,
  refetch,
}: {
  listKey: string
  items: Set<Key>
  refetch: () => void
}) {
  let isSuccess = true
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['____________________'])
  const [search, setSearch] = useState('')
  const list = useList(listKey)
  const [updateMany, { loading, error }] = useMutation(
    useMemo(
      () =>
        gql`
          mutation($data: [${list.graphql.names.updateManyInputName}!]!) {
            ${list.graphql.names.updateManyMutationName}(data: $data) {
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
    const { data, errors } = await updateMany({
      variables: { data: [...items].map(id => ({ where: { id }, data: subItem })) },
    })
    /*
      Data returns an array where successful deletions are item objects
      and unsuccessful deletions are null values.
      Run a reduce to count success and failure as well as
      to generate the success message to be passed to the success toast
     */
    const { successfulItems, unsuccessfulItems } = data[
      list.graphql.names.updateManyMutationName
    ].reduce(
      (
        acc: {
          successfulItems: number
          unsuccessfulItems: number
          successMessage: string
        },
        curr: any
      ) => {
        if (curr) {
          acc.successfulItems++
          acc.successMessage =
            acc.successMessage === ''
              ? (acc.successMessage += curr[list.labelField])
              : (acc.successMessage += `, ${curr[list.labelField]}`)
        } else {
          acc.unsuccessfulItems++
        }
        return acc
      },
      { successfulItems: 0, unsuccessfulItems: 0, successMessage: '' } as {
        successfulItems: number
        unsuccessfulItems: number
        successMessage: string
      }
    )

    // if there are errors
    if (errors?.length) {
      // find out how many items failed to delete.
      // reduce error messages down to unique instances, and append to the toast as a message.
      toastQueue.critical(
        `Unable to update ${unsuccessfulItems} item${unsuccessfulItems === 1 ? '' : 's'}.`,
        {
          timeout: 5000,
        }
      )
      isSuccess = false
    }

    if (successfulItems) {
      toastQueue.positive(
        `Updated ${successfulItems} ${successfulItems === 1 ? list.singular : list.plural}.`,
        {
          timeout: 5000,
        }
      )
    }

    return isSuccess
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
