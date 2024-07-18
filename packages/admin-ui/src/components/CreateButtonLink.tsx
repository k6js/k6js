/** @jsxRuntime classic */
/** @jsx jsx */
import { Button } from '@keystone-ui/button'
import { jsx } from '@keystone-ui/core'
import { type ListMeta } from '@keystone-6/core/types'
import { Link } from '@keystone-6/core/admin-ui/router'

export const CreateButtonLink = (props: { list: ListMeta }) => {
  return (
    <Button
      css={{
        textDecoration: 'none',
        ':hover': {
          color: 'white',
        },
      }}
      as={Link}
      href={`/${props.list.path}/create`}
      tone="active"
      size="small"
      weight="bold"
    >
      Create {props.list.singular}
    </Button>
  )
}
