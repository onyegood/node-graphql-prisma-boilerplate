import { gql } from 'apollo-boost'

const createUser = gql`
    mutation($data:CreateUserInput!) {
        createUser(
            data: $data
        ){
            token,
            user {
                id
                firstName
                lastName
                phone
                email
            }
        }
    }
`

const getUsers = gql`
    query {
        users {
            id
            firstName
            lastName
            phone
            email
        }
    }
`

const getUserById = gql`
    query($id: ID!) {
        user(id: $id){
            id
            firstName
            lastName
            phone
            email
            resetTokenExpiration
            resetToken
        }
    }
`

const login = gql`
    mutation($data:LoginUserInput!) {
        login(
            data: $data
        ){
            token
            user{
                id
                firstName
                lastName
                phone
                email
            }
        }
    }
`

const getProfile = gql`
    query {
        me {
            id
            firstName
            lastName
            phone
            email
        }
    }
`

const deleteUser = gql`
    mutation($id: ID!){
        deleteUser(id: $id){
            id
        }
    }
`

const updateUser = gql`
    mutation($id: ID!, $data: UpdateUserInput!){
        updateUser(id: $id, data: $data){
            id
            firstName
            lastName
            phone
            email
            resetTokenExpiration
            resetToken
        }
    }

`

const forgotPassword = gql`
    mutation($data: ForgotPasswordInput!){
        forgotPassword(data: $data){
            id
            firstName
            lastName
            phone
            email
            resetTokenExpiration
            resetToken
        }
    }
`

const resetPassword = gql`
    mutation($data: ResetPasswordInput!){
        resetPassword(data: $data){
            id
            firstName
            lastName
            phone
            email
            resetTokenExpiration
            resetToken
        }
    }

`

const validateOTP = gql`
    mutation($data: ValidateOTPInput!){
        validateOTP(data: $data){
            id
            resetTokenExpiration
            resetToken
        }
    }

`

export { createUser, login, getUsers, getUserById, getProfile, deleteUser, updateUser, forgotPassword, resetPassword, validateOTP }