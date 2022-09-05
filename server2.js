const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const schema = buildSchema(`
  type User {
    id: ID!,
    name: String!,
    email: String!,
  }
input UserInput {
    name: String!,
    email: String!
  }
type Query {
    getAllUser: [User!]!
    getUser(id: ID!): User
  }
type Mutation {
    createUser(input: UserInput): User
    updateUser(id: ID!, input: UserInput): User
  }
`);
const id = require("crypto").randomBytes(10).toString("hex");
let users = [{ id, name: "brachio", email: "brachio@email.com" }];
const root = {
  getAllUser: () => {
    return users;
  },
  getUser: ({ id }) => {
    const found = users.find((user) => user.id === id);
    if (!found) {
      throw new Error("please check the user id, we cannot find it");
    }
    return found;
  },
  createUser: ({ input }) => {
    const id = require("crypto").randomBytes(10).toString("hex");
    users.push({ id, ...input });
    return { id, ...input };
  },
  updateUser: ({ id, input }) => {
    const newUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, ...input };
      } else {
        return user;
      }
    });
    users = [...newUsers];
    return { id, ...input };
  },
};
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
