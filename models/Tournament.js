import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

export const TournamentSchema = new Schema({
  name: String,
  date: Number,
  title: String,
  weight: String,
  city: String
},
{
  collection: 'tournaments'
});

export const Tournament = mongoose.model('Tournament', TournamentSchema);
export const TournamentTC = composeWithRelay(composeWithMongoose(Tournament));
