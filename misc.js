// accumulates data from stdin in string format
// and calls callback with data
const getStdInput = (cb) => {
  let inputString = ''
  process.stdin.on('data', data => (inputString += data))
  process.stdin.on('end', () => cb(inputString))
}

// formats(parses) the string data to be passed to game simulation function
const formatData = (data) => {
  const inputLines = data.split('\n')

  // parses RemainingOvers, RemainingPlayers, RequiredRuns into integer
  const [
    RemainingOvers,
    RemainingPlayers,
    RequiredRuns
  ] = inputLines[0]
    .split(' ')
    .map(d => parseInt(d))

  // parses probabilities of each player into integer
  const PlayersProbabilities = inputLines
    .slice(1)
    .map(probData => probData
      .split(' ')
      .map(d => parseInt(d))
    )

  return [
    RemainingOvers,
    RemainingPlayers,
    RequiredRuns,
    PlayersProbabilities
  ]
}

// validates the parsed data
const validateData = (
  RemainingOvers,
  RemainingPlayers,
  RequiredRuns,
  PlayersProbabilities) => {
  // validates RemainingOvers, RemainingPlayers, RequiredRuns
  if ([RemainingOvers,
    RemainingPlayers,
    RequiredRuns]
    .some(isNaN)) {
    return false
  }

  // validates probabilities of each player
  if (PlayersProbabilities.length !== RemainingPlayers ||
    PlayersProbabilities.some(d => (
      d.length !== 6 ||
      d.some(isNaN)
    ))
  ) {
    return false
  }

  return true
}

module.exports = { getStdInput, formatData, validateData }
