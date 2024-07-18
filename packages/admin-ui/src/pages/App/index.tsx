import React from 'react'
import { Core } from '@keystone-ui/core'
import { type AppProps } from 'next/app'
import { type DocumentNode } from 'graphql'
import { type AdminConfig, type FieldViews } from '@keystone-6/core/types'
import { KeystoneProvider } from '@keystone-6/core/admin-ui/context'
import { ErrorBoundary } from '../../components'

type AppConfig = {
  adminConfig: AdminConfig
  adminMetaHash: string
  fieldViews: FieldViews
  lazyMetadataQuery: DocumentNode
  apiPath: string
}

export const getApp =
  (props: AppConfig) =>
  ({ Component, pageProps }: AppProps) => {
    return (
      <Core>
        <KeystoneProvider {...props}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </KeystoneProvider>
      </Core>
    )
  }
