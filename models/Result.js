import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLFloat } from 'graphql';

import { PlayerTC } from './Player';
//import { TournamentTC, Tournament } from './Tournament';
import { getPoints } from '../utils/helper';

export const ResultSchema = new Schema({
  team: {
    type: [String],
    description: 'List of playerIDs'
  },
  place: {
    type: Number
  }
}, { _id: false, toObject: { virtuals: true }, toJSON: { virtuals: true } });

ResultSchema.virtual('points').get(function() {
  const TOURNAMENT = this.parent();
//  console.dir(TOURNAMENT)
  return getPoints(TOURNAMENT, this.place);
});

//export const Result = mongoose.model('Result', ResultSchema);
//export const ResultTC = composeWithRelay(composeWithMongoose(Result));

// ResultTC.addFields({
//   points: {
//     type: GraphQLFloat,
//     description: 'Rating points',
//     projection: { place: true, points: true },
//     resolve: (source, args, context, info) => (source.points),
//   }
// });
//
// ResultTC.addRelation(
//   'players',
//   () => ({
//     resolver: PlayerTC.getResolver('findByIds'),
//     projection: { team: true },
//     args: {
//       _ids: (source) => ( source.team ),
//     },
//   })
// );
