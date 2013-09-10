var ranges = {
  2006: [92, 274],
  2007: [91, 274],
  2008: [85, 274],
  2009: [95, 279],
  2010: [94, 276],
  2011: [90, 271],
  2012: [88, 277]
};

var seasons = Object.keys(ranges).map(Number);

function precision(n, p) {
  return Math.floor(n * p) / p;
}

function percentageOfSeason(dayOfYear, season) {
  var range = ranges[season];

  if (!range) { throw new Error("Unknown Season: " + season); }

  var start = range[0];
  var end = range[1];
  // normalize

  var totalGameDaysInSeason = end - start;
  var normalizedGameDay = dayOfYear - start;

  return precision(normalizedGameDay / totalGameDaysInSeason, 100);
}

function percentageOfData(dayOfYear, season) {
  var index = seasons.indexOf(season);

  return precision(percentageOfSeason(dayOfYear, season) * ((index + 1) / seasons.length), 100);
}

export { percentageOfSeason, percentageOfData , precision };
