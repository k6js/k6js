'use client'
import makeSigninPage from '@keystone-6/auth/pages/InitPage'

export default makeSigninPage({
  listKey: 'User',
  authGqlNames: {
    authenticateItemWithPassword: 'authenticateUserWithPassword',
    ItemAuthenticationWithPasswordResult: 'UserAuthenticationWithPasswordResult',
    ItemAuthenticationWithPasswordSuccess: 'UserAuthenticationWithPasswordSuccess',
    ItemAuthenticationWithPasswordFailure: 'UserAuthenticationWithPasswordFailure',
    CreateInitialInput: 'CreateInitialUserInput',
    createInitialItem: 'createInitialUser',
  },
  fieldPaths: ['name', 'email', 'password'],
  enableWelcome: true,
})
