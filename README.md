# CRICKET

A simple cricket game simulation of remaining overs based on player probability of remaining players

## Use
```
node app.js < tests/cases/pass1.txt
```

## Example input file `tests/cases/pass1.txt`
```
RCB
CSK
4 4 40
Kirat Boli
5 30 25 10 15 1 9 5
N.S Nodhi
10 40 20 5 10 1 4 10
R Rumrah
20 30 15 5 5 1 4 20
Shashi Henra
30 25 5 0 5 1 4 30
```

## Example output
```
4 overs left. 40 runs to win
0.1 Kirat Boli scores 2 runs
0.2 Kirat Boli scores 3 runs
0.3 N.S Nodhi scores 2 runs
0.4 N.S Nodhi scores 6 runs
0.5 N.S Nodhi scores 1 run
0.6 Kirat Boli scores 1 run

3 overs left. 25 runs to win
1.1 Kirat Boli scores 2 runs
1.2 Kirat Boli scores 1 run
1.3 N.S Nodhi scores 2 runs
1.4 N.S Nodhi scores 2 runs
1.5 N.S Nodhi scores 4 runs
1.6 N.S Nodhi scores 2 runs

2 overs left. 12 runs to win
2.1 Kirat Boli scores 2 runs
2.2 Kirat Boli scores 0 run
2.3 Kirat Boli scores 1 run
2.4 N.S Nodhi scores 0 run
2.5 N.S Nodhi got out
2.6 R Rumrah scores 0 run

1 over left. 9 runs to win
3.1 Kirat Boli scores 2 runs
3.2 Kirat Boli scores 2 runs
3.3 Kirat Boli scores 2 runs
3.4 Kirat Boli scores 1 run
3.5 R Rumrah got out
3.6 Shashi Henra scores 2 runs

RCB won by 1 wicket and 0 ball remaining

Kirat Boli - 19* (12 balls)
N.S Nodhi - 19 (9 balls)
R Rumrah - 0 (2 balls)
Shashi Henra - 2* (1 ball)
```

## Test
```
npm install
npm test
```

### INPUT:
- Overs left in the match
- Remaining wickets left
- Runs require to win the match
- For each remaining player, a probability of scoring runs;
  (assuming the batting order is the same as input order)
  - probability of scoring either 0, 1, 2, 3, 4, 5, 6 on each ball or get out

### RULES OF THE GAME:
- Batsmen change strike end of every over. They also change strike when they score a 1,3 or 5
- When a player gets out, the new player comes in at the same position.
- Assume only legal balls are bowled (no wides, no no-balls etc..).
  Therefore an over is always 6 balls.

### OUTPUT:
- Status of the game after each ball played
- Summary of the game after each over played
- Match result after end of all overs or players

### APPROACH TO CHALLENGE:
- read the articles attached on SOLID principles, TDD and clean code
- read the problem statement and wrote inital understanding of input, contraints and expected output
- implemented simulation using dummy input that plays all the overs
- implemented fully working simulation
- refactored to follow OOP and clean code
- implemented library functions to generate summaries
- wrote tests for library functions
- wrote tests for game simulation
