import mongoose, { Schema } from 'mongoose';
// import composeWithMongoose from 'graphql-compose-mongoose';
// import composeWithRelay from 'graphql-compose-relay';
// import { Resolver, TypeComposer } from 'graphql-compose';
//
// import { GraphQLBoolean } from 'graphql';
//
// import { ResultSchema } from './Result';
// import { Tournament } from './Tournament';

const RatingItemShema = new Schema({
  month: Number,
  year: Number,
  itsf: Number,
  combined: Number,
}, {
  _id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

export const RatingSchema = new Schema({
  os: RatingItemShema,
  od: RatingItemShema,
  dyp: Number,
  combined: Number,
}, {
  _id: false,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});
