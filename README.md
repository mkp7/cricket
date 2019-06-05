# CRICKET

A simple cricket game simulation of remaining overs based on player probability of remaining players

CRICKET PROGRAM

INPUT:
- Overs left in the match
- Remaining wickets left
- Runs require to win the match
- For each remaining player, a probability of scoring runs;
  (assuming the batting order is the same as input order)
  - probability of scoring either 0, 1, 2, 3, 4, 5, 6 on each ball or get out

RULES OF THE GAME:
- Batsmen change strike end of every over. They also change strike when they score a 1,3 or 5
- When a player gets out, the new player comes in at the same position.
- Assume only legal balls are bowled (no wides, no no-balls etc..).
  Therefore an over is always 6 balls.

OUTPUT:
- Status of the game after each ball played
- Summary of the game after each over played
- Match result after end of all overs or players

APPROACH TO CHALLENGE:
- read the articles attached on SOLID principles, TDD and clean code
- read the problem statement and wrote inital understanding of input, contraints and expected output
- implemented simulation using dummy input that plays all the overs
- wrote tests for playBall function
