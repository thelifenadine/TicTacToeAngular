"use strict";

var App = {
  init: function init() {
    var gameModule = angular.module('ticTacToeApp', []);

    gameModule.controller('gameController', ['$scope','GameDataService', function($scope, GameDataService) {
      var player1 = 'X';
      var player2 = 'O';
      var played = null;

      $scope.currentPlayer = player1;
      $scope.newSize = 3;
      $scope.newNumberToWin = 3;

      var initData = function() {
        $scope.winner = null;
        $scope.draw = null;
        played = [];
        $scope.boardsize =  $scope.newSize;
        $scope.numberToWin = $scope.newNumberToWin;
        $scope.data = GameDataService.getBoardBySize($scope.boardsize);
      };

      var evaluateTurn = function(item) {
        played.push(item);

        var movesByPlayer = _.filter(played,{'move':$scope.currentPlayer});
        if (movesByPlayer.length < $scope.numberToWin) {
          return; //not enough moves, don't bother checking
        }

        if (movesByPlayer.length >= $scope.numberToWin) {
          var slideDownCount = 0; //00, 11, 22 //diagonal top left to bottom right
          var slideUpCount = 0;  //20, 11, 02 //diagonal bottom left to top right
          for(var i = 0; i < $scope.numberToWin; i++) {
            var rowCount = 0;
            var colCount = 0;
            var countDown = $scope.numberToWin - 1 - i;

            _.each(movesByPlayer, function(move) {
              if (move.row === i && move.col === i) {
                slideDownCount += 1;
              }

              if (move.row === countDown && move.col === i) {
                slideUpCount += 1;
              }

              if (move.row === i) {
                rowCount += 1;
              }

              if (move.col === i) {
                colCount += 1;
              }

              if (slideUpCount === $scope.numberToWin
                  || slideDownCount === $scope.numberToWin
                  || colCount === $scope.numberToWin
                  || rowCount === $scope.numberToWin) {
                $scope.winner = $scope.currentPlayer;
                return;
              }
            });
          }
        }

        if (played.length >= ($scope.numberToWin * $scope.numberToWin) && !$scope.winner) {
          $scope.draw = true;
          return;
        }
      };

      var changePlayer = function() {
        if ($scope.currentPlayer === player1) {
          $scope.currentPlayer = player2;
        } else {
          $scope.currentPlayer = player1;
        }
      };

      this.playTurn = function($event, item, player) {
        $scope.errors = null;

        if (!$scope.winner) {
          if (item.move !== null) {
            //$scope.errors = 'This square has already been played';
            return;
          }

          item.move = $scope.currentPlayer;
          evaluateTurn(item);

          if (!$scope.winner) { //change players
            changePlayer();
          }
        }
      };

      this.newGame = function($event) {
          if ($scope.newNumberToWin > $scope.newSize) {
              $scope.errors = "Please choose a winning number smaller or equal to the board size.";
          }else{
            $scope.errors = null;
            initData();
          }
      };

      initData();
    }]);

    gameModule.factory('GameDataService', function() {
      var service = {};
      var createBoard = function(boardsize) {
        var data = [];
          for(var i = 0; i<boardsize; i++) {
            for(var j = 0; j<boardsize; j++) {
              data.push({'row':i, 'col': j, 'move':null});
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
    }); //end service

  }
};

module.exports = App;
