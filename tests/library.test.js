const {
  parseData,
  validateData,
  getBattingTeamWinSummary,
  getBowlingTeamWinSummary,
  getBatsmenSummary,
  distributeProbability,
  getOverSummary,
  getBallSummary,
  simulateBall
} = require('../library')
const Player = require('../Player')
const CricketGame = require('../CricketGame')

const inputData = `RCB
CSK
4 4 40
KK
10 10 10 10 20 20 10 10
NS
10 10 10 10 20 20 10 10
RR
10 10 10 10 20 20 10 10
SH
10 10 10 10 20 20 10 10`

const data = parseData(inputData)
test('test parseData; parses the string user input', () => {
  expect(Array.isArray(data)).toBe(true)
  expect(data.length).toBe(6)
  expect(data[5].length).toBe(data[3])
})

const [
  battingTeamName,
  bowlingTeamName,
  overs,
  playersRemaining,
  runsTarget,
  playersData
] = data

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

const T20Test = new CricketGame(
  battingTeam,
  bowlingTeam,
  overs,
  runsTarget,
  battingTeam.playersPlayed[0],
  battingTeam.playersPlayed[1]
)

test('test validateData; validates parsed data', () => {
  const isValidInput = validateData(
    battingTeamName,
    bowlingTeamName,
    overs,
    playersRemaining,
    runsTarget,
    playersData
  )
  expect(isValidInput).toBe(true)
})

test('test get batting team win summary', () => {
  expect(
    getBattingTeamWinSummary('RCB', 4, 8)
  ).toBe('\nRCB won by 4 wickets and 8 balls remaining')
})

test('test get bowling team win summary', () => {
  expect(
    getBowlingTeamWinSummary('CSK', 3, 1)
  ).toBe('\nCSK won by 3 runs and 1 ball remaining')
})

test('test get batsmen summary', () => {
  expect(getBatsmenSummary(
    [['KK', [5, 30, 25, 10, 15, 1, 9, 5]]].map(pd => (new Player(pd[0], distributeProbability(pd[1]))))
  )).toBe('\n\nKK - 0* (0 ball)')
})

test('test get over summary', () => {
  expect(getOverSummary(7, 31))
    .toBe('\n7 overs left. 31 runs to win')
})

test('test get ball summary', () => {
  expect(getBallSummary(T20Test.playerOnStrike, 4, 3, 2))
    .toBe('3.2 KK scores 4 runs')
})

test('test simulate ball', () => {
  expect(simulateBall(T20Test.playerOnStrike.scoreProbabilities))
    .toBeGreaterThanOrEqual(0)
  expect(simulateBall(T20Test.playerOnStrike.scoreProbabilities))
    .toBeLessThanOrEqual(7)
})
