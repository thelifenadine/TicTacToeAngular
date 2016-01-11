"use strict";

var App = {
  init: function init() {
    angular.module('ticTacToeApp', []);

    angular.module('ticTacToeApp').controller('gameController',
                                  ['$scope','GameDataService', function($scope, GameDataService) {
      var player1 = 'X';
      var player2 = 'O';
      var played = null;
      $scope.currentPlayer = player1;
      $scope.newSize = 3;
      $scope.newNumberToWin = 3;

      var initData = function() {
        played = [];
        $scope.winner = null;
        $scope.draw = null;
        $scope.boardsize =  $scope.newSize;
        $scope.numberToWin = $scope.newNumberToWin;
        $scope.board = GameDataService.getBoardBySize($scope.boardsize);
      };

      var evaluateTurn = function() {
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

      var changePlayer = function() {
        $scope.currentPlayer = ($scope.currentPlayer === player1)
          ? player2
          : player1;
      };

      this.playTurn = function($event, positionInfo) {
        $scope.errors = null;

        if ($scope.winner) {
          return;
        }

        if (positionInfo.player !== null) {
          return;
        }

        positionInfo.player = $scope.currentPlayer;
        played.push(positionInfo);
        evaluateTurn();

        if (!$scope.winner) { //change players if no winner
          changePlayer();
        }
      };

      this.newGame = function($event) {
          if ($scope.newNumberToWin > $scope.newSize) {
              $scope.errors = "Please choose a winning number smaller or equal to the board size.";
          } else {
            $scope.errors = null;
            initData();
          }
      };

      initData();

    }]);


    angular.module('ticTacToeApp').factory('GameDataService', function() {
      var service = {};

      var createBoard = function(boardsize) {
        var data = [];
          for (var i = 0; i < boardsize; i++) {
            for (var j = 0; j < boardsize; j++) {
              data.push({'row':i, 'col': j, 'player': null});
            }
          }
        return data;
      };

      service.getDefaultBoard = function() {
        return createBoard(3);
      };

      service.getBoardBySize = function(boardsize) {
        return createBoard(boardsize);
      };

      return service;
    });
  }
};

module.exports = App;
