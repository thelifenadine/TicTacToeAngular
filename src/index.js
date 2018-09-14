import angular from 'angular';
import gameDataService from './app.service'
import gameController from './app.controller';

angular.module('ticTacToeApp', [])
  .controller('gameController', gameController)
  .service('gameDataService', gameDataService);

// angular.bootstrap(document, ['app']);
// don't need to do this bc tictactoe is on the html
