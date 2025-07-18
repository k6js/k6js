import { type ReactNode, type PropsWithChildren, useState } from 'react'
import { usePathname } from 'next/navigation'

import { ActionButton } from '@keystar/ui/button'
import { DialogContainer } from '@keystar/ui/dialog'
import { Icon } from '@keystar/ui/icon'
import { bookTextIcon } from '@keystar/ui/icon/icons/bookTextIcon'
import { constructionIcon } from '@keystar/ui/icon/icons/constructionIcon'
import { fileJson2Icon } from '@keystar/ui/icon/icons/fileJson2Icon'
import { githubIcon } from '@keystar/ui/icon/icons/githubIcon'
import { heartHandshakeIcon } from '@keystar/ui/icon/icons/heartHandshakeIcon'
import { MenuTrigger, Menu, Item } from '@keystar/ui/menu'
import { Divider, HStack, VStack } from '@keystar/ui/layout'
import {
  type NavListProps,
  NavList as KeystarNavList,
  NavItem as KeystarNavItem,
} from '@keystar/ui/nav-list'
import { TooltipTrigger, Tooltip } from '@keystar/ui/tooltip'
import { Text } from '@keystar/ui/typography'
import type { ListMeta } from '@keystone-6/core/types'
import { useKeystone } from '@keystone-6/core/admin-ui/context'

import { WelcomeDialog } from './WelcomeDialog'

type NavItemProps = {
  /**
   * The content of the item.
   */
  children: ReactNode
  /**
   * The URL to navigate to when the item is clicked. Omit the origin, as it
   * interferes with client-side routing. Use `/` for the dashboard.
   */
  href: string
  /**
   * Optionally override the selected state of the item. By default, this is
   * determined by the current route and the `href` provided.
   */
  isSelected?: boolean
}

export function getHrefFromList(
  list: Pick<ListMeta, 'path' | 'isSingleton'>,
  adminPath: string = ''
) {
  return `${adminPath}/${list.path}${list.isSingleton ? '/1' : `${adminPath}`}`
}

/** A navigation item represents a page in the AdminUI. */
export function NavItem(props: NavItemProps) {
  const { children, href, isSelected: isSelectedProp } = props
  const pathname = usePathname()

  let ariaCurrent: 'page' | boolean | undefined = isSelectedProp
  if (!ariaCurrent) {
    if (pathname === href) {
      ariaCurrent = 'page'
    } else if (pathname.split('/')[1] === href.split('/')[1]) {
      ariaCurrent = true
    }
  }

  return (
    <KeystarNavItem aria-current={ariaCurrent || undefined} href={href}>
      {children}
    </KeystarNavItem>
  )
}

/** Thin wrapper around "@keystar/ui" component */
export function NavList(props: NavListProps) {
  return <KeystarNavList aria-label="main" flex marginEnd="medium" {...props} />
}

/** The root navigation component for the AdminUI */
export function NavContainer({ children }: PropsWithChildren) {
  return (
    <VStack gap="large" height="100%" paddingY="xlarge">
      {children}
    </VStack>
  )
}

/** @private Exported for internal consumption only. */
export function Navigation() {
  const { adminMeta, adminConfig, adminPath } = useKeystone()
  const lists = Object.values(adminMeta?.lists ?? [])
  const visibleLists = lists.filter(x => !x.hideNavigation)

  if (adminConfig?.components?.Navigation)
    return <adminConfig.components.Navigation lists={visibleLists} />
  return (
    <NavContainer>
      <NavList>
        <NavItem href="/">Dashboard</NavItem>
        <Divider />
        {visibleLists.map((list: ListMeta) => (
          <NavItem key={list.key} href={getHrefFromList(list, adminPath)}>
            {list.label}
          </NavItem>
        ))}
      </NavList>

      <NavFooter>
        <DeveloperResourcesMenu />
      </NavFooter>
    </NavContainer>
  )
}

/** Should be displayed below the `NavList` component. */
export function NavFooter(props: PropsWithChildren) {
  return (
    <HStack paddingX="large" gap="regular">
      {props.children}
    </HStack>
  )
}

/** A footer item in the navigation. */
export function DeveloperResourcesMenu() {
  const { apiPath } = useKeystone()
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  if (process.env.NODE_ENV === 'production') return null
  if (!apiPath) return null // TODO: FIXME: ?
  return (
    <>
      <MenuTrigger>
        <TooltipTrigger>
          <ActionButton aria-label="Developer resources">
            <Icon src={constructionIcon} />
          </ActionButton>
          <Tooltip>Developer resources</Tooltip>
        </TooltipTrigger>
        <Menu
          onAction={key => {
            if (key === 'community') {
              setDialogIsOpen(true)
            }
          }}
        >
          <Item href={apiPath} textValue="API explorer">
            <Icon src={fileJson2Icon} />
            <Text>API explorer</Text>
          </Item>
          <Item
            target="_blank"
            href="https://github.com/keystonejs/keystone"
            textValue="GitHub repository"
          >
            <Icon src={githubIcon} />
            <Text>GitHub repository</Text>
          </Item>
          <Item target="_blank" href="https://keystonejs.com" textValue="Documentation">
            <Icon src={bookTextIcon} />
            <Text>Documentation</Text>
          </Item>
          <Item key="community" textValue="Community">
            <Icon src={heartHandshakeIcon} />
            <Text>Community</Text>
          </Item>
        </Menu>
      </MenuTrigger>
      <DialogContainer onDismiss={() => setDialogIsOpen(false)}>
        {dialogIsOpen && <WelcomeDialog />}
      </DialogContainer>
    </>
  )
}
