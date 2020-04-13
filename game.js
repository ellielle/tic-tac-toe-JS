'use strict';

window.onload = () => {
  gameBoard.createBoardEvents();
};

const gameBoard = (() => {
  const _container = document.querySelector('.container');
  const _boardState = Array(9).fill(null);
  let _winningRow = [];
  const _createSquares = index => {
    let newSquare = document.createElement('div');
    newSquare.className = `square square${index}`;
    _container.appendChild(newSquare);
    return newSquare;
  };
  const _takeSquare = square => {
    if (_boardState[square] == null) {
      let turn = runGame.currentTurn();
      let player = turn === 1 ? Players.player1 : Players.player2;
      _boardState.splice(square, 1, player);
      _updateSquares();
      runGame.changeTurn();
    }
  };
  const _updateSquares = () => {
    document.querySelectorAll('.square').forEach((square, index) => {
      square.textContent = _boardState[index];
    });
  };
  const _blockInput = () => {
    document.querySelectorAll('.square').forEach(square => {

      // TODO finish removing event listeners
    });
  };
  const _changeColors = () => {
    if (_winningRow.length > 0) {
      _winningRow.forEach(square => {
        document.querySelector(`.square${+square + 1}`).style.color = 'green';
      });
    } else {
      document.querySelectorAll('.square').forEach(square => {
        square.style.color = 'red';
      });
    }
  };
  const createBoardEvents = () => {
    for (let i = 1; i <= 9; i++) {
      let square = _createSquares(i);
      square.addEventListener('click', () => {
        _takeSquare(i - 1);
      });
    }
  };
  const cleanup = () => {
    _blockInput();
    _changeColors();
  };
  const getBoardState = () => _boardState;
  const setWinningRow = row => _winningRow = row;
  return { getBoardState, createBoardEvents, cleanup, setWinningRow }
})();

const Players = (() => {
  let _p1Wins = 0;
  let _p2Wins = 0;
  const player1 = 'X';
  const player2 = 'O';
  const changeScore = player => {
    player === 'X' ? _p1Wins++ : _p2Wins++;
  };
  return { player1, player2, changeScore }
})();

const runGame = (() => {
  let _turn = 1;
  let _gameOver = false;
  const _winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const _checkForGameOver = board => {
    let current_player = _turn === 1 ? Players.player1 : Players.player2;
    _winConditions.forEach(condition => {
      if (board[condition[0]] === current_player && board[condition[1]] === current_player
        && board[condition[2]] === current_player) {
        _gameOver = true;
        gameBoard.setWinningRow(condition);
      } else if (board.every(value => value != null)) {
        _gameOver = true;
      }
    });
  };
  const _endGame = () => {
    gameBoard.cleanup();
    _showReplayButton();
    _showScore();
  };

  const _showReplayButton = () => {
    // TODO create button, show and allow it to restart game
  };
  const _showScore = () => {
    // TODO add a call to Players.changeScore()
  };
  const resetGame = () => {
    // TODO wipe everything and start over, except score
    // TODO possibly swap starting player
  };
  const changeTurn = () => {
    _checkForGameOver(gameBoard.getBoardState());
    if (_gameOver) {
      _endGame();
    } else {
      _turn === 1 ? _turn = 2 : _turn = 1;
    }
  };
  const currentTurn = () => _turn;
  return { changeTurn, currentTurn, resetGame }
})();
