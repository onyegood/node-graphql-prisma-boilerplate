import { gql } from 'apollo-boost';

const createRole = gql`
    mutation($data:CreateRoleInput!) {
        createRole(data: $data){
                id
                name
        }
    }
`

const updateRole = gql`
    mutation($id: ID!, $data: UpdateRoleInput!){
        updateRole(id: $id, data: $data){
            id
            name
        }
    }

`

const deleteRole = gql`
    mutation($id: ID!){
        deleteRole(id: $id){
            id
        }
    }
`

const getRoles = gql`
    query {
        roles {
                id
                name
        }
    }
`

const getRoleById = gql`
     query($id: ID!){
            role(id: $id){
            id
            name
            permissions{
                id
                name
            }
        }
    }
`

export { createRole, getRoles, getRoleById, updateRole, deleteRole }