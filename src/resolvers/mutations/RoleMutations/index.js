import getUserId from "../../../utils/getUserId"
import Joi from "joi";
import { RoleValidator } from "../../../validations";

const RoleMutations = {
  async createRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);
    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    const { permissions, name } = args.data;

    return prisma.mutation.createRole({
      data: {
        name,
        permissions: {
          connect: permissions.map(p => ({ id: p }))
        }
      }
    });
  },
  async updateRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    const { permissions, name } = args.data;

    return prisma.mutation.updateRole({
      where: {
        id: args.id
      },
      data: {
        name,
        permissions: {
          connect: permissions.map(p => ({ id: p }))
        }
      }
    });
  },
  async updateManyRoles(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    await prisma.mutation.updateManyRoles({
      where: {
        id_in: args.id
      },
      data: {
        ...args.data
      }
    });

    return args.data;
  },
  async deleteRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    return prisma.mutation.deleteRole({
      where: {
        id: args.id
      }
    });
  },
  async deleteManyRoles(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    return prisma.mutation.deleteManyRoles({
      where: {
        id_in: args.id
      },
      data: args
    });
  }
}

export { RoleMutations as default }