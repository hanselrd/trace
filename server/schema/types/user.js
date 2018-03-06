module.exports = `
  type User {
    id: Int!
    name: String!
    email: String!
    language: String!
    online: Boolean!
    messages: [Message!]
    role: Role
    createdAt: Date!
  }

  type Query {
    users: [User!]
    user(id: Int!): User
    currentUser: User
    newToken: String
    onlineUsers: [User!]
  }

  type Mutation {
    login(email: String!, password: String!): Response!
    signup(name: String!, email: String!, password: String!, language: String): Response!
    changePassword(oldPassword: String!, password: String!): Response!
  }

  type Subscription {
    userAdded: User!
  }
`;