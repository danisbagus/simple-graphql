const express = require("express");
var { graphqlHTTP } = require("express-graphql");
var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

const app = express();

let products = [
  { id: 1, name: "Baju idur", categoryID: 1 },
  { id: 2, name: "Baju renang", categoryID: 1 },
  { id: 3, name: "Kursi kaku 8", categoryID: 2 },
  { id: 4, name: "Lampu hias", categoryID: 2 },
  { id: 5, name: "Meja 360", categoryID: 2 },
  { id: 6, name: "Lampu otomatis", categoryID: 3 },
  { id: 7, name: "Panel surya", categoryID: 3 },
  { id: 8, name: "Palu medium", categoryID: 4 },
  { id: 9, name: "Gergaji 2 sisi", categoryID: 4 },
  { id: 10, name: "Gerinda ringan", categoryID: 4 },
];

let categories = [
  { id: 1, name: "Pakaian" },
  { id: 2, name: "Pelengkapan rumah" },
  { id: 3, name: "Elektronik" },
  { id: 4, name: "Perkakas" },
];

const productType = new GraphQLObjectType({
  name: "Product",
  description: "Represent product",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    categoryID: { type: new GraphQLNonNull(GraphQLInt) },
    category: {
      type: categoryType,
      resolve: (product) => {
        return categories.find(
          (category) => category.id === product.categoryID
        );
      },
    },
  }),
});

const categoryType = new GraphQLObjectType({
  name: "Category",
  description: "Represent category",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    products: {
      type: new GraphQLList(productType),
      resolve: (category) => {
        return products.filter((product) => product.categoryID === category.id);
      },
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root query",
  fields: () => ({
    product: {
      type: productType,
      description: "product detail",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        products.find((product) => product.id === args.id),
    },
    products: {
      type: new GraphQLList(productType),
      description: "product list",
      resolve: () => products,
    },
    categories: {
      type: new GraphQLList(categoryType),
      description: "category list",
      resolve: () => categories,
    },
    category: {
      type: categoryType,
      description: "category detail",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        categories.find((category) => category.id === args.id),
    },
  }),
});

const rootMutationType = new GraphQLObjectType({
  name: "mutation",
  description: "root mutation",
  fields: () => ({
    insertProduct: {
      type: productType,
      description: "insert a product",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        categoryID: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const product = {
          id: products.length + 1,
          name: args.name,
          categoryID: args.categoryID,
        };
        products.push(product);
        return product;
      },
    },
    insertCategory: {
      type: categoryType,
      description: "insert a category",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const category = {
          id: categories.length + 1,
          name: args.name,
        };
        categories.push(category);
        return category;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: rootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(4000, () => {
  console.log("Example app listening on port 4000");
});
