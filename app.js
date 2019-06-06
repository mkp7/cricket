const { SimulateCricketMatch } = require('./simulate-game')
const { distributeProbability, getStdInput, parseData, validateData } = require('./library')
const Player = require('./Player')

/*
  accepts user input (current cricket game state) in string format
  example: main(`4 4 40
20 20 20 20 10 10
20 20 20 20 10 10
20 20 20 20 10 10
20 20 20 20 10 10`)
  formats and validates the input data
  and simulates the game which generates the result,
  returns the formatted result in string format
 */
function main (input) {
  // set initial state of the match
  const playersData = [
    ['Kirat Boli', [5, 30, 25, 10, 15, 1, 9, 5]],
    ['N.S Nodhi', [10, 40, 20, 5, 10, 1, 4, 10]],
    ['R Rumrah', [20, 30, 15, 5, 5, 1, 4, 20]],
    ['Shashi Henra', [30, 25, 5, 0, 5, 1, 4, 30]]
  ]

  const players = playersData
    .map(pd => (new Player(pd[0], distributeProbability(pd[1]))))

  const battingTeam = {
    name: 'RCB',
    playersQueue: players,
    playersPlayed: [players.shift(), players.shift()],
    ballsPlayed: 0,
    oversPlayed: 0,
    runs: 0
  }

  const bowlingTeam = { name: 'CSK' }

  const overs = 4
  const runsTarget = 40

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
