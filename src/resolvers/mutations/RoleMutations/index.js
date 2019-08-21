import getUserId from "../../../utils/getUserId"
import Joi from "joi";
import { RoleValidator } from "../../../validations";

const RoleMutations = {
  async createRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    // const user = getUserId(request);
    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    const { permissions, name } = args.data;

    const payload = await prisma.mutation.createRole({
      data: {
        name,
        permissions: {
          connect: permissions.map(p => ({ id: p }))
        }
      }
    });

    return { payload }
  },
  async updateRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    const { permissions, name } = args.data;

    const payload = await prisma.mutation.updateRole({
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

    return { payload }
  },
  async updateManyRoles(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    // Validation
    await Joi.validate(args.data, RoleValidator, { abortEarly: false });

    const payload = await prisma.mutation.updateManyRoles({
      where: {
        id_in: args.id
      },
      data: {
        ...args.data
      }
    });

    return { payload };
  },
  async deleteRole(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    const payload = await prisma.mutation.deleteRole({
      where: {
        id: args.id
      }
    });

    return { payload };
  },
  async deleteManyRoles(parent, args, { prisma, request }, info) {
    // Check that user must be logged in
    getUserId(request);

    const payload = await prisma.mutation.deleteManyRoles({
      where: {
        id_in: args.id
      },
      data: args
    });

    return { payload };
  }
}

export { RoleMutations as default }