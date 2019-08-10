# node-graphql-prisma-boilerplate

GraphQL Node and Prisma TDD

# Setup Guide

Step 1: Create a folder in the root directory named config
Step 2: Create dev.env, prod.env and test.env files inside config folder
Step 3: In dev.env paste and provide all the environment variables to deploy your dev environment
`PRISMA_ENDPOINT=http://localhost:4466/project-name-here/dev 
PRISMA_SECRET=choose-a-secret-key 
JWT_SECRET=choose-a-secret-key 
SEND_GRID_KEY=your-send-grid_key 
REDIRECT_DOMAIN=http://localhost:3000 
DB_TYPE=your-db eg. (postgres) 
DB_HOST_NAME=your-db-host-name 
DB_NAME=your-db-name 
DB_USER_NAME=your-db-user-name 
DB_PASSWORD=your-db-password`

Step 4: In test.env paste and provide all the environment variables to deploy your test environment
`PRISMA_ENDPOINT=http://localhost:4466/project-name-here/test 
PRISMA_SECRET=choose-a-secret-key 
JWT_SECRET=choose-a-secret-key 
SEND_GRID_KEY=your-send-grid_key 
REDIRECT_DOMAIN=http://localhost:3000 
DB_TYPE=your-db eg. (postgres) 
DB_HOST_NAME=your-db-host-name 
DB_NAME=your-db-name DB_USER_NAME=your-db-user-name 
DB_PASSWORD=your-db-password`

Step 5: In prod.env paste and provide all the environment variables to deploy your production environment
`PRISMA_ENDPOINT=product-api-url-here 
PRISMA_SECRET=choose-a-secret-key 
JWT_SECRET=choose-a-secret-key 
SEND_GRID_KEY=your-send-grid_key 
REDIRECT_DOMAIN=http://localhost:3000 
DB_TYPE=your-db eg. (postgres) 
DB_HOST_NAME=your-db-host-name 
DB_NAME=your-db-name 
DB_USER_NAME=your-db-user-name 
DB_PASSWORD=your-db-password`

NOTE: You can use the same environment varibles for all the 3 environment but pay attention to the "PRISMA_ENDPOINT"
