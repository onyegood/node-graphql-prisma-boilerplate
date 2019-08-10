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
  user(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    }, info)
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    return prisma.query.user({
      where: {
        id: userId
      }
    }, info)
  }
}

export { UserQuery as default }