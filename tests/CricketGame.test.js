const { distributeProbability } = require('../library')
const Player = require('../Player')
const CricketGame = require('../CricketGame')
const { simulateBall } = require('../library')

test('player\'s shot based on player\'s probability', () => {
  const playBallCases = [
    [50, 50],
    [25, 25, 50],
    [50, 20, 20, 10],
    [10, 10, 20, 20, 10, 10, 10, 10],
    [50, 50]
  ]
  const values = playBallCases
    .map(p => distributeProbability(p))
    .map(c => simulateBall(c))
  values.forEach(v => {
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(100)
  })
})

test('player\'s shot based on player\'s probability fail cases', () => {
  const playBallCases = [
    [50, 5],
    [25, 20, 50],
    [50, 22, 20, 10],
    [10, 1, 20, 20, 10, 10, 10, 10],
    [50, 100]
  ]
  const values = playBallCases
    .map(p => distributeProbability(p))
    .map(c => simulateBall(c))
  values.forEach(v => (expect(v).toBeNull()))
})

test('simulate cricket match', () => {
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

  const T20Finals = new CricketGame(
    battingTeam,
    bowlingTeam,
    overs,
    runsTarget,
    battingTeam.playersPlayed[0],
    battingTeam.playersPlayed[1]
  )

  expect(T20Finals.start()).toBeUndefined()
})
