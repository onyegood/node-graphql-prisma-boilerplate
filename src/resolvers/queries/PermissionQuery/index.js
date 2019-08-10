import getUserId from '../../../utils/getUserId'

const PermissionQuery = {
  permissions(parent, args, { prisma, request }, info) {
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

    return prisma.query.permissions(opArgs, info);
  }
}

export { PermissionQuery as default }