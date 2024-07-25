import React from 'react'
import { Core } from '@keystone-ui/core'
import { type DocumentNode } from 'graphql'
import { type AdminConfig, type FieldViews } from '@keystone-6/core/types'
import { KeystoneProvider } from '@keystone-6/core/admin-ui/context'
import { ErrorBoundary } from '../../components'

type AdminProps = {
  children: React.ReactNode
  config: AppConfig
}
 
type AppConfig = {
  adminConfig: AdminConfig
  adminMetaHash: string
  fieldViews: FieldViews
  lazyMetadataQuery: DocumentNode
  apiPath: string
  adminPath: string
}

export function Layout ({ children, config }: AdminProps) {
  return (
      <Core>
        <KeystoneProvider {...config}>
          <ErrorBoundary>
           {children}
          </ErrorBoundary>
        </KeystoneProvider>
      </Core>
    )
  }