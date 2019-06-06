const { distributeProbability, getStdInput, parseData, validateData } = require('./library')
const Player = require('./Player')
const CricketGame = require('./CricketGame')

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

  const T20Finals = new CricketGame(
    battingTeam,
    bowlingTeam,
    overs,
    runsTarget,
    battingTeam.playersPlayed[0],
    battingTeam.playersPlayed[1]
  )

  T20Finals.onBallPlayed = console.log
  T20Finals.onOverPlayed = console.log
  T20Finals.onGameEnd = console.log

  T20Finals.start()
}

// accept the input from stdin and pass main callback to accept
getStdInput(main)
