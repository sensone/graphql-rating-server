const K = {
  WEEK: 1,
  MONTH: 4,
  YEAR: 8,
  ITSF: 16,
  V: 10
}

// Points = S*((N-P)+(V/P)), где
// N – количество участников турнира (поле Quantity)
// Р – место занятое участником
// V – постоянная вариативности (по умолчанию = 10)
// S – сложность турнира ( поле Score Type)
//points = K[tournament.weight] * ((PLAYERS_COUNT - PLACE) + (K.V / PLACE))
export function getPoints(tournament, place) {
  return K[tournament.weight] * ((tournament.players_count - place) + (K.V / place));
}

export function getOneYearBefore() {
  let oneYearBefore = new Date();

  oneYearBefore.setYear(1900 + oneYearBefore.getYear() - 1);
  oneYearBefore.setHours(0, 0, 0, 0);

  return oneYearBefore;
}
