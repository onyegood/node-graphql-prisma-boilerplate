import getUserId from "../../../utils/getUserId"
import Joi from "joi";
import { PermissionValidator } from "../../../validations";

const PermissionMutations = {
  async createPermission(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    // const user = getUserId(request);
    // Validation
    await Joi.validate(args.data, PermissionValidator);

    const payload = await prisma.mutation.createPermission({
      data: {
        ...args.data
      }
    });

    return { payload }
  },
  async updatePermission(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, PermissionValidator);

    const payload = await prisma.mutation.updatePermission({
      where: {
        id: args.id
      },
      data: {
        ...args.data
      }
    });

    return { payload }
  },
  async deletePermission(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    const payload = await prisma.mutation.deletePermission({
      where: {
        id: args.id
      }
    });

    return { payload }
  },
  async deleteManyPermissions(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    const payload = await prisma.mutation.deleteManyPermissions({
      where: {
        id_in: args.id
      }
    });

    return { payload }
  }
}

export { PermissionMutations as default }