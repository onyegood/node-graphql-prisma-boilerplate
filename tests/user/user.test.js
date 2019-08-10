import 'cross-fetch/polyfill'
import prisma from '../../src/prisma'
import seedDatabase, { userOne, roleId } from '../utils/seedDatabase'
import getClient from '../utils/getClient'
import {
    createUser,
    getUsers,
    login,
    getProfile,
    deleteUser,
    updateUser,
    forgotPassword,
    validateOTP,
    getUserById,
    resetPassword
} from './userOperations'

const client = getClient();

beforeEach(seedDatabase);

test('Should create a new user', async () => {
    const variables = {
        data: {
            firstName: 'Tester',
            lastName: 'John',
            email: 'tester@example.com',
            phone: '07031002011',
            password: 'password',
            role: roleId
        }
    }
    const response = await client.mutate({
        mutation: createUser,
        variables
    });

    const exists = await prisma.exists.User({ id: response.data.createUser.user.id })
    expect(exists).toBe(true)
});

test('Should fetch all users', async () => {
    const client = getClient(userOne.jwt);
    const response = await client.query({ query: getUsers });

    expect(response.data.users.length).toBe(2);
    expect(response.data.users[0].email).toBe(userOne.user.email);
    expect(response.data.users[0].firstName).toBe(userOne.user.firstName);
});

test('Should login with correct credentials', async () => {
    const variables = {
        data: {
            email: 'goodmomen@gmail.com',
            password: 'Red098!@#$'
        }
    }

    const { data } = await client.mutate({ mutation: login, variables });

    expect(data.login.user.id).toBe(userOne.user.id);
    expect(data.login.user.firstName).toBe(userOne.user.firstName);
    expect(data.login.user.lastName).toBe(userOne.user.lastName);
    expect(data.login.user.email).toBe(null);
});
test('Should not login with bad credentials', async () => {
    const variables = {
        data: {
            email: 'tester@example.com',
            password: "red098!@#$"
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow()
});

test('Should not signup user with invalid password', async () => {
    const variables = {
        data: {
            firstName: 'Tester',
            lastName: 'John',
            email: 'tester@example.com',
            phone: '07031002033',
            password: 'pass',
            role: roleId
        }
    }

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow()
});

test('Should fetch user profile', async () => {
    const client = getClient(userOne.jwt)
    const { data } = await client.query({ query: getProfile });

    expect(data.me.id).toBe(userOne.user.id);
    expect(data.me.firstName).toBe(userOne.user.firstName);
    expect(data.me.email).toBe(userOne.user.email);
});

test('Should delete user successfully', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: userOne.user.id
    }

    await client.mutate({ mutation: deleteUser, variables });
    const exists = await prisma.exists.User({ id: userOne.user.id });

    expect(exists).toBe(false);
});

test('Should delete user faild', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: undefined
    }

    await expect(
        client.mutate({ mutation: deleteUser, variables })
    ).rejects.toThrow();
});

test('Should delete user faild for none authenticated user', async () => {
    const variables = {
        id: userOne.user.id
    }

    await expect(
        client.mutate({ mutation: deleteUser, variables })
    ).rejects.toThrow();
});

test('Should update user successfully', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: userOne.user.id,
        data: {
            firstName: "John B"
        }
    }

    const { data } = await client.mutate({ mutation: updateUser, variables });

    expect(data.updateUser.firstName).toBe(variables.data.firstName);
});

test('Should update user fail for incorrect data', async () => {
    const client = getClient(userOne.jwt);
    const variables = {
        id: undefined,
        data: {
            firstName: "John B"
        }
    }
    await expect(
        client.mutate({ mutation: updateUser, variables })
    ).rejects.toThrow();
});

test('Should update user fail for none authenticated user', async () => {
    const variables = {
        id: userOne.user.id,
        data: {
            firstName: "John B"
        }
    }
    await expect(
        client.mutate({ mutation: updateUser, variables })
    ).rejects.toThrow();
});

test('Should request password reset successfully', async () => {
    const client = getClient(userOne.jwt);

    const variables = {
        id: userOne.user.id,
        data: {
            email: userOne.user.email
        }
    }

    const { data } = await client.mutate({ mutation: forgotPassword, variables });
    const exists = await prisma.exists.User({ id: data.forgotPassword.id });

    const response = await client.query({ query: getUserById, variables });

    expect(data.forgotPassword.id).toBe(userOne.user.id);
    expect(exists).toBe(true);
    expect(response.data.user.resetToken).not.toBe(null);
    expect(response.data.user.resetTokenExpiration).not.toBe(null);
});

test('Should request password reset faild, return user not found', async () => {
    const variables = {
        data: {
            email: 'notfound@example.com'
        }
    }

    await expect(
        client.mutate({ mutation: forgotPassword, variables })
    ).rejects.toThrow();
});

test('Should validate OTP successfully', async () => {
    const client = getClient(userOne.jwt);

    let variables = {
        id: userOne.user.id,
        data: {
            email: userOne.user.email
        }
    }

    await client.mutate({ mutation: forgotPassword, variables });
    const response = await client.query({ query: getUserById, variables });

    // Reassign variable
    variables = {
        id: userOne.user.id,
        data: {
            passwordToken: response.data.user.resetToken
        }
    }
    const { data } = await client.mutate({ mutation: validateOTP, variables });

    expect(data.validateOTP.id).toBe(userOne.user.id);
    expect(data.validateOTP.resetToken).toBe(response.data.user.resetToken);
    expect(data.validateOTP.resetToken).not.toBe(null);
    expect(data.validateOTP.resetTokenExpiration).not.toBe(null);
});

test('Should validate OTP faild', async () => {
    const variables = {
        data: {
            passwordToken: '09089'
        }
    }

    await expect(
        client.mutate({ mutation: resetPassword, variables })
    ).rejects.toThrow();
});

test('Should reset password successfully', async () => {
    const client = getClient(userOne.jwt);

    let variables = {
        id: userOne.user.id,
        data: {
            email: userOne.user.email
        }
    }

    await client.mutate({ mutation: forgotPassword, variables });
    const response = await client.query({ query: getUserById, variables });

    // Reassign variable
    variables = {
        id: userOne.user.id,
        data: {
            password: "NewPassword",
            passwordToken: response.data.user.resetToken
        }
    }
    const { data } = await client.mutate({ mutation: resetPassword, variables });

    expect(data.resetPassword.id).toBe(userOne.user.id);
    expect(data.resetPassword.resetToken).toBe(null);
    expect(data.resetPassword.resetTokenExpiration).toBe(null);
});

test('Should fail if incorrect passwordToken is supplied', async () => {
    const variables = {
        data: {
            password: "NewPassword",
            passwordToken: '09089'
        }
    }

    await expect(
        client.mutate({ mutation: resetPassword, variables })
    ).rejects.toThrow();
});
