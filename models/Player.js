import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql';

import { ResultTC, Result } from './Result';


export const PlayerSchema = new Schema({
  name: String,
  gender: { // enum field with values
    type: String,
    enum: ['male', 'female', 'ladyboy'],
  },
  city: String
},
{
  collection: 'players'
});

export const Player = mongoose.model('Player', PlayerSchema);
export const PlayerTC = composeWithRelay(composeWithMongoose(Player));

PlayerTC.addFields({
  results: {
    type: [ResultTC],
    description: 'Collection of player results',
    resolve: async (source) => {
      return await Result.find({
        team: source._id.toString(),
      }).then((result) => {
        return result;
      })
    },
    projection: { _id: true, place: true },
  },
});

// PlayerTC.addRelation(
//   'results',
//   () => ({
//     resolver: ResultTC.getResolver('findMany').wrapResolve((next) => (rp) => {
//         const resultPromise = next(rp)
//
//         resultPromise.then(payload => {
//           return payload;
//         }).catch((e) => {
//           console.log(e)
//         })
//
//         return resultPromise;
//       }),
//     args: {
//       filter: (source) => ({ team: source._id.toString() }),
//       sort: { place: 1 },
//     },
//     projection: { _id: true },
//   })
// );
