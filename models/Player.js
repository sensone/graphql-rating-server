import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { test } from '../utils/updateRating';

import { TournamentTC, Tournament } from './Tournament';
import { TournamentForPlayerTC, getTournamentsForPlayer } from './TournamentForPlayer';
import { RatingSchema } from './Rating';

export const PlayerSchema = new Schema({
  name: String,
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  city: String,
  rating: RatingSchema,
  rating_diff: RatingSchema
},
{
  collection: 'players',
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const Player = mongoose.model('Player', PlayerSchema);
export const PlayerTC = composeWithRelay(composeWithMongoose(Player));

PlayerTC.addFields({
  tournaments: {
    type: [TournamentForPlayerTC],
    resolve: (source) => (getTournamentsForPlayer(source)),
    args: {
      _id: 'String'
    },
  }
});

PlayerTC.getResolver('connection')
  .addSortArg({
     name: 'RATING_COMBINED_DESC',
     description: 'Sorting by combined rating',
     value: { 'rating.combined': -1 },
  })
  .addSortArg({
     name: 'RATING_COMBINED_ASC',
     description: 'Sorting by combined rating',
     value: { 'rating.combined': 1 },
  })
  .addSortArg({
     name: 'RATING_OS_COMBINED_DESC',
     description: 'Sorting by OS combined rating',
     value: { 'rating.os.combined': -1 },
  })
  .addSortArg({
     name: 'RATING_OS_COMBINED_ASC',
     description: 'Sorting by OS combined rating',
     value: { 'rating.os.combined': 1 },
  })
  .addSortArg({
     name: 'RATING_OD_COMBINED_DESC',
     description: 'Sorting by OD combined rating',
     value: { 'rating.od.combined': -1 },
  })
  .addSortArg({
     name: 'RATING_OD_COMBINED_ASC',
     description: 'Sorting by OD combined rating',
     value: { 'rating.od.combined': 1 },
  })
  .addSortArg({
     name: 'RATING_DYP_DESC',
     description: 'Sorting by DYP rating',
     value: { 'rating.dyp': -1 },
  })
  .addSortArg({
     name: 'RATING_DYP_ASC',
     description: 'Sorting by DYP rating',
     value: { 'rating.dyp': 1 },
  })
