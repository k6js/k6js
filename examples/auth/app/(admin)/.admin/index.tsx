/* eslint-disable */
import * as view0 from "@keystone-6/core/___internal-do-not-use-will-break-in-patch/admin-ui/id-field-view"
import * as view1 from "@keystone-6/core/fields/types/text/views"
import * as view2 from "@keystone-6/core/fields/types/password/views"
import * as view3 from "@keystone-6/core/fields/types/checkbox/views"

import * as packageAdminConfig from "./config"

const userAdminConfig = {}
export const config = {
  adminConfig: {
    ...packageAdminConfig,
    ...userAdminConfig
  },
  apiPath: '/api/graphql',
  adminPath: '',
  fieldViews: [view0,view1,view2,view3],
};
