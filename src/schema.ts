export const typeDefs = `#graphql
  type Query {
    posts: [Post]
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    userCreate(email: String!, name: String!, bio: String!, password: String!): AuthPayload
    userLogin(email: String!, password: String!): AuthPayload
  }

  


  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    profile: Profile!
    posts: [Post!]!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload{
    userErrors: [UserError!]!
    post: Post
  }

  input PostInput {
    title: String
    content: String
  }

  type AuthPayload{
    userErrors: [UserError!]!,
    token: String
  }

`;