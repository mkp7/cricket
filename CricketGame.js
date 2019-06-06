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

function CricketGame (
  battingTeam,
  bowlingTeam,
  overs,
  runsTarget,
  playerOnStrike,
  playerOnNonStrike
) {
  this.battingTeam = battingTeam
  this.bowlingTeam = bowlingTeam
  this.overs = overs
  this.runsTarget = runsTarget
  this.playerOnStrike = playerOnStrike
  this.playerOnNonStrike = playerOnNonStrike
  this.onBallPlayed = function () {}
  this.onOverPlayed = function () {}
  this.onGameEnd = function () {}
  this.playBall = function playBall () {}
  this.playOver = function playOver () {}
  this.updateMatchState = function updateMatchState (result) {
    this.playerOnStrike.ballsPlayed += 1
    this.battingTeam.ballsPlayed += 1

    if (result === 7) {
      this.playerOnStrike.isOut = true

      console.log(getBallSummary(
        this.playerOnStrike,
        result,
        this.battingTeam.oversPlayed,
        this.battingTeam.ballsPlayed % 6
      ))

      if (this.battingTeam.playersQueue.length > 0) {
        this.playerOnStrike = this.battingTeam.playersQueue.shift()
        this.battingTeam.playersPlayed.push(this.playerOnStrike)
      } else {
        return getBowlingTeamWonString(
          this.bowlingTeam.name,
          this.runsTarget - 1 - this.battingTeam.runs,
          (this.overs * 6) - this.battingTeam.ballsPlayed
        )
      }
    } else {
      this.playerOnStrike.runs += result
      this.battingTeam.runs += result

      console.log(getBallSummary(
        this.playerOnStrike,
        result,
        this.battingTeam.oversPlayed,
        this.battingTeam.ballsPlayed % 6
      ))

      if (result % 2 === 1) {
        swapPlayers(this)
      }

      if (this.battingTeam.runs >= this.runsTarget) {
        return getBattingTeamWonString(
          this.battingTeam.name,
          this.battingTeam.playersQueue.length + 1,
          (this.overs * 6) - this.battingTeam.ballsPlayed)
      }
    }

    return false
  }
  this.start = function start () {
    let matchStatus = false

    console.log(getOverSummary(
      this.overs - this.battingTeam.oversPlayed,
      this.runsTarget - this.battingTeam.runs))
    console.log()
    while (this.battingTeam.oversPlayed < this.overs) {
      let ballsPlayed = 0

      while (ballsPlayed < 6) {
        const result = playBall(this.playerOnStrike.scoreProbabilities)
        matchStatus = this.updateMatchState(result, this)

        if (matchStatus !== false) {
          console.log()
          console.log(matchStatus)
          this.battingTeam.playersPlayed.forEach(p => console.log(getBatsmanSummary(p)))
          return
        }

        ballsPlayed += 1
      }

      swapPlayers(this)

      this.battingTeam.oversPlayed += 1
      console.log()
      console.log(getOverSummary(
        this.overs - this.battingTeam.oversPlayed,
        this.runsTarget - this.battingTeam.runs))
      console.log()
    }

    matchStatus = getBowlingTeamWonString(
      this.bowlingTeam.name,
      this.runsTarget - 1 - this.battingTeam.runs,
      (this.overs * 6) - this.battingTeam.ballsPlayed
    )
    console.log()
    console.log(matchStatus)
    this.battingTeam.playersPlayed.forEach(p => console.log(getBatsmanSummary(p)))
  }
}

module.exports = CricketGame
