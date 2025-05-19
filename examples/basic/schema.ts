import { list, graphql } from '@keystone-6/core'
import {
  text,
  relationship,
  checkbox,
  password,
  timestamp,
  select,
  virtual,
  image,
  file,
  integer,
  multiselect,
} from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import { v4 } from 'uuid'
import { allowAll } from '@keystone-6/core/access'
import { type Lists } from '.keystone/types'

type AccessArgs = {
  session?: {
    itemId?: string
    listKey?: string
    data: {
      name?: string
      isAdmin: boolean
    }
  }
  item?: any
}

export const access = {
  isAdmin: ({ session }: AccessArgs) => !!session?.data.isAdmin,
}

const randomNumber = () => Math.round(Math.random() * 10)

const User: Lists.User = list({
  access: allowAll,
  ui: {
    listView: {
      initialColumns: ['name', 'posts', 'avatar'],
    },
  },
  fields: {
    /** The user's first and last name. */
    name: text({ validation: { isRequired: true } }),
    /** Email is used to log into the system. */
    email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
    /** Avatar upload for the users profile, stored locally */
    // avatar: image({ storage: 'my_images' }),
    // attachment: file({ storage: 'my_files' }),
    /** Used to log in. */
    password: password(),
    /** Administrators have more access to various lists and fields. */
    isAdmin: checkbox({
      access: {
        read: access.isAdmin,
        create: access.isAdmin,
        update: access.isAdmin,
      },
      ui: {
        createView: {
          fieldMode: args => (access.isAdmin(args) ? 'edit' : 'hidden'),
        },
        itemView: {
          fieldMode: args => (access.isAdmin(args) ? 'edit' : 'read'),
        },
      },
    }),
    phoneNumbers: relationship({
      ref: 'PhoneNumber.user',
      many: true,
      ui: {
        // TODO: Work out how to use custom views to customise the card + edit / create forms
        // views: './admin/fieldViews/user/phoneNumber',
        displayMode: 'table',
        columns: ['type', 'value'],
        itemView: {
          fieldMode: 'read',
        }
      },
    }),
    posts: relationship({ ref: 'Post.author', many: true }),
    roles: multiselect({
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'Subscriber', value: 'subscriber' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Member', value: 'member' },
        { label: 'Customer', value: 'customer' },
        { label: 'VIP', value: 'vip' },
        { label: 'Super Admin', value: 'super-admin' },
      ],
      defaultValue: ['subscriber'],
      // ui: {
      //   displayMode: 'checkboxes',
      // },
    }),
    randomNumber: virtual({
      field: graphql.field({
        type: graphql.Float,
        resolve() {
          return randomNumber()
        },
      }),
    }),
  },
})

export const lists: Lists = {
  User,
  PhoneNumber: list({
    access: allowAll,
    ui: {
      isHidden: true,
      // parentRelationship: 'user',
    },
    fields: {
      label: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item) {
            return `${item.type} - ${item.value}`
          },
        }),
        ui: {
          listView: {
            fieldMode: 'hidden',
          },
          itemView: {
            fieldMode: 'hidden',
          },
        },
      }),
      user: relationship({ ref: 'User.phoneNumbers' }),
      type: select({
        options: [
          { label: 'Home', value: 'home' },
          { label: 'Work', value: 'work' },
          { label: 'Mobile', value: 'mobile' },
        ],
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      value: text({}),
      content: document({
        formatting: {
          inlineMarks: {
            bold: true,
            italic: true,
          },
          listTypes: { unordered: true },
        },
        links: true,
        // relationships: {
        //   mention: {
        //     label: 'Mention',
        //     listKey: 'User',
        //   },
        // },
        // formatting: true,
        // layouts: [
        //   [1, 1],
        //   [1, 1, 1],
        //   [2, 1],
        //   [1, 2],
        //   [1, 2, 1],
        // ],
        // links: true,
        // dividers: true,
      }),
    },
  }),
  Post: list({
    access: allowAll,
    fields: {
      title: text({ access: {} }),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        ui: {
          displayMode: 'segmented-control',
        },
        validation: {
          isRequired: true,
        },
        defaultValue: 'draft',
      }),
      content: document({
      // relationships: {
      //   mention: {
      //     label: 'Mention',
      //     listKey: 'User',
      //   },
        // },
        // formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      // publishDate: timestamp({ ui: { views: '@k6js/admin-ui/views/timestamp' } }),
      archiveDate: timestamp(),
      score: integer({ defaultValue: 1 }),
      isDeleted: checkbox({ defaultValue: false }),
      author: relationship({
        ref: 'User.posts',
        ui: {
          // displayMode: 'cards',
          // cardFields: ['name', 'email'],
          // inlineEdit: { fields: ['name', 'email'] },
          // linkToItem: true,
          // inlineCreate: { fields: ['name', 'email'] },
        },
      }),
    },
  }),
}

export const extendGraphqlSchema = graphql.extend(base => {
  const RandomNumber = graphql.object<{ number: number }>()({
    name: 'RandomNumber',
    fields: {
      number: graphql.field({ type: graphql.Int }),
      generatedAt: graphql.field({
        type: graphql.Int,
        resolve() {
          return Date.now()
        },
      }),
    },
  })

  return {
    mutation: {
      createRandomPosts: graphql.field({
        type: graphql.nonNull(graphql.list(graphql.nonNull(base.object('Post')))),
        resolve: async (rootVal, args, context) => {
          const data = Array.from({ length: 238 }).map((x, i) => ({ title: `Post ${i}` }))
          return context.db.Post.createMany({ data })
        },
      }),
    },
    query: {
      randomNumber: graphql.field({
        type: RandomNumber,
        resolve: () => ({ number: randomNumber() }),
      }),
      uuid: graphql.field({
        type: graphql.nonNull(graphql.ID),
        resolve: () => v4(),
      }),
    },
  }
})
