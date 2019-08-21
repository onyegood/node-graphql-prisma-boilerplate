import getUserId from '../../../utils/getUserId'

const UserQuery = {
  users(parent, args, { prisma, request }, info) {
    getUserId(request);

    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      orderBy: args.orderBy
    }

    if (args.query) {
      opArgs.where = {
        OR: [{
          firstName_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  user(parent, { email }, { prisma, request }, info) {
    const id = getUserId(request);

    return prisma.query.user({
      where: { id }
    }, info)
  },
  me(parent, args, { prisma, request }, info) {
    const id = getUserId(request)

    return prisma.query.user({
      where: { id }
    }, info)
  }
}

export { UserQuery as default }