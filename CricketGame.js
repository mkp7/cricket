const { simulateBall } = require('./library')

const noOp = () => {}

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

  this.ballProb = null

  this.onBallPlayed = noOp
  this.onOverPlayed = noOp
  this.onGameEnd = noOp

  this.swapPlayersStrike = function swapPlayersStrike (game) {
    [
      game.playerOnStrike,
      game.playerOnNonStrike
    ] = [
      game.playerOnNonStrike,
      game.playerOnStrike
    ]
  }

  this.isEnded = function isEnded () {
    if (this.battingTeam.runs >= this.runsTarget) {
      this.onGameEnd(this)
      return true
    }

    if (this.battingTeam.oversPlayed === this.overs) {
      if (this.battingTeam.runs === this.runsTarget - 1) {
        this.onGameEnd(this)
        return true
      }

      this.onGameEnd(this)
      return true
    }

    if (this.playerOnStrike.isOut) {
      this.onGameEnd(this)
      return true
    }

    return false
  }

  this.playBall = function playBall () {
    this.ballProb = simulateBall(this.playerOnStrike.scoreProbabilities)
    this.gameUpdate()
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

  this.playerOutUpdate = function playerOutUpdate () {
    this.playerOnStrike.isOut = true

    this.onBallPlayed(this)

    if (this.battingTeam.playersQueue.length > 0) {
      this.playerOnStrike = this.battingTeam.playersQueue.shift()
      this.battingTeam.playersPlayed.push(this.playerOnStrike)
    }
  }

  this.runsUpdate = function runsUpdate () {
    this.playerOnStrike.runs += this.ballProb
    this.battingTeam.runs += this.ballProb

    this.onBallPlayed(this)

    if (this.ballProb % 2 === 1) {
      swapPlayersStrike(this)
    }
  }

  this.ballsUpdate = function ballsUpdate () {
    this.playerOnStrike.ballsPlayed += 1
    this.battingTeam.ballsPlayed += 1
  }

  this.gameUpdate = function gameUpdate () {
    this.ballsUpdate()

    if (this.ballProb === 7) {
      this.playerOutUpdate()
    } else {
      this.runsUpdate()
    }
  }

  this.start = function start () {
    this.onOverPlayed(this)

    while (this.playOver(0)) {
      this.battingTeam.oversPlayed += 1
      this.onOverPlayed(this)
    }
  }
}

module.exports = CricketGame
