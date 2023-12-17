const Rock = '👊🏻';
const Paper = '🖐🏾';
const Scissors = '✌🏽';
type RockPaperScissors = typeof Rock | typeof Paper | typeof Scissors;

interface WinMap {
  [Rock]: typeof Scissors;
  [Scissors]: typeof Paper;
  [Paper]: typeof Rock;
}

type WhoWins<
  TOpponent extends RockPaperScissors,
  TPlayer extends RockPaperScissors
> = WinMap[TPlayer] extends TOpponent
  ? 'win'
  : WinMap[TOpponent] extends TPlayer
    ? 'lose'
    : 'draw';
