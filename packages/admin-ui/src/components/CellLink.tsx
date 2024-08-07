/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx, useTheme } from '@keystone-ui/core'
import { Link, type LinkProps } from '@keystone-6/core/admin-ui/router'

/**
 * This is the component you should use when linking a Cell to an item (i.e when the Cell supports
 * the linkTo prop)
 */

export const CellLink = (props: LinkProps) => {
  const { colors, spacing } = useTheme()
  return (
    <Link
      css={{
        color: colors.foreground,
        display: 'block',
        padding: spacing.small,
        textDecoration: 'none',

        ':hover': {
          textDecoration: 'underline',
        },
      }}
      {...props}
    />
  )
}
