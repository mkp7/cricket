const { getStdInput, formatData, validateData } = require('./misc')

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
const main = stdInput => {
  const [
    RemainingOvers,
    RemainingPlayers,
    RequiredRuns,
    PlayersProbabilities
  ] = formatData(stdInput) // format the input

  // validate the input format
  const isValidInput = validateData( // validate the input
    RemainingOvers,
    RemainingPlayers,
    RequiredRuns,
    PlayersProbabilities
  )

  if (!isValidInput) { // check validation
    throw new Error('invalid input')
  }

  // call simulation function with input
  // const result = SimulateCricketMatch(
  //   RemainingOvers,
  //   RemainingPlayers,
  //   RequiredRuns,
  //   PlayersProbabilities
  // )
}

// accept the input from stdin and pass main callback to accept
getStdInput(main)
