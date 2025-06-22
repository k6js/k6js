import { type Key, Fragment, useEffect, useMemo, useState, use, type Usable } from 'react'

import { ActionBar, ActionBarContainer, Item } from '@keystar/ui/action-bar'
import { ActionButton } from '@keystar/ui/button'
import { AlertDialog, DialogContainer } from '@keystar/ui/dialog'
import { Icon } from '@keystar/ui/icon'
import { textSelectIcon } from '@keystar/ui/icon/icons/textSelectIcon'
import { editIcon } from '@keystar/ui/icon/icons/editIcon'
import { searchXIcon } from '@keystar/ui/icon/icons/searchXIcon'
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon'
import { undo2Icon } from '@keystar/ui/icon/icons/undo2Icon'
import { zapIcon } from '@keystar/ui/icon/icons/zapIcon'
import { HStack, VStack } from '@keystar/ui/layout'
import { SearchField } from '@keystar/ui/search-field'
import { css, tokenSchema } from '@keystar/ui/style'
import {
  type SortDescriptor,
  TableView,
  TableBody,
  TableHeader,
  Column,
  Cell,
  Row,
} from '@keystar/ui/table'
import { toastQueue } from '@keystar/ui/toast'
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip'
import { Heading, Text } from '@keystar/ui/typography'

import type { TypedDocumentNode } from '@keystone-6/core/admin-ui/apollo'
import { gql, useMutation, useQuery } from '@keystone-6/core/admin-ui/apollo'
import { useKeystone, useList } from '@keystone-6/core/admin-ui/context'
import { EmptyState } from '../../components/EmptyState'
import { GraphQLErrorNotice, PageContainer } from '@keystone-6/core/admin-ui/components'
import { CreateButtonLink, ErrorBoundary } from '../../components'
import { type ListPageComponents } from '../../types'
import { FieldSelection } from './FieldSelection'
import { FilterAdd } from './FilterAdd'
import { FilterList } from './FilterList'
import { Pagination, usePaginationParams } from './Pagination'
import { useFilters } from './useFilters'
import { useSearchFilter } from '../../utils/useSearchFilter'
import { useSelectedFields } from './useSelectedFields'
import { useSort } from './useSort'
import { ProgressCircle } from '@keystar/ui/progress'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import type { ListMeta } from '@keystone-6/core/types'
import { UpdateItemDialog } from '../../components/UpdateItemDialog'

type ListPageProps = { listKey: string; components?: ListPageComponents }
type SelectedKeys = 'all' | Set<number | string>

const storeableQueries = ['sortBy', 'fields']

function useQueryParamsFromLocalStorage(listKey: string) {
  const router = useRouter()
  const localStorageKey = `keystone.list.${listKey}.list.page.info`
  const resetToDefaults = () => {
    localStorage.removeItem(localStorageKey)
    router.replace({ pathname: router.pathname })
  }

  useEffect(() => {
    const hasSomeQueryParamsWhichAreAboutListPage = Object.keys(router.query).some(x => {
      return x.startsWith('!') || storeableQueries.includes(x)
    })

    if (!hasSomeQueryParamsWhichAreAboutListPage) {
      const queryParamsFromLocalStorage = localStorage.getItem(localStorageKey)
      let parsed
      try {
        parsed = JSON.parse(queryParamsFromLocalStorage!)
      } catch (err) {}
      if (parsed) {
        router.replace({ query: { ...router.query, ...parsed } })
      }
    }
  }, [localStorageKey])

  useEffect(() => {
    const queryParamsToSerialize: Record<string, string> = {}
    for (const key in router.query) {
      if (key.startsWith('!') || storeableQueries.includes(key)) {
        queryParamsToSerialize[key] = router.query[key] as string
      }
    }
    if (Object.keys(queryParamsToSerialize).length) {
      localStorage.setItem(localStorageKey, JSON.stringify(queryParamsToSerialize))
    } else {
      localStorage.removeItem(localStorageKey)
    }
  }, [localStorageKey, router])

  return { resetToDefaults }
}

