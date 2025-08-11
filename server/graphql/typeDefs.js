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
  
  # The new Alert type
  type Alert {
    id: ID!
    category: String!
    description: String!
    location: Location!
    user: User! # The user who created the alert
    confirmations: [User!] # Users who confirmed
    createdAt: String!
  }

  # A type for geographic coordinates
  type Location {
    type: String!
    coordinates: [Float!]!
  }

  # An input type for creating a location
  input LocationInput {
    longitude: Float!
    latitude: Float!
  }

  type Query {
    hello: String
    getMe: User!
  }

  type Mutation {
    registerUser(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    
    # The new createAlert mutation
    createAlert(category: String!, description: String!, location: LocationInput!): Alert!
  }
`;