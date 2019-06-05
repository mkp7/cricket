const { playersShot } = require('../simulate-game')

const playersShotCases = [
  [50, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
  [25, 25, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
  [50, 20, 20, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
  [10, 10, 20, 20, 10, 10, 10, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
  [50, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b])
]

test('player\'s shot based on player\'s probability', () => {
  const values = playersShotCases.map(c => playersShot(c))
  values.forEach(v => {
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(100)
  })
})
