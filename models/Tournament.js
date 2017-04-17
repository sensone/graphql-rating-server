import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import randomstring from 'randomstring';
import { Resolver } from 'graphql-compose';

import { GraphQLBoolean, GraphQLString, GraphQLFloat } from 'graphql';

import { ResultSchema } from './Result';
import { PlayerTC } from './Player';
import { getOneYearBefore } from '../utils/helper';

export const TournamentSchema = new Schema({
  date: Number,
  title: String,
  weight: String,
  city: String,
  type: String,
  players_count: Number,
  results: [ResultSchema]
},
{
  collection: 'tournaments',
  toObject: { virtuals: true }, toJSON: { virtuals: true }
});

TournamentSchema.virtual('operable').get(function() {
  return this.date >= getOneYearBefore();
});

export const Tournament = mongoose.model('Tournament', TournamentSchema);
export const TournamentTC = composeWithRelay(composeWithMongoose(Tournament));
const ResultTC = TournamentTC.get('results');

TournamentTC.addFields({
  operable: {
    type: GraphQLBoolean,
    description: 'Availability tournament for analysis',
    resolve: (source) => ( source.operable ),
    projection: { operable: true, date: true, weight: true, players_count: true }
  },
});

ResultTC.addFields({
  points: {
    type: GraphQLFloat,
    description: 'Rating points',
    projection: { place: true, points: true },
    resolve: (source) => ( source.points ),
  },
  id: {
    type: 'String',
    resolve: () => ( randomstring.generate() ),
  }
});

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
