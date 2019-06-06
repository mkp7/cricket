const {
  getBattingTeamWinSummary,
  getBowlingTeamWinSummary,
  getBatsmenSummary,
  getOverSummary,
  getBallSummary,
  simulateBall
} = require('./library')

const noOp = () => {}

function swapPlayersStrike (game) {
  [
    game.playerOnStrike,
    game.playerOnNonStrike
  ] = [
    game.playerOnNonStrike,
    game.playerOnStrike
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
    const batsmenSummary = getBatsmenSummary(this.battingTeam.playersPlayed)

    if (this.battingTeam.runs >= this.runsTarget) {
      const battingTeamWon = getBattingTeamWinSummary(
        this.battingTeam.name,
        this.battingTeam.playersQueue.length + 1,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      this.onGameEnd(`${battingTeamWon}${batsmenSummary}`)

      return true
    }

    if (this.battingTeam.oversPlayed === this.overs) {
      if (this.battingTeam.runs === this.runsTarget - 1) {
        this.onGameEnd(`Match tied.\n${batsmenSummary}`)
        return true
      }

      const bowlingTeamWon = getBowlingTeamWinSummary(
        this.bowlingTeam.name,
        this.runsTarget - 1 - this.battingTeam.runs,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      this.onGameEnd(`${bowlingTeamWon}${batsmenSummary}`)

      return true
    }

    if (this.playerOnStrike.isOut) {
      const bowlingTeamWon = getBowlingTeamWinSummary(
        this.bowlingTeam.name,
        this.runsTarget - 1 - this.battingTeam.runs,
        (this.overs * 6) - this.battingTeam.ballsPlayed
      )
      this.onGameEnd(`${bowlingTeamWon}${batsmenSummary}`)

      return true
    }

    return false
  }

  this.playBall = function playBall () {
    const result = simulateBall(this.playerOnStrike.scoreProbabilities)
    this.gameUpdate(result)
  }

  this.playOver = function playOver (ballsPlayed) {
    if (this.isEnded()) {
      return false
    }

    if (ballsPlayed === 6) {
      swapPlayersStrike(this)
      return true
    }

    this.playBall()

    return this.playOver(ballsPlayed + 1)
  }

  this.playerOutUpdate = function playerOutUpdate (result) {
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
    }
  }

  this.runsUpdate = function runsUpdate (runs) {
    this.playerOnStrike.runs += runs
    this.battingTeam.runs += runs

    this.onBallPlayed(getBallSummary(
      this.playerOnStrike,
      runs,
      this.battingTeam.oversPlayed,
      this.battingTeam.ballsPlayed % 6
    ))

    if (runs % 2 === 1) {
      swapPlayersStrike(this)
    }
  }

  this.ballsUpdate = function ballsUpdate () {
    this.playerOnStrike.ballsPlayed += 1
    this.battingTeam.ballsPlayed += 1
  }

  this.gameUpdate = function gameUpdate (result) {
    this.ballsUpdate()

    if (result === 7) {
      this.playerOutUpdate(result)
    } else {
      this.runsUpdate(result)
    }
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
