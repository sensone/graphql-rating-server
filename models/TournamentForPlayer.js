import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { Resolver } from 'graphql-compose';

import { GraphQLBoolean } from 'graphql';

import { ResultSchema } from './Result';
import { Tournament } from './Tournament';

import { getOneYearBefore } from '../utils/helper';

const TournamentSchemaForPlayer = new Schema({
  date: Number,
  title: String,
  weight: String,
  city: String,
  type: String,
  players_count: Number,
  result: ResultSchema,
  operable: Boolean
});

export const TournamentForPlayer = mongoose.model('TournamentForPlayer', TournamentSchemaForPlayer);
export const TournamentForPlayerTC = composeWithRelay(composeWithMongoose(TournamentForPlayer));

TournamentForPlayerTC.addFields({
  operable: {
    type: GraphQLBoolean,
    description: 'Availability tournament for analysis',
    resolve: (source) => (source.date >= getOneYearBefore()),
    projection: { operable: true, date: true, weight: true, players_count: true }
  },
});

export async function getTournamentsForPlayer(source) {
  const FIELDS = {
    'results.team.$': 1, title: 1, name: 1, date: 1,
    title: 1, weight: 1, city: 1, type: 1, players_count: 1,
  };

  return await Tournament.find({ 'results.team': source._id, }, FIELDS)
    .then((results) => {
      let resultsForPlayer = [];

      results.forEach((result) => {
        const clone = Object.assign({}, result._doc);
        resultsForPlayer.push(clone);
      });

      resultsForPlayer.map((r) => {
        r.result = r.results[0];
        r.operable = r.date >= getOneYearBefore();

        delete r.results;
        return r;
      });

      return resultsForPlayer;
    });
}
