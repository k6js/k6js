import {allIcons} from '@keystar/ui/icon/all'
import {Icon} from '@keystar/ui/icon'
import {HStack} from '@keystar/ui/layout'

export default function Page () {
  return (
    <div>
      <h1>Icons</h1>
      <HStack wrap={true} gap={16}>
        {Object.entries(allIcons).map(([key, src], i) => (
          <div key={i} style={{minWidth: 300, }}>
            <Icon size="large" src={src} />
            <span style={{ marginLeft: 8 }}>{key}</span>
          </div>
        ))}
      </HStack>
    </div>
  )
}