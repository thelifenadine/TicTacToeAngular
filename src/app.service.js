const createBoard = (boardsize) => {
  var data = [];
  for (var i = 0; i < boardsize; i++) {
    for (var j = 0; j < boardsize; j++) {
      data.push({'row':i, 'col': j, 'player': null});
    }
  }
  return data;
};

export default class DataService {
  getDefaultBoard () {
    return createBoard(3);
  }

  getBoardBySize (boardsize) {
    return createBoard(boardsize);
  }
}
