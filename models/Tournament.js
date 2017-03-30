import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLBoolean } from 'graphql';

import { ResultTC } from './Result';
import { getOneYearBefore } from '../utils/helper';

export const TournamentSchema = new Schema({
  name: String,
  date: Number,
  title: String,
  weight: String,
  city: String,
  type: String,
  players_count: Number,
},
{
  collection: 'tournaments'
});

export const Tournament = mongoose.model('Tournament', TournamentSchema);
export const TournamentTC = composeWithRelay(composeWithMongoose(Tournament));

TournamentTC.addRelation(
  'results',
  () => ({
    resolver: ResultTC.getResolver('findMany'),
    args: {
      filter: (source) => ({ tournamentID: source._id.toString() }),
      sort: { place: 1 },
    },
    projection: { _id: true },
  })
);

TournamentTC.addFields({
  operable: {
    type: GraphQLBoolean,
    description: 'Availability tournament for analysis',
    resolve: (source) => {
      const ONE_YEAR_BEFORE = getOneYearBefore();

      return source.date >= ONE_YEAR_BEFORE;
    },
    projection: { date: true }
  },
});
