function getBattingTeamWonString (team, wickets, balls) {
  const wicketString = wickets > 1 ? 'wickets' : 'wicket'
  const ballsString = balls > 1 ? 'balls' : 'ball'

  return `${team} won by ${wickets} ${wicketString} and ${balls} ${ballsString} remaining`
}

function getBowlingTeamWonString (team, runs, balls) {
  const runsString = runs > 1 ? 'runs' : 'run'
  const ballsString = balls > 1 ? 'balls' : 'ball'

  return `${team} won by ${runs} ${runsString} and ${balls} ${ballsString} remaining`
}

function getBatsmanSummary (player) {
  const ballsString = player.ballsPlayed > 1 ? 'balls' : 'ball'
  const notOutStar = player.isOut ? '' : '*'

  return `${player.name} - ${player.runs}${notOutStar} (${player.ballsPlayed} ${ballsString})`
}

function getOverSummary (oversLeft, runsRemaining) {
  const oversString = oversLeft > 1 ? 'overs' : 'over'
  const runsString = runsRemaining > 1 ? 'runs' : 'run'

  return `${oversLeft} ${oversString} left. ${runsRemaining} ${runsString} to win`
}

function getBallSummary (player, result, overs, balls) {
  if (result === 7) {
    return `${overs}.${balls === 0 ? 6 : balls} ${player.name} got out`
  }

  const runsString = result > 1 ? 'runs' : 'run'
  return `${overs}.${balls === 0 ? 6 : balls} ${player.name} scores ${result} ${runsString}`
}

function playBall (probabilityArray) {
  if (!Array.isArray(probabilityArray) ||
      probabilityArray.length !== 100) {
    return null
  }

  return probabilityArray[Math.floor(Math.random() * 100)]
}

/*
 Accumulates data from stdin in string format
 and calls callback with data
 */
function getStdInput (cb) {
  let inputString = ''
  process.stdin.on('data', data => (inputString += data))
  process.stdin.on('end', () => cb(inputString))
}

/*
 formats(parses) the string data to be passed to game simulation function
 */
function parseData (data) {
  const inputLines = data.split('\n')

  const battingTeam = inputLines.shift()
  const bowlingTeam = inputLines.shift()
  const [
    overs,
    playersRemaining,
    runsTarget
  ] = inputLines.shift()
    .split(' ')
    .map(d => parseInt(d))

  const playersProbabilities = []
  for (let i = 0; i < playersRemaining * 2; i += 2) {
    playersProbabilities.push(
      [
        inputLines[i],
        inputLines[i + 1].split(' ').map(d => parseInt(d))
      ]
    )
  }

  return [
    battingTeam,
    bowlingTeam,
    overs,
    playersRemaining,
    runsTarget,
    playersProbabilities
  ]
}

/*
 validates the parsed data
 */
function validateData (
  battingTeam,
  bowlingTeam,
  overs,
  playersRemaining,
  runsTarget,
  playersData
) {
  if (typeof battingTeam !== 'string' ||
      typeof bowlingTeam !== 'string') {
    return false
  }

  if ([overs,
    playersRemaining,
    runsTarget]
    .some(isNaN)) {
    return false
  }

  if (playersData.length !== playersRemaining ||
    playersData.some(([name, prob]) => (
      typeof name !== 'string' ||
      prob.length !== 8 ||
      prob.some(isNaN)
    ))
  ) {
    return false
  }

  return true
}

function distributeProbability (probabilities) {
  return probabilities
    .map((p, i) => (new Array(p).fill(i)))
    .reduce((a, b) => [...a, ...b])
}
module.exports = {
  getBattingTeamWonString,
  getBowlingTeamWonString,
  getBatsmanSummary,
  getOverSummary,
  getBallSummary,
  playBall,
  getStdInput,
  parseData,
  validateData,
  distributeProbability
}