function getDefaultFilters(list: ListMeta) {
  const filters = Object.entries(list.initialFilter ?? {}).flatMap(([fieldKey, filter]) => {
    const { controller } = list.fields[fieldKey]
    if (controller.filter && filter) {
      const filters = controller.filter?.parseGraphQL(filter as any as never)
      return filters.map(
        filter => [`!${fieldKey}_${filter.type}`, JSON.stringify(filter.value)] as const
      )
    }
    return []
  })
  return filters
}

export function ListPage(props: ListPageProps) {
  const keystone = useKeystone()
  const listKey = keystone.listsKeyByPath[props.listKey]
  const list = useList(listKey)
  const components = props.components ?? {}
  const { query, push, replace } = useRouter()
  const { resetToDefaults } = useQueryParamsFromLocalStorage(listKey)
  const { currentPage, pageSize } = usePaginationParams({
    defaultPageSize: list.pageSize,
  })
  const sort = useSort(list)
  const filters = useFilters(list)
  const searchParam = typeof query.search === 'string' ? query.search : ''
  const [searchString, setSearchString] = useState(searchParam)
  const search = useSearchFilter(searchParam, list, list.initialSearchFields)

  useEffect(() => {
    if (!filters.filters.length) {
      const filters = getDefaultFilters(list)
      if (!filters.length) return
      replace({
        query: {
          ...query,
          ...Object.fromEntries(filters),
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  const selectedFields = useSelectedFields(list)
  const { data, error, refetch, loading } = useQuery(
    useMemo((): TypedDocumentNode<{
      items: Record<string, unknown>[] | null
      count: number | null
    }> => {
      const selectedGqlFields = [...selectedFields]
        .map(fieldPath => list.fields[fieldPath].controller.graphqlSelection)
        .join('\n')

      // TODO: FIXME: this is bad
      return gql`
        query (
          $where: ${list.graphql.names.whereInputName},
          $take: Int!,
          $skip: Int!,
          $orderBy: [${list.graphql.names.listOrderName}!]
        ) {
          items: ${list.graphql.names.listQueryName}(
            where: $where,
            take: $take,
            skip: $skip,
            orderBy: $orderBy
          ) {
            ${selectedFields.has('id') ? '' : 'id'}
            ${selectedGqlFields}
          }
          count: ${list.graphql.names.listQueryCountName}(where: $where)
        }
      `
    }, [list, selectedFields]),
    {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      variables: {
        where: { ...filters.where, ...search },
        take: pageSize,
        skip: (currentPage - 1) * pageSize,
        orderBy: sort ? [{ [sort.field]: sort.direction.toLowerCase() }] : undefined,
      },
    }
  )

  useEffect(() => {
    if (searchParam === searchString) return
    setSearchString(searchParam)
  }, [searchParam])
  const updateSearch = (value: string) => {
    const { search, ...queries } = query

    if (value.trim()) {
      push({ query: { ...queries, search: value } })
    } else {
      push({ query: queries })
    }
  }

  const [dataWithPevious, setDataWithPrevious] = useState<typeof data>(data)
  if (!loading && data !== dataWithPevious) {
    setDataWithPrevious(data)
  }

  const allowCreate = !(list.hideCreate ?? true)
  const allowDelete = !(list.hideDelete ?? true)
  const isConstrained = Boolean(filters.filters.length || query.search)
  const isEmpty = Boolean(data?.count === 0 && !isConstrained)

  return (
    <PageContainer
      header={
        components.ListPageHeader ? (
          <components.ListPageHeader listKey={listKey} showCreate={allowCreate} />
        ) : (
          <ListPageHeader listKey={listKey} showCreate={allowCreate} />
        )
      }
      title={list.label}
    >
      <VStack flex gap="large" paddingY="xlarge" minHeight={0} minWidth={0}>
        {/* TODO: FIXME: not sure where to put this */}
        {/* {list.description !== null && (
          <p css={{ marginTop: '24px', maxWidth: '704px' }}>{list.description}</p>
        )} */}
        <HStack gap="regular" alignItems="center">
          <SearchField
            aria-label="Search"
            isDisabled={isEmpty}
            // label={`Search by ${searchLabels.length ? searchLabels.join(', ') : 'ID'}`}
            onClear={() => updateSearch('')}
            onSubmit={updateSearch}
            onChange={setSearchString}
            placeholder="Search…"
            value={searchString}
            width="alias.singleLineWidth"
            flexGrow={{ mobile: 1, tablet: 0 }}
          />
          <FilterAdd listKey={listKey} isDisabled={isEmpty} />
          <FieldSelection listKey={listKey} isDisabled={isEmpty} />
          {Boolean(isConstrained || query.sortBy || query.fields) && (
            <TooltipTrigger>
              <ActionButton aria-label="reset" onPress={resetToDefaults} prominence="low">
                <Icon src={undo2Icon} />
              </ActionButton>
              <Tooltip>Reset to defaults</Tooltip>
            </TooltipTrigger>
          )}
          {components.ListPageActions && (
            <components.ListPageActions listKey={listKey} refetch={refetch} />
          )}
        </HStack>

        {filters.filters.length ? <FilterList filters={filters.filters} list={list} /> : null}

        <GraphQLErrorNotice errors={[error?.networkError, ...(error?.graphQLErrors ?? [])]} />

        <ListTable
          listKey={listKey}
          allowDelete={allowDelete}
          data={dataWithPevious}
          currentPage={currentPage}
          isConstrained={isConstrained}
          pageSize={pageSize}
          refetch={refetch}
          selectedFields={selectedFields}
          loading={loading}
          itemActions={components.ListItemsActions}
        />
      </VStack>
    </PageContainer>
  )
}

const LIST_PAGE_TITLE_ID = 'keystone-list-page-title'

function ListPageHeader({ listKey, showCreate }: { listKey: string; showCreate?: boolean }) {
  const list = useList(listKey)
  return (
    <Fragment>
      <Heading id={LIST_PAGE_TITLE_ID} elementType="h1" size="small">
        {list.label}
      </Heading>
      {showCreate && (
        <CreateButtonLink
          list={list}
        >{`New ${list.singular.toLocaleLowerCase()}`}</CreateButtonLink>
      )}
    </Fragment>
  )
}

function ListTable({
  allowDelete,
  data,
  currentPage,
  isConstrained,
  listKey,
  pageSize,
  refetch,
  selectedFields,
  loading,
  itemActions,
}: {
  allowDelete: boolean
  currentPage: number
  isConstrained: boolean
  listKey: string
  pageSize: number
  refetch: () => void
  selectedFields: ReturnType<typeof useSelectedFields>
  data: { items: Record<string, unknown>[] | null; count: number | null } | undefined
  loading: boolean
  itemActions?: ListPageComponents['ListItemsActions']
}) {
  const list = useList(listKey)
  const { adminPath } = useKeystone()
  const router = useRouter()
  const [selectedKeys, setSelectedKeys] = useState<SelectedKeys>(() => new Set([]))
  const onSortChange = (sortDescriptor: SortDescriptor) => {
    const sortBy =
      sortDescriptor.direction === 'ascending' ? `-${sortDescriptor.column}` : sortDescriptor.column
    router.push({ query: { ...router.query, sortBy } })
  }
  const selectionMode = allowDelete ? 'multiple' : 'none'
  const selectedItemCount = selectedKeys === 'all' ? 'all' : selectedKeys.size
  const [idsForDeletion, setIdsForDeletion] = useState<Set<Key> | null>(null)
  const [idsForAction, setIdsForAction] = useState<Set<Key> | null>(null)
  const [activeAction, setActiveAction] = useState<Key | null>(null)
  const columns = [...selectedFields].map(path => {
    const field = list.fields[path]
    return {
      id: path,
      label: field.label,
      allowsSorting: !isConstrained && !data?.items?.length ? false : field.isOrderable,
    }
  })

  return (
    <Fragment>
      <ActionBarContainer flex minHeight="scale.3000">
        <TableView
          aria-labelledby={LIST_PAGE_TITLE_ID}
          selectionMode={selectionMode}
          onSortChange={onSortChange}
          sortDescriptor={parseSortQuery(router.query.sortBy) || parseInitialSort(list.initialSort)}
          density="spacious"
          overflowMode="truncate"
          onSelectionChange={setSelectedKeys}
          selectedKeys={selectedKeys}
          renderEmptyState={() =>
            loading ? (
              <ProgressCircle isIndeterminate />
            ) : isConstrained ? (
              <EmptyState
                icon={searchXIcon}
                title="No results"
                message="No items found. Try adjusting your search or filters."
              />
            ) : (
              <EmptyState
                icon={textSelectIcon}
                title="Empty list"
                message="Add the first item to see it here."
              />
            )
          }
          flex
          UNSAFE_style={{
            opacity: loading && !!data ? 0.5 : undefined,
          }}
        >
          <TableHeader columns={columns}>
            {({ label, id, ...options }) => (
              <Column key={id} isRowHeader {...options}>
                {label}
              </Column>
            )}
          </TableHeader>
          <TableBody items={data?.items ?? []}>
            {row => {
              return (
                <Row href={`${adminPath}/${list.path}/${row?.id}`}>
                  {key => {
                    const field = list.fields[key]
                    const value = row[key]
                    const CellContent = field.views.Cell
                    return (
                      <Cell>
                        {CellContent ? (
                          <CellContent value={value} field={field.controller} item={row} />
                        ) : (
                          <Text>{value?.toString()}</Text>
                        )}
                      </Cell>
                    )
                  }}
                </Row>
              )
            }}
          </TableBody>
        </TableView>

        <ActionBar
          selectedItemCount={selectedItemCount}
          onClearSelection={() => {
            setSelectedKeys(new Set())
            setActiveAction(null)
          }}
          UNSAFE_className={css({
            // TODO: update in @keystar/ui package
            // make `tokenSchema.size.shadow.regular` token "0 1px 4px"
            'div:has([data-focus-scope-start])': {
              backgroundColor: tokenSchema.color.background.canvas,
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
              borderRadius: tokenSchema.size.radius.regular,
              boxShadow: `0 1px 4px ${tokenSchema.color.shadow.regular}`,
            },
          })}
          onAction={key => {
            setActiveAction(key)
            const customAction = itemActions?.actions?.find(i => i.key === key)
            customAction?.onAction?.(idsForAction, list, refetch, () => {
              setSelectedKeys(new Set())
              setActiveAction(null)
              setIdsForAction(null)
            })
            switch (key) {
              case 'delete':
                if (itemActions?.actions?.find(i => i.key === 'delete')) {
                  if (selectedKeys === 'all') {
                    const ids = data?.items?.filter(x => x.id != null).map(x => `${x.id}`)
                    setIdsForAction(new Set(ids))
                  } else {
                    setIdsForAction(selectedKeys)
                  }
                  return
                }
                if (selectedKeys === 'all') {
                  const ids = data?.items?.filter(x => x.id != null).map(x => `${x.id}`)
                  setIdsForDeletion(new Set(ids))
                } else {
                  setIdsForDeletion(selectedKeys)
                }
                break
              default:
                console.log('make', selectedKeys)
                if (selectedKeys === 'all') {
                  const ids = data?.items?.filter(x => x.id != null).map(x => `${x.id}`)
                  setIdsForAction(new Set(ids))
                } else {
                  setIdsForAction(selectedKeys)
                }
                break
            }
          }}
          buttonLabelBehavior="show"
        >
          {!itemActions?.actions?.find(i => i.key === 'update') ? (
            <Item key="__update" textValue="Update">
              <Icon src={editIcon} />
              <Text>Update</Text>
            </Item>
          ) : null}
          {!itemActions?.actions?.find(i => i.key === 'delete') ? (
            <Item key="delete" textValue="Delete">
              <Icon src={trash2Icon} />
              <Text>Delete</Text>
            </Item>
          ) : null}
          <>
            {itemActions?.actions?.length
              ? itemActions.actions.map(i => (
                  <Item key={i.key} textValue={i.label}>
                    <ErrorBoundary>
                      <Icon src={i.icon || zapIcon} />
                    </ErrorBoundary>
                    <Text>{i.label}</Text>
                  </Item>
                ))
              : null}
          </>
        </ActionBar>
      </ActionBarContainer>
      {itemActions?.Component ? (
        <itemActions.Component
          list={list}
          refetch={refetch}
          selectedItems={idsForAction}
          action={activeAction}
          onClear={() => {
            setSelectedKeys(new Set())
            setActiveAction(null)
            setIdsForAction(null)
          }}
        />
      ) : null}
      {!!data?.count && (
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          plural={list.plural}
          singular={list.singular}
          total={data.count}
        />
      )}

      <DialogContainer
        onDismiss={() => {
          setSelectedKeys(new Set())
          setIdsForDeletion(null)
        }}
      >
        {idsForDeletion && (
          <DeleteItemsDialog items={idsForDeletion} listKey={listKey} refetch={refetch} />
        )}
      </DialogContainer>
      <DialogContainer
        onDismiss={() => {
          setSelectedKeys(new Set())
          setIdsForAction(new Set())
          setActiveAction(null)
        }}
      >
        {activeAction === '__update' && idsForAction && (
          <UpdateItemDialog items={idsForAction} listKey={listKey} refetch={refetch} />
        )}
      </DialogContainer>
    </Fragment>
  )
}

function parseSortQuery(queryString?: string | string[]): SortDescriptor | undefined {
  if (!queryString) return

  // TODO: handle multiple sort queries?
  if (Array.isArray(queryString)) return parseSortQuery(queryString[0])

  const column = queryString.startsWith('-') ? queryString.slice(1) : queryString
  const direction = queryString.startsWith('-') ? 'ascending' : 'descending'

  return { column, direction }
}

function parseInitialSort(
  sort?: { field: string; direction: 'ASC' | 'DESC' } | null
): SortDescriptor | undefined {
  if (!sort) return undefined
  return {
    column: sort.field,
    direction: sort.direction === 'ASC' ? 'ascending' : 'descending',
  }
}

function DeleteItemsDialog(props: { items: Set<Key>; listKey: string; refetch: () => void }) {
  const { items, listKey, refetch } = props
  const list = useList(listKey)

  const [deleteItems] = useMutation(
    useMemo(
      () =>
        gql`
        mutation($where: [${list.graphql.names.whereUniqueInputName}!]!) {
          ${list.graphql.names.deleteManyMutationName}(where: $where) {
            id
            ${list.labelField}
          }
        }
`,
      [list]
    ),
    { errorPolicy: 'all' }
  )

  const onDelete = async () => {
    const { data, errors } = await deleteItems({
      variables: { where: [...items].map(id => ({ id })) },
    })
    /*
      Data returns an array where successful deletions are item objects
      and unsuccessful deletions are null values.
      Run a reduce to count success and failure as well as
      to generate the success message to be passed to the success toast
     */
    const { successfulItems, unsuccessfulItems } = data[
      list.graphql.names.deleteManyMutationName
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
        `Unable to delete ${unsuccessfulItems} item${unsuccessfulItems === 1 ? '' : 's'}.`,
        {
          timeout: 5000,
        }
      )
    }

    if (successfulItems) {
      toastQueue.neutral(`Deleted ${successfulItems} item${successfulItems === 1 ? '' : 's'}.`, {
        timeout: 5000,
      })
    }

    return refetch()
  }

  return (
    <AlertDialog
      title="Delete items"
      cancelLabel="Cancel"
      primaryActionLabel="Yes, delete"
      onPrimaryAction={onDelete}
      tone="critical"
    >
      Are you sure? This will permanently delete {items.size} item
      {items.size === 1 ? '' : 's'}.
    </AlertDialog>
  )
}
