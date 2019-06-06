const { SimulateCricketMatch } = require('./simulate-game')
const { distributeProbability, getStdInput, parseData, validateData } = require('./library')
const Player = require('./Player')

/*
  accepts user input (current cricket game state) in string format
 */
function main (input) {
  const [
    battingTeamName,
    bowlingTeamName,
    overs,
    playersRemaining,
    runsTarget,
    playersData
  ] = parseData(input)

  const isValid = validateData(
    battingTeamName,
    bowlingTeamName,
    overs,
    playersRemaining,
    runsTarget,
    playersData
  )

  if (!isValid) {
    throw new Error('Invalid input')
  }

  // set initial state of the match
  const players = playersData
    .map(pd => (new Player(pd[0], distributeProbability(pd[1]))))

  const battingTeam = {
    name: battingTeamName,
    playersQueue: players,
    playersPlayed: [players.shift(), players.shift()],
    ballsPlayed: 0,
    oversPlayed: 0,
    runs: 0
  }

  const bowlingTeam = { name: bowlingTeamName }

  const matchState = {
    battingTeam,
    bowlingTeam,
    overs,
    runsTarget,
    playerOnStrike: battingTeam.playersPlayed[0],
    playerOnNonStrike: battingTeam.playersPlayed[1]
  }

  const result = SimulateCricketMatch(matchState)
}

// accept the input from stdin and pass main callback to accept
getStdInput(main)
