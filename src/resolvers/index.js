import { extractFragmentReplacements } from 'prisma-binding'
import User from './User'

// Subscription
import UserSubscriptions from './subscriptions/UserSubscription';

// Queries
import UserQuery from './queries/UserQuery'
import PermissionQuery from './queries/PermissionQuery'
import RoleQuery from './queries/RoleQuery'

// Mutations
import UserMutations from './mutations/UserMutations'
import RoleMutations from './mutations/RoleMutations'
import PermissionMutations from './mutations/PermissionMutations'

const resolvers = {
    Query: {
        ...UserQuery,
        ...RoleQuery,
        ...PermissionQuery
    },
    Mutation: {
        ...UserMutations,
        ...RoleMutations,
        ...PermissionMutations
    },
    // Subscription: {
    // ...UserSubscriptions
    // },
    User
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }