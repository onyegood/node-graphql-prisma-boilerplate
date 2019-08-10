import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../src/prisma'

jest.setTimeout(30000);

const permissionOne = {
    input: {
        name: 'CAN_CREATE_USER'
    },
    permission: undefined
}

const roleOne = {
    input: {
        name: 'Admin User'
    },
    role: undefined
}


const userOne = {
    input: {
        firstName: 'One',
        lastName: 'One',
        email: 'goodmomen@gmail.com',
        phone: '07031002033',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined
}

const userTwo = {
    input: {
        firstName: 'Two',
        lastName: 'Two',
        email: 'onyegood@yahoo.com',
        phone: '07031002000',
        password: bcrypt.hashSync('Red098!@#$')
    },
    user: undefined,
    jwt: undefined
}

let roleId;
let permissionId;

const seedDatabase = async () => {
    // Delete test data
    await prisma.mutation.deleteManyUsers();
    await prisma.mutation.deleteManyPermissions();
    await prisma.mutation.deleteManyRoles();

    // Create permission
    permissionOne.permission = await prisma.mutation.createPermission({
        data: permissionOne.input
    });

    // Create Role
    roleOne.role = await prisma.mutation.createRole({
        data: {
            ...roleOne.input,
            permissions: {
                connect: {
                    id: permissionOne.permission.id
                }
            }
        }
    });

    // Create user one
    userOne.user = await prisma.mutation.createUser({
        data: {
            ...userOne.input,
            role: {
                connect: {
                    id: roleOne.role.id
                }
            }
        }
    });

    userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

    // Create user one
    userTwo.user = await prisma.mutation.createUser({
        data: {
            ...userTwo.input,
            role: {
                connect: {
                    id: roleOne.role.id
                }
            }
        }
    })
    userTwo.jwt = jwt.sign({ userId: userTwo.user.id }, process.env.JWT_SECRET)

    // Set role ID
    roleId = roleOne.role.id;

    // Set permission ID
    permissionId = permissionOne.permission.id;
}


export { seedDatabase as default, userOne, roleOne, roleId, permissionId };