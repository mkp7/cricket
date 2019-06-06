const {
  getBattingTeamWonString,
  getBowlingTeamWonString,
  getBatsmenSummary,
  getOverSummary,
  getBallSummary,
  playBall
} = require('./library')

const noOp = () => {}

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

  this.onBallPlayed = noOp
  this.onOverPlayed = noOp
  this.onGameEnd = noOp

  this.playBall = function playBall () {}
  this.playOver = function playOver () {}

  this.updateMatchState = function updateMatchState (result) {
    this.playerOnStrike.ballsPlayed += 1
    this.battingTeam.ballsPlayed += 1

    if (result === 7) {
      this.playerOnStrike.isOut = true

      this.onBallPlayed(getBallSummary(
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

      this.onBallPlayed(getBallSummary(
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

    this.onOverPlayed(getOverSummary(
      this.overs - this.battingTeam.oversPlayed,
      this.runsTarget - this.battingTeam.runs))
    while (this.battingTeam.oversPlayed < this.overs) {
      let ballsPlayed = 0

      while (ballsPlayed < 6) {
        const result = playBall(this.playerOnStrike.scoreProbabilities)
        matchStatus = this.updateMatchState(result, this)

        if (matchStatus !== false) {
          this.onGameEnd(`${matchStatus}${getBatsmenSummary(this.battingTeam.playersPlayed)}`)
          return
        }

        ballsPlayed += 1
      }

      swapPlayers(this)

      this.battingTeam.oversPlayed += 1
      this.onOverPlayed(getOverSummary(
        this.overs - this.battingTeam.oversPlayed,
        this.runsTarget - this.battingTeam.runs)
      )
    }

    matchStatus = getBowlingTeamWonString(
      this.bowlingTeam.name,
      this.runsTarget - 1 - this.battingTeam.runs,
      (this.overs * 6) - this.battingTeam.ballsPlayed
    )
    this.onGameEnd(`${matchStatus}${getBatsmenSummary(this.battingTeam.playersPlayed)}`)
  }
}

module.exports = CricketGame
