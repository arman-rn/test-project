const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    firstName: String
    lastName: String
  }

  input UserInfo {
    firstName: String!
    lastName: String!
  }

  type File {
    _id: ID!
    fileLocation: String!
    filename: String!
  }

  type Message {
    _id: ID!
    content: String!
    sender: User
  }

  input MessageInfo {
    content: String!
    sender: ID!
  }

  type Query {
    users: [User!]!
    userById(userId: ID!): User!
  }

  type Mutation {
    register(userInfo: UserInfo!): User!
    singleUpload(file: Upload!): File!
    sendMessage(messageInfo: MessageInfo!): Message!
  }

  type Subscription {
    newMessage: Message!
  }
`;
