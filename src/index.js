const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});

mongoose
  .connect(`mongodb://localhost/graphql`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongoose Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
server.listen(port).then(({ url }) => console.log(`server started at ${url}`));
