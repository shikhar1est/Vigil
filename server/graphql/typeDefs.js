// server/graphql/typeDefs.js
export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    hello: String
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): AuthPayload!
  }
`;