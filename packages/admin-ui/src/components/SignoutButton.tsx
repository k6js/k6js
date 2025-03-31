import { useEffect } from 'react'
import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo'
import { useRouter } from '@keystone-6/core/admin-ui/router'
import { ActionButton } from '@keystar/ui/button'
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip'
import { Text } from '@keystar/ui/typography'

const END_SESSION = gql`
  mutation KsAuthEndSession {
    endSession
  }
`

export function SignoutButton({ authItemLabel }: { authItemLabel: string }) {
  const router = useRouter()
  const [endSession, { data }] = useMutation(END_SESSION)
  useEffect(() => {
    if (data?.endSession) {
      router.push('/signin')
    }
  }, [data])

  return (
    <TooltipTrigger>
      <ActionButton onPress={() => endSession()}>Sign out</ActionButton>
      <Tooltip>
        <Text>
          Signed in as <strong>{authItemLabel}</strong>
        </Text>
      </Tooltip>
    </TooltipTrigger>
  )
}
