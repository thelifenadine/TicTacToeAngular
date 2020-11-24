import _ from 'lodash';
const player1 = 'X';
const player2 = 'O';
let played = null;

var initData = ($scope, gameDataService) => {
  played = [];
  $scope.winner = null;
  $scope.draw = null;
  $scope.currentPlayer = player1;
  $scope.boardsize =  $scope.newSize || 3;
  $scope.numberToWin = $scope.newNumberToWin || 3;
  $scope.board = gameDataService.getBoardBySize($scope.boardsize);
};

var evaluateTurn = ($scope) => {
  var movesByPlayer = _.filter(played, { 'player': $scope.currentPlayer });
  if (movesByPlayer.length < $scope.numberToWin) {
    return; //not enough moves, don't bother checking
  }

  var diagonalDownCount = 0; //00, 11, 22 - diagonal top left to bottom right positions
  var diagonalUpCount = 0;  //20, 11, 02 - diagonal bottom left to top right positions

  for (var i = 0; i < $scope.numberToWin; i++) {
    var rowCount = 0; //check every row
    var colCount = 0;  //check every column
    var diagonalUpIndex = $scope.numberToWin - 1 - i; //2, 1, 0 diagonal up column index

    _.each(movesByPlayer, function(move) {
      if (move.row === i && move.col === i) {
        diagonalDownCount += 1;
      }
      if (move.row === diagonalUpIndex && move.col === i) {
        diagonalUpCount += 1;
      }
      if (move.row === i) {
        rowCount += 1;
      }
      if (move.col === i) {
        colCount += 1;
      }
      if (diagonalUpCount === $scope.numberToWin
          || diagonalDownCount === $scope.numberToWin
          || colCount === $scope.numberToWin
          || rowCount === $scope.numberToWin) {

        $scope.winner = $scope.currentPlayer;
        return;
      }
    });
 }

 //no winner but all positions have been played
  if (played.length === ($scope.boardsize * $scope.boardsize)) {
    $scope.draw = true;
  }
};

var changePlayer = ($scope) => {
  $scope.currentPlayer = ($scope.currentPlayer === player1)
    ? player2
    : player1;
};

class gameController {
  constructor($scope, gameDataService) {
    this.$scope = $scope;
    this.gameDataService = gameDataService;
    initData(this.$scope, this.gameDataService);
  }

  playTurn ($event, positionInfo) {
    this.$scope.errors = null;

    if (this.$scope.winner) {
      return;
    }

    if (positionInfo.player !== null) {
      return;
    }

    positionInfo.player = this.$scope.currentPlayer;
    played.push(positionInfo);
    evaluateTurn(this.$scope);

    if (!this.$scope.winner) { //change players if no winner
      changePlayer(this.$scope);
    }
  };

  newGame ($event) {
      if (this.$scope.newNumberToWin > this.$scope.newSize) {
          this.$scope.errors = "Please choose a winning number smaller or equal to the board size.";
      } else {
        this.$scope.errors = null;
        initData(this.$scope, this.gameDataService);
      }
  };
}

// can do this instead of in the constructor
// gameController.$inject = ['$scope', 'gameDataService'];

export default gameController;
