import mongoose, { Schema } from 'mongoose';
import composeWithMongoose from 'graphql-compose-mongoose';
import composeWithRelay from 'graphql-compose-relay';
import { GraphQLFloat, GraphQLInt, GraphQLString } from 'graphql';

import { TournamentTC, Tournament } from './Tournament';
import { TournamentForPlayerTC, getTournamentsForPlayer } from './TournamentForPlayer';
import { RatingTC } from './Rating';

export const PlayerSchema = new Schema({
  name: String,
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  city: String
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
      _id: GraphQLString
    },
  },

  rating: {
    type: RatingTC,
    resolve: async (source) => {
      const RESULTS = await getTournamentsForPlayer(source);
      let dypResults = RESULTS.filter((result) => result.operable && result.weight === 'WEEK')
        .sort((a, b) => b.result.points - a.result.points)
        .slice(0, 10);
      const OS = filterResults(RESULTS, 'OS');
      const OD = filterResults(RESULTS, 'OD');
      const DYP = getTotal(dypResults);

      return {
        OS: OS,
        OD: OD,
        DYP: DYP,
        COMBINED: OS + OD + DYP,
      }
    },
    args: {
      _id: GraphQLString
    },
  },
});

function getTotal(results) {
  return results.reduce((sum, a) => {
    const RESULT_A = a.result || { points: 0 };

    return RESULT_A.points + sum;
  }, 0);
}

function filterResults(results, type) {
  let yearResults = results.filter((result) => result.operable && result.type === type && result.weight === 'YEAR');
  let monthResults = results.filter((result) => result.operable && result.type === type && result.weight === 'MONTH')
    .sort((a, b) => b.result.points - a.result.points)
    .slice(0, 4);
  let itsfResults = results.filter((result) => result.operable && result.type === type && result.weight === 'ITSF')
    .sort((a, b) => b.result.points - a.result.points)
    .slice(0, 2);

  const totalItsf = getTotal(itsfResults);
  const totalMonth = getTotal(monthResults);
  const totalYear = getTotal(yearResults);

  return totalItsf + totalMonth + totalYear;
}
