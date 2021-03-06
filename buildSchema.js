import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
//import { getExampleNames, resolveExamplePath } from './config';

async function buildSchema() {
  const Schema = require('./graphqlSchema').default;
  const result = await (graphql(Schema, introspectionQuery));

  if (result.errors) {
    console.error('ERROR introspecting schema: ', JSON.stringify(result.errors, null, 2));
  } else {
    fs.writeFileSync('./data/schema.graphql.json', JSON.stringify(result, null, 2));
    console.log('  write file ./data/schema.graphql.json');
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync('./data/schema.graphql.txt', printSchema(Schema));
  console.log('  write file ./data/schema.graphql.txt');
}

async function run() {
  //const exampleNames = getExampleNames();
  //for (let name of exampleNames) {
    console.log('Building schema ...');
  //  await buildSchema(resolveExamplePath(name));
    await buildSchema();
  //}

  console.log('Building schemas competed!');
};

run().catch(e => {
  console.log(e);
  process.exit(0);
});
