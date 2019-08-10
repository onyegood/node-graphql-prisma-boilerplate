import getUserId from '../../../utils/getUserId'

const RoleQuery = {
  roles(parent, args, { prisma, request }, info) {
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
          name_contains: args.query
        }]
      }
    }

    return prisma.query.roles(opArgs, info);
  },
  role(parent, args, { prisma, request }, info) {
    getUserId(request);

    return prisma.query.role({
      where: {
        id: args.id
      }
    }, info);
  }
}

export { RoleQuery as default }