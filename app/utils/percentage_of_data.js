var ranges = {
  2007: [ 91, 274 ],
  2008: [ 85, 274 ],
  2009: [ 95, 279 ],
  2010: [ 94, 276 ],
  2011: [ 90, 271 ],
  2012: [ 88, 277 ]
};

var seasons = Object.keys(ranges).map(Number);

function precision(n, p) {
  return Math.floor(n * p) / p;
}

function normalizeDay(dayOfYear, season) {
  var range = ranges[season];

  if (!range) { throw new Error('Unknown Season: ' + season); }

  var start = range[0];
  var end = range[1];

  var totalGameDaysInSeason = end - start;
  var normalizedGameDay = dayOfYear - start;

  return normalizedGameDay;
}

function percentageOfSeason(dayOfYear, season) {
  var range = ranges[season];

  if (!range) { throw new Error('Unknown Season: ' + season); }

  var start = range[0];
  var end = range[1];

  var totalGameDaysInSeason = end - start;
  var normalizedGameDay = normalizeDay(dayOfYear, season);

  return precision(normalizedGameDay / totalGameDaysInSeason, 100);
}

function percentageOfData(dayOfYear, season) {
  var range = ranges[season];
  if (!range) { throw new Error('Unknown Season: ' + season); }

  var index = seasons.indexOf(season);
  var normalizedGameDay = normalizeDay(dayOfYear, season);

  var proportion = ((index * 180) + normalizedGameDay) / 1108;
  return precision(proportion, 100);
}

export { percentageOfSeason, percentageOfData , precision };
