import { Player } from '../models/Player';
import { getTournamentsForPlayer } from '../models/TournamentForPlayer';


export function test() {
  Player.find(function (err, players) {
    if (err) console.log(err);
    players.forEach((player) => updateRatingForPlayer(player));
    console.log('updated')
  });
}

async function updateRatingForPlayer(player) {
  const resultsForPlayer = await getTournamentsForPlayer(player);
  const OS_MONTH_RESULT = filterResultsForType(resultsForPlayer, 'OS', 'MONTH', 4);
  const OS_YEAR_RESULT = filterResultsForType(resultsForPlayer, 'OS', 'YEAR', 1);
  const OS_ITSF_RESULT = filterResultsForType(resultsForPlayer, 'OS', 'ITSF', 2);
  const OS_COMBINED = OS_MONTH_RESULT + OS_YEAR_RESULT + OS_ITSF_RESULT;
  const OD_MONTH_RESULT = filterResultsForType(resultsForPlayer, 'OD', 'MONTH', 4);
  const OD_YEAR_RESULT = filterResultsForType(resultsForPlayer, 'OD', 'YEAR', 1);
  const OD_ITSF_RESULT = filterResultsForType(resultsForPlayer, 'OD', 'ITSF', 2);
  const OD_COMBINED = OD_MONTH_RESULT + OD_YEAR_RESULT + OD_ITSF_RESULT;

  const DYP_RESULT = filterResultsForType(resultsForPlayer, 'DYP', 'WEEK', 10);

  const rating = {
    os: {
      month: OS_MONTH_RESULT,
      year: OS_YEAR_RESULT,
      itsf: OS_ITSF_RESULT,
      combined: OS_COMBINED,
    },
    od: {
      month: OD_MONTH_RESULT,
      year: OD_YEAR_RESULT,
      itsf: OD_ITSF_RESULT,
      combined: OD_COMBINED,
    },
    dyp: DYP_RESULT,
    combined: OS_COMBINED + OD_COMBINED + DYP_RESULT,
  };

  await Player.update({ _id: player._id }, { $set: { rating: rating }}, function(err, player) {
    if (err) console.log(err);
  })
}

function getTotal(results) {
  return results.reduce((sum, a) => {
    const RESULT_A = a.result || { points: 0 };

    return RESULT_A.points + sum;
  }, 0);
}

function filterResultsForType(results, type, weight, tournamentsCount) {
  let filteredResults = results.filter((result) => result.operable && result.type === type && result.weight === weight)
    .sort((a, b) => b.result.points - a.result.points)
    .slice(0, tournamentsCount);

   return getTotal(filteredResults);
}
