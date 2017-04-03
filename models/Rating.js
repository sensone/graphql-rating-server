import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { Resolver } from 'graphql-compose';

import { GraphQLBoolean } from 'graphql';

import { ResultSchema } from './Result';
import { Tournament } from './Tournament';

const RatingSchema = new Schema({
  OS: Number,
  OD: Number,
  DYP: Number,
  COMBINED: Number,
});

export const Rating = mongoose.model('Rating', RatingSchema);
export const RatingTC = composeWithRelay(composeWithMongoose(Rating));
