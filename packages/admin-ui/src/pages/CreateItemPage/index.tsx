/** @jsxRuntime classic */
/** @jsx jsx */
'use client'

import { Box, jsx } from '@keystone-ui/core'
import { LoadingDots } from '@keystone-ui/loading'
import { Button } from '@keystone-ui/button'
import { useRouter } from 'next/router'
import { type ListMeta } from '@keystone-6/core/types'
import { useKeystone, useList } from '@keystone-6/core/admin-ui/context'
import { Fields } from '../../utils'
import { PageContainer } from '../../components/PageContainer'
import { GraphQLErrorNotice } from '../../components'
import { useCreateItem } from '../../utils/useCreateItem'
import { BaseToolbar, ColumnLayout, ItemPageHeader } from '../ItemPage/common'

function CreatePageForm (props: { list: ListMeta }) {
  const createItem = useCreateItem(props.list)
  const router = useRouter()
  const { adminPath } = useKeystone()
  return (
    <Box paddingTop="xlarge">
      {createItem.error && (
        <GraphQLErrorNotice
          networkError={createItem.error?.networkError}
          errors={createItem.error?.graphQLErrors}
        />
      )}

      <Fields {...createItem.props} />
      <BaseToolbar>
        <Button
          isLoading={createItem.state === 'loading'}
          weight="bold"
          tone="active"
          onClick={async () => {
            const item = await createItem.create()
            if (item) {
              router.push(`${adminPath}/${props.list.path}/${item.id}`)
            }
          }}
        >
          Create {props.list.singular}
        </Button>
      </BaseToolbar>
    </Box>
  )
}

type CreateItemPageProps = { params: { listKey: string } }

export function CreateItemPage ({ params }: CreateItemPageProps) {
  const { createViewFieldModes, listsKeyByPath } = useKeystone()
  const list = useList(listsKeyByPath[params.listKey])

  return (
    <PageContainer
      title={`Create ${list.singular}`}
      header={<ItemPageHeader list={list} label="Create" />}
    >
      <ColumnLayout>
        <Box>
          {createViewFieldModes.state === 'error' && (
            <GraphQLErrorNotice
              networkError={
                createViewFieldModes.error instanceof Error ? createViewFieldModes.error : undefined
              }
              errors={
                createViewFieldModes.error instanceof Error ? undefined : createViewFieldModes.error
              }
            />
          )}
          {createViewFieldModes.state === 'loading' && <LoadingDots label="Loading create form" />}
          <CreatePageForm list={list} />
        </Box>
      </ColumnLayout>
    </PageContainer>
  )
}
