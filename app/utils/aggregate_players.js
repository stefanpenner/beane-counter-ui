function aggregatePlayers(players) {
  var result = { };

  players.forEach(function(entry) {
    var code = entry.PlayerCode;
    var player = result[code] = result[code] || {
      name: entry.PlayerName,
      code: code,
      seasons: {}
    };

    player.seasons[entry.Year] = entry;
  });

  return result;
}

export default aggregatePlayers;
