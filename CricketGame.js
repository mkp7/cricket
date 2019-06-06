const {
  getBattingTeamWonString,
  getBowlingTeamWonString,
  getBatsmenSummary,
  getOverSummary,
  getBallSummary,
  simulateBall
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

  this.isEnded = function isEnded () {
    if (this.battingTeam.runs >= this.runsTarget) {
      const battingTeamWon = getBattingTeamWonString(
        this.battingTeam.name,
        this.battingTeam.playersQueue.length + 1,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      const batsmenSummary = getBatsmenSummary(this.battingTeam.playersPlayed)
      this.onGameEnd(`${battingTeamWon}${batsmenSummary}`)

      return true
    }

    if (this.battingTeam.oversPlayed === this.overs) {
      if (this.battingTeam.runs === this.runsTarget - 1) {
        // match tied
        return true
      }

      const bowlingTeamWon = getBowlingTeamWonString(
        this.bowlingTeam.name,
        this.runsTarget - 1 - this.battingTeam.runs,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      const batsmenSummary = getBatsmenSummary(this.battingTeam.playersPlayed)
      this.onGameEnd(`${bowlingTeamWon}${batsmenSummary}`)

      return true
    }

    if (this.playerOnStrike.isOut) {
      const bowlingTeamWon = getBowlingTeamWonString(
        this.bowlingTeam.name,
        this.runsTarget - 1 - this.battingTeam.runs,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      const batsmenSummary = getBatsmenSummary(this.battingTeam.playersPlayed)
      this.onGameEnd(`${bowlingTeamWon}${batsmenSummary}`)

      return true
    }

    return false
  }

  this.playBall = function playBall () {}
  this.playOver = function playOver (ballsPlayed) {
    if (this.isEnded()) {
      return false
    }
    if (ballsPlayed === 6) {
      swapPlayers(this)
      return true
    }
    const result = simulateBall(this.playerOnStrike.scoreProbabilities)
    this.updateMatchState(result, this)

    return this.playOver(ballsPlayed + 1)
  }

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
          (this.overs * 6) - this.battingTeam.ballsPlayed
        )
      }
    }

    return false
  }

  this.start = function start () {
    this.onOverPlayed(getOverSummary(
      this.overs - this.battingTeam.oversPlayed,
      this.runsTarget - this.battingTeam.runs
    ))

    while (this.battingTeam.oversPlayed < this.overs &&
      this.playOver(0)) {
      this.battingTeam.oversPlayed += 1
      this.onOverPlayed(getOverSummary(
        this.overs - this.battingTeam.oversPlayed,
        this.runsTarget - this.battingTeam.runs
      ))
    }
  }
}

module.exports = CricketGame
