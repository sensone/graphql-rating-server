import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLFloat } from 'graphql';

import { PlayerTC } from './Player';
import { TournamentTC, Tournament } from './Tournament';
import { getPoints } from '../utils/helper';

export const ResultSchema = new Schema({
  team: {
    type: [String],
    description: 'List of playerIDs'
  },
  tournamentID: {
    type: String,
    ref: 'Tournament',
    description: 'Tournament ID',
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

ResultTC.addFields({
  points: {
    type: GraphQLFloat,
    description: 'Rating points',
    projection: { tournamentID: true, place: true },
    resolve: async (source) => {
      return await Tournament.findById({ _id: source.tournamentID }).then((tournament) => {
        return getPoints(tournament, source);
      });
    },
  }
});

ResultTC.addRelation(
  'tournament',
  () => ({
    resolver: TournamentTC.getResolver('findById'),
    args: {
      _id: (source) => (source.tournamentID),
    },
    projection: { tournamentID: true },
  })
);

ResultTC.addRelation(
  'players',
  () => ({
    resolver: PlayerTC.getResolver('findByIds'),
    projection: { team: true },
    args: {
      _ids: (source) => ( source.team ),
    },
  })
);
