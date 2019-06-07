const {
  distributeProbability,
  getStdInput,
  parseData,
  validateData,
  getBallSummary,
  getOverSummary,
  getBatsmenSummary,
  getBattingTeamWinSummary,
  getBowlingTeamWinSummary
} = require('./library')
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

  T20Finals.onBallPlayed = game => {
    console.log(getBallSummary(
      game.playerOnStrike,
      game.ballProb,
      game.battingTeam.oversPlayed,
      game.battingTeam.ballsPlayed % 6
    ))
  }
  T20Finals.onOverPlayed = game => {
    console.log(getOverSummary(
      game.overs - game.battingTeam.oversPlayed,
      game.runsTarget - game.battingTeam.runs
    ))
  }
  T20Finals.onGameEnd = game => {
    const batsmenSummary = getBatsmenSummary(game.battingTeam.playersPlayed)

    if (game.battingTeam.runs >= game.runsTarget) {
      const battingTeamWon = getBattingTeamWinSummary(
        game.battingTeam.name,
        game.battingTeam.playersQueue.length + 1,
        (game.overs * 6) - game.battingTeam.ballsPlayed
      )
      console.log(`${battingTeamWon}${batsmenSummary}`)

      return
    }

    if (game.battingTeam.oversPlayed === game.overs) {
      if (game.battingTeam.runs === game.runsTarget - 1) {
        console.log(`Match tied.\n${batsmenSummary}`)
        return
      }

      const bowlingTeamWon = getBowlingTeamWinSummary(
        game.bowlingTeam.name,
        game.runsTarget - 1 - game.battingTeam.runs,
        (game.overs * 6) - game.battingTeam.ballsPlayed
      )
      console.log(`${bowlingTeamWon}${batsmenSummary}`)

      return
    }

    if (game.playerOnStrike.isOut) {
      const bowlingTeamWon = getBowlingTeamWinSummary(
        game.bowlingTeam.name,
        game.runsTarget - 1 - game.battingTeam.runs,
        (game.overs * 6) - game.battingTeam.ballsPlayed
      )
      console.log(`${bowlingTeamWon}${batsmenSummary}`)
    }
  }

  T20Finals.start()
}

// accept the input from stdin and pass main callback to accept
getStdInput(main)
