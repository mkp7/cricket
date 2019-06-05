const { playBall } = require('../simulate-game')

test('player\'s shot based on player\'s probability', () => {
  const playBallCases = [
    [50, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [25, 25, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [50, 20, 20, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [10, 10, 20, 20, 10, 10, 10, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [50, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b])
  ]
  const values = playBallCases.map(c => playBall(c))
  values.forEach(v => {
    expect(v).toBeGreaterThanOrEqual(0)
    expect(v).toBeLessThan(100)
  })
})

test('player\'s shot based on player\'s probability fail cases', () => {
  const playBallCases = [
    [50, 5].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [25, 20, 50].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [50, 22, 20, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [10, 1, 20, 20, 10, 10, 10, 10].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b]),
    [50, 100].map((p, i) => (new Array(p).fill(i))).reduce((a, b) => [...a, ...b])
  ]
  const values = playBallCases.map(c => playBall(c))
  values.forEach(v => (expect(v).toBeNull()))
})
