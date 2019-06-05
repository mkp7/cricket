const {
  getBattingTeamWonString,
  getBowlingTeamWonString,
  getBatsmanSummary,
  getOverSummary,
  getBallSummary,
  playBall
} = require('./library')

function swapPlayers (matchState) {
  [
    matchState.playerOnStrike,
    matchState.playerOnNonStrike
  ] = [
    matchState.playerOnNonStrike,
    matchState.playerOnStrike
  ]
}

/*
  updates the match state for each ball played and returns the match status
 */
function updateMatchState (result, matchState) {
  matchState.playerOnStrike.ballsPlayed += 1
  matchState.battingTeam.ballsPlayed += 1

  if (result === 7) {
    matchState.playerOnStrike.isOut = true

    console.log(getBallSummary(
      matchState.playerOnStrike,
      result,
      matchState.battingTeam.oversPlayed,
      matchState.battingTeam.ballsPlayed % 7
    ))

    if (matchState.battingTeam.playersQueue.length > 0) {
      matchState.playerOnStrike = matchState.battingTeam.playersQueue.shift()
      matchState.battingTeam.playersPlayed.push(matchState.playerOnStrike)
    } else {
      return getBowlingTeamWonString(
        matchState.bowlingTeam.name,
        matchState.runsTarget - 1 - matchState.battingTeam.runs,
        (matchState.overs * 6) - matchState.battingTeam.ballsPlayed
      )
    }
  } else {
    matchState.playerOnStrike.runs += result
    matchState.battingTeam.runs += result

    console.log(getBallSummary(
      matchState.playerOnStrike,
      result,
      matchState.battingTeam.oversPlayed,
      matchState.battingTeam.ballsPlayed % 7
    ))

    if (result % 2 === 1) {
      swapPlayers(matchState)
    }

    if (matchState.battingTeam.runs >= matchState.runsTarget) {
      return getBattingTeamWonString(
        matchState.battingTeam.name,
        matchState.battingTeam.playersQueue.length + 1,
        (matchState.overs * 6) - matchState.battingTeam.ballsPlayed)
    }
  }

  return false
}

/*
 simulate game
 */
function SimulateCricketMatch (matchState) {
  let matchStatus = false

  console.log(getOverSummary(
    matchState.overs - matchState.battingTeam.oversPlayed,
    matchState.runsTarget - matchState.battingTeam.runs))
  console.log()
  while (matchState.battingTeam.oversPlayed < matchState.overs) {
    let ballsPlayed = 0

    while (ballsPlayed < 6) {
      const result = playBall(matchState.playerOnStrike.scoreProbabilities)
      matchStatus = updateMatchState(result, matchState)

      if (matchStatus !== false) {
        console.log()
        console.log(matchStatus)
        matchState.battingTeam.playersPlayed.forEach(p => console.log(getBatsmanSummary(p)))
        return matchState
      }

      ballsPlayed += 1
    }

    swapPlayers(matchState)

    matchState.battingTeam.oversPlayed += 1
    console.log()
    console.log(getOverSummary(
      matchState.overs - matchState.battingTeam.oversPlayed,
      matchState.runsTarget - matchState.battingTeam.runs))
    console.log()
  }

  matchStatus = getBowlingTeamWonString(
    matchState.bowlingTeam.name,
    matchState.runsTarget - 1 - matchState.battingTeam.runs,
    (matchState.overs * 6) - matchState.battingTeam.ballsPlayed
  )
  console.log()
  console.log(matchStatus)
  matchState.battingTeam.playersPlayed.forEach(p => console.log(getBatsmanSummary(p)))

  return matchState
}

module.exports = { SimulateCricketMatch, playBall }
