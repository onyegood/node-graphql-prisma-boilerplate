import 'cross-fetch/polyfill';
import prisma from '../../src/prisma';
import seedDatabase, { userOne, permissionId } from '../utils/seedDatabase';
import getClient from '../utils/getClient'
import { createPermission, getPermissions, updatePermission, deletePermission } from './permissionOperations';

const client = getClient();

beforeEach(seedDatabase);

test('Should fetch all permissions', async () => {
  const client = getClient(userOne.jwt);

  const response = await client.query({ query: getPermissions });

  expect(response.data.permissions.length).toBe(1);
  expect(response.data.permissions[0].name).toBe('CAN_CREATE_USER');
});

test('Should create new permission', async () => {
  const variables = {
    data: {
      name: "CAN_CREATE_NEW_USER"
    }
  }

  const client = getClient(userOne.jwt);

  const response = await client.mutate({ mutation: createPermission, variables });
  const exists = await prisma.exists.Permission({ id: response.data.createPermission.id });

  expect(exists).toBe(true);
});

test('Should update permission', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: permissionId,
    data: {
      name: 'Updated Name'
    }
  }

  const { data } = await client.mutate({ mutation: updatePermission, variables });

  expect(data.updatePermission.id).toBe(permissionId);
  expect(data.updatePermission.name).toBe(variables.data.name);

});

test('Should update permission without authentication', async () => {

  const variables = {
    id: permissionId,
    data: {
      name: 'Updated Name'
    }
  }

  await expect(
    client.mutate({ mutation: updatePermission, variables })
  ).rejects.toThrow();

});

test('Should delete permission', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: permissionId
  }

  const { data } = await client.mutate({ mutation: deletePermission, variables });
  const exists = await prisma.exists.Permission({ id: permissionId });

  expect(data.deletePermission.id).toBe(permissionId);
  expect(exists).toBe(false)
});

test('Should delete permission without authentication', async () => {

  const variables = {
    id: permissionId
  }

  expect(
    client.mutate({ mutation: deletePermission, variables })
  ).rejects.toThrow()
});