import getUserId from "../../../utils/getUserId"
import Joi from "joi";
import { PermissionValidator } from "../../../validations";

const PermissionMutations = {
  async createPermission(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);
    // Validation
    await Joi.validate(args.data, PermissionValidator);

    return prisma.mutation.createPermission({
      data: {
        ...args.data
      }
    });
  },
  async updatePermission(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, PermissionValidator);

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
    // Check that user must be logged in
    getUserId(request);

    return prisma.mutation.deletePermission({
      where: {
        id: args.id
      }
    });
  },
  async deleteManyPermissions(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    return prisma.mutation.deleteManyPermissions({
      where: {
        id_in: args.id
      }
    });
  }
}

export { PermissionMutations as default }