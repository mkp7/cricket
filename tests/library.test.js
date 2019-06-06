const { parseData, validateData } = require('../library')

const inputData = `RCB
CSK
4 4 40
player one
10 10 10 10 20 20 10 10
player two
10 10 10 10 20 20 10 10
player three
10 10 10 10 20 20 10 10
player four
10 10 10 10 20 20 10 10`

const data = parseData(inputData)
test('test parseData; parses the string user input', () => {
  expect(Array.isArray(data)).toBe(true)
  expect(data.length).toBe(6)
  expect(data[5].length).toBe(data[3])
})

test('test validateData; validates parsed data', () => {
  const [
    battingTeamName,
    bowlingTeamName,
    overs,
    playersRemaining,
    runsTarget,
    playersData
  ] = data
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
