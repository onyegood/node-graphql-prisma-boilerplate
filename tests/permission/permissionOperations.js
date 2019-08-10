import { gql } from 'apollo-boost';

const createPermission = gql`
    mutation($data:CreatePermissionInput!) {
        createPermission(data: $data){
            id
            name
        }
    }
`


const updatePermission = gql`
    mutation($id: ID!, $data: UpdatePermissionInput!){
        updatePermission(id: $id, data: $data){
            id
            name
        }
    }

`

const deletePermission = gql`
    mutation($id: ID!){
        deletePermission(id: $id){
            id
        }
    }
`

const getPermissions = gql`
    query {
        permissions {
            id
            name
        }
    }
`

export { createPermission, getPermissions, updatePermission, deletePermission }