const assert = require('assert')
const { validateData } = require('./misc')
// const fs = require('fs')

// const inputData = fs.readFileSync('./cases/1.txt', 'utf8')

// const formatDataCases = [
//   `4 4 40
// 20 20 20 20 10 10
// 20 20 20 20 10 10
// 20 20 20 20 10 10
// 20 20 20 20 10 10`
// ]

// formatDataCases.forEach(case => (assert(formatData(case))))

const validateDataCase1 = [4, 4, 40, [
  [20, 20, 20, 20, 10, 10],
  [20, 20, 20, 20, 10, 10],
  [20, 20, 20, 20, 10, 10],
  [20, 20, 20, 20, 10, 10]
]]
assert(validateData(...validateDataCase1) === true)

const validateDataCase2 = [4, 4, 40, [
  [20, 20, 20, 20, 10],
  [20, 20, 20, 20, 10, 10],
  [20, 20, 20, 20, 10, 10],
  [20, 20, 20, 20, 10, 10]
]]
assert(validateData(...validateDataCase2) === false)
