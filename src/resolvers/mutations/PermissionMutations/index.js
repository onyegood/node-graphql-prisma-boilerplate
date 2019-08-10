import getUserId from '../../../utils/getUserId'

const PermissionMutations = {
  async createPermission(parent, args, { prisma, request }, info) {
    getUserId(request);

    return prisma.mutation.createPermission({
      data: {
        ...args.data
      }
    });
  },
  async updatePermission(parent, args, { prisma, request }, info) {
    getUserId(request);

    return prisma.mutation.updatePermission({
      where: {
        id: args.id
      },
      data: {
        ...args.data
      }
    });
  },
  async deletePermission(parent, args, { prisma, request }, info) {
    getUserId(request);

    return prisma.mutation.deletePermission({
      where: {
        id: args.id
      }
    });
  },
  async deleteManyPermissions(parent, args, { prisma, request }, info) {
    getUserId(request);

    return prisma.mutation.deleteManyPermissions({
      where: {
        id_in: args.id
      }
    });
  }
}

export { PermissionMutations as default }