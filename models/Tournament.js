import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';

import { ResultTC } from './Result';


export const TournamentSchema = new Schema({
  name: String,
  date: Number,
  title: String,
  weight: String,
  city: String,
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
      filter: (source) => ({ tournamenID: source._id.toString() }),
      sort: { place: 1 },
    },
    projection: { _id: true },
  })
);

TournamentTC.addFields({
  foo: {
    type: 'String',
    resolve: (source) => {
      console.log(source)
      return `${source.title} ${source.date}`
    },
    projection: { title: true, date: true },
  }
})
