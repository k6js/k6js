/* eslint-disable */
import * as view0 from '@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/id-field-view'
import * as view1 from '@keystone-6/core/fields/types/text/views'
import * as view2 from '@keystone-6/core/fields/types/image/views'
import * as view3 from '@keystone-6/core/fields/types/file/views'
import * as view4 from '@keystone-6/core/fields/types/password/views'
import * as view5 from '@keystone-6/core/fields/types/checkbox/views'
import * as view6 from '@keystone-6/core/fields/types/relationship/views'
import * as view7 from '@keystone-6/core/fields/types/virtual/views'
import * as view8 from '@keystone-6/core/fields/types/select/views'
import * as view9 from '@keystone-6/core/fields/types/timestamp/views'
import * as view10 from '@keystone-6/core/fields/types/integer/views'

import * as packageAdminConfig from './config'

const userAdminConfig = {}
export const config = {
  adminConfig: {
    ...packageAdminConfig,
    ...userAdminConfig,
  },
  apiPath: '/api/graphql',
  adminPath: '',
  fieldViews: [view0, view1, view2, view3, view4, view5, view6, view7, view8, view9, view10],
}
