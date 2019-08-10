import 'cross-fetch/polyfill';
import prisma from '../../src/prisma';
import seedDatabase, { permissionId, userOne, roleId, roleOne, } from '../utils/seedDatabase';
import getClient from '../utils/getClient'
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from './roleOperations';

const client = getClient();

beforeEach(seedDatabase);

test('Should create new role', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    data: {
      name: 'Super Admin',
      permissions: permissionId
    }
  }

  const { data } = await client.mutate({ mutation: createRole, variables });
  const exists = await prisma.exists.Role({ id: data.id });

  expect(exists).toBe(true);
});

test('Should fetch all roles', async () => {
  const client = getClient(userOne.jwt);
  const { data } = await client.query({ query: getRoles });

  expect(data.roles.length).toBe(1);
  expect(data.roles[0].name).toBe(roleOne.role.name);
});

test('Should fetch role by ID', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: roleId
  }

  const { data } = await client.query({ query: getRoleById, variables });

  expect(data.role.name).toBe(roleOne.role.name);
  expect(data.role.permissions.length).toBe(1);
  expect(data.role.permissions[0].id).toBe(permissionId);
});

test('Should update role', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: roleId,
    data: {
      name: 'Updated Name',
      permissions: []
    }
  }

  const { data } = await client.mutate({ mutation: updateRole, variables });

  expect(data.updateRole.id).toBe(roleId);
  expect(data.updateRole.name).toBe(variables.data.name);

});

test('Should update role without authentication', async () => {

  const variables = {
    id: roleId,
    data: {
      name: 'Updated Name',
      permissions: []
    }
  }

  await expect(
    client.mutate({ mutation: updateRole, variables })
  ).rejects.toThrow();

});

test('Should delete role', async () => {
  const client = getClient(userOne.jwt);

  const variables = {
    id: roleId
  }

  const { data } = await client.mutate({ mutation: deleteRole, variables });
  const exists = await prisma.exists.Role({ id: roleId });

  expect(data.deleteRole.id).toBe(roleId);
  expect(exists).toBe(false)
});

test('Should delete role without authentication', async () => {

  const variables = {
    id: roleId
  }

  expect(
    client.mutate({ mutation: deleteRole, variables })
  ).rejects.toThrow()
});