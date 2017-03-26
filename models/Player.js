import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { ResultTC } from './Result';

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

// PlayerTC.addRelation(
//   'results',
//   () => ({
//     resolver: ResultTC.get('$findMany'),
//     args: {
//       filter: (source) => ({
//         _operators : {
//           playerID : { in: source._id },
//         }
//       }),
//     },
//     projection: { _id: true },
//   })
// );
