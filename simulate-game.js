
const playersShot = probabilityArray => {
  if (!Array.isArray(probabilityArray) ||
      probabilityArray.length !== 100) {
    return null
  }

  return probabilityArray[Math.floor(Math.random() * 100)]
}

// Batting team wins by some wickets
// Bowling team wins by some runs

// updates the match state and returns the match status
const playABall = (result, matchState) => {
  // player on strike plays the ball (StateUpdate)
  matchState.playerOnStrike.ballsPlayed += 1
  matchState.battingTeam.ballsPlayed += 1

  if (result === 7) {
    // player on strike is out (StateUpdate)
    matchState.battingTeam.playersOut.push(matchState.playerOnStrike)

    if (matchState.battingTeam.players.length > 0) {
      // next player comes on strike (StateUpdate)
      matchState.playerOnStrike = matchState.battingTeam.players.shift()
    } else {
      // match is over, bowling team wins by runs required
      // return `${matchState.bowlingTeam.name} won by ${matchState.requiredRuns - matchState.battingTeam.runs} runs and ${(matchState.remainingOvers * 6) - matchState.battingTeam.ballsPlayed} balls remaining`
    }
  } else {
    // player scores 0 to 6 runs (StateUpdate)
    matchState.playerOnStrike.runs += result
    matchState.battingTeam.runs += result

    if (result % 2 === 1) {
      // switch the strike (StateUpdate)
      [
        matchState.playerOnStrike,
        matchState.playerOnNonStrike
      ] = [
        matchState.playerOnNonStrike,
        matchState.playerOnStrike
      ]
    }

    if (matchState.battingTeam.runs >= matchState.requiredRuns) {
      // match is over, batting team wins by wickets left
      // return `${}`
    }
  }

  return false
}

function logMatchState (matchState) {
  console.log(matchState)
}

// simulate game
const SimulateCricketMatch = (matchState) => {
  // play each over
  while (matchState.battingTeam.oversPlayed < matchState.remainingOvers) {
    // start an over (StateUpdate)
    matchState.battingTeam.oversPlayed += 1

    // reset the ballsPlayed for each new over
    let ballsPlayed = 0

    // play 6 balls for an over
    while (ballsPlayed <= 6) {
      ballsPlayed += 1 // ball

      const result = playersShot(matchState.playerOnStrike.probabilityArray)
      const matchStatus = playABall(result, matchState)

      // log the balls' status after each ball played
      // check match state
    }

    // log the overs' status after each over
  }

  // check the final state of the game (probably bowling team wins)
  logMatchState(matchState)

  return matchState
}

module.exports = { SimulateCricketMatch, playersShot }
