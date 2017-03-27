import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import { PlayerTC } from './Player';
import { TournamentTC } from './Tournament';
import composeWithRelay from 'graphql-compose-relay';

export const ResultSchema = new Schema({
  team: {
    type: [String],
    description: 'List of playerIDs'
  },
  tournamenID: {
    type: String,
    ref: 'Tournament',
    description: 'Tournamen ID',
  },
  place: {
    type: Number
  }
},
{
  collection: 'results'
});

export const Result = mongoose.model('Result', ResultSchema);
export const ResultTC = composeWithRelay(composeWithMongoose(Result));

ResultTC.addRelation(
  'tournament',
  () => ({
    resolver: TournamentTC.getResolver('findById'),
    args: {
      _id: (source) => (source.tournamenID),
    },
    projection: { tournamenID: true },
  })
);

// ResultTC.addRelation(
//   'player',
//   () => ({
//     resolver: PlayerTC.getResolver('findById'),
//     args: {
//       _id: (source) => (source.playerID),
//     },
//     projection: { playerID: true },
//   })
// );

ResultTC.addRelation(
  'players',
  () => ({
    resolver: PlayerTC.getResolver('findByIds'),
    args: {
      _ids: (source) => ( source.team ),
    },
  })
);
