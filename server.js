import express from 'express';
import cors from 'cors';

import graphqlHTTP from 'express-graphql';
import { expressPort } from './config';
import graphqlSchema from './graphqlSchema';
import './mongooseConnection';

const server = express();

server.use(cors());

server.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  graphiql: true,
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    stack: error.stack,
    path: error.path,
  })
}));

server.listen(expressPort, () => console.log(`Started on http://localhost:${expressPort}/`));
