const { parseData } = require('../library')

test('test parsing the user input', () => {
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
  expect(Array.isArray(data)).toBe(true)
  expect(data.length).toBe(6)
  expect(data[5].length).toBe(data[3])
})
