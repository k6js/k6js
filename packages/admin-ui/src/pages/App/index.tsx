import React from 'react'
import type { AdminConfig, FieldViews } from '@keystone-6/core/types'
import { KeystoneProvider } from '@keystone-6/core/admin-ui/context'
import { ErrorBoundary } from '../../components'

type AdminProps = {
  children: React.ReactNode
  config: AppConfig
}

type AppConfig = {
  adminConfig: AdminConfig
  fieldViews: FieldViews
  apiPath: string
  adminPath: string
}

export function Layout({ children, config }: AdminProps) {
  return (
    <KeystoneProvider {...config}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </KeystoneProvider>
  )
}
