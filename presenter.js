const {
  getBallSummary,
  getOverSummary,
  getBatsmenSummary,
  getBattingTeamWinSummary,
  getBowlingTeamWinSummary
} = require('./library')

function onBallPlayed (game) {
  console.log(getBallSummary(
    game.playerOnStrike,
    game.ballProb,
    game.battingTeam.oversPlayed,
    game.battingTeam.ballsPlayed % 6
  ))
}

function onOverPlayed (game) {
  console.log(getOverSummary(
    game.overs - game.battingTeam.oversPlayed,
    game.runsTarget - game.battingTeam.runs
  ))
}

function onGameEnd (game) {
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

module.exports = {
  onBallPlayed,
  onOverPlayed,
  onGameEnd
}
