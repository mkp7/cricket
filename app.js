const { SimulateCricketMatch } = require('./simulate-game')

/*
  accepts user input (current cricket game state) in string format
  example: main(`4 4 40
20 20 20 20 10 10
20 20 20 20 10 10
20 20 20 20 10 10
20 20 20 20 10 10`)
  formats and validates the input data
  and simulates the game which generates the result,
  returns the formatted result in string format
 */
const main = () => {
  // set initial state of the match
  const RUMRAHProb = [20, 30, 15, 5, 5, 1, 4, 20]
    .map((p, i) => (new Array(p).fill(i)))
    .reduce((a, b) => [...a, ...b])
  const SHASHIProb = [30, 25, 5, 0, 5, 1, 4, 30]
    .map((p, i) => (new Array(p).fill(i)))
    .reduce((a, b) => [...a, ...b])
  const KIRATProb = [5, 30, 25, 10, 15, 1, 9, 5]
    .map((p, i) => (new Array(p).fill(i)))
    .reduce((a, b) => [...a, ...b])
  const NSProb = [10, 40, 20, 5, 10, 1, 4, 10]
    .map((p, i) => (new Array(p).fill(i)))
    .reduce((a, b) => [...a, ...b])

  const matchState = {
    battingTeam: {
      name: 'RCB',
      players: [
        {
          name: 'RUMRAH',
          probabilityArray: RUMRAHProb,
          ballsPlayed: 0,
          runs: 0
        },
        {
          name: 'SHASHI',
          probabilityArray: SHASHIProb,
          ballsPlayed: 0,
          runs: 0
        }
      ],
      playersOut: [],
      runs: 0,
      ballsPlayed: 0,
      oversPlayed: 0
    },
    bowlingTeam: {
      name: 'CSK'
    },
    remainingOvers: 4,
    requiredRuns: 40,
    playerOnStrike: {
      name: 'KIRAT',
      probabilityArray: KIRATProb,
      played: true,
      ballsPlayed: 0,
      runs: 0
    },
    playerOnNonStrike: {
      name: 'NS',
      probabilityArray: NSProb,
      played: true,
      ballsPlayed: 0,
      runs: 0
    }
  }

  const result = SimulateCricketMatch(matchState)
}

// accept the input from stdin and pass main callback to accept
main()
