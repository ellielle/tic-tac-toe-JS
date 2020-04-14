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
  const _resetBoard = () => {
    document.querySelectorAll('.square').forEach(square => {
      square.textContent = '';
      square.style.color = 'black';
    });
    Players.resetScoreChange();
    _winningRow = [];
    _boardState.forEach((value, index, arr) => {
      arr[index] = null;
    });
    runGame.setGameOver();
  };
  const _updateScore = () => {
    let player1 = document.querySelector('.player1');
    let player2 = document.querySelector('.player2');
    player1.textContent = `P1: ${Players.getScore()[0]}`;
    player2.textContent = `P2: ${Players.getScore()[1]}`;
  };
  const createBoardEvents = () => {
    for (let i = 1; i <= 9; i++) {
      let square = _createSquares(i);
      square.addEventListener('click', () => {
        _takeSquare(i - 1);
      });
    }
    document.querySelector('.btn-reset').addEventListener('click', _resetBoard);
  };
  const finishGame = () => {
    let currentPlayer = runGame.currentTurn() === 1 ? Players.player1 : Players.player2;
    _changeColors();
    Players.changeScore(currentPlayer);
    _updateScore(runGame.currentTurn());
  };
  const getBoardState = () => _boardState;
  const setWinningRow = row => _winningRow = row;
  return { getBoardState, createBoardEvents, finishGame, setWinningRow }
})();

const Players = (() => {
  let _p1Wins = 0;
  let _p2Wins = 0;
  let _allowScoreChange = true;
  const player1 = 'X';
  const player2 = 'O';
  const changeScore = player => {
    if (_allowScoreChange) {
      player === 'X' ? _p1Wins++ : _p2Wins++;
      _allowScoreChange = !_allowScoreChange;
    }
  };
  const getScore = () => [_p1Wins, _p2Wins];
  const resetScoreChange = () => {
    if (runGame.getGameOver()) {
      _allowScoreChange = !_allowScoreChange;
    }
  };
  return { player1, player2, changeScore, resetScoreChange, getScore }
})();

const runGame = (() => {
  let _turn = 1;
  let _gameOver = false;
  const _winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const _checkForGameOver = board => {
    let currentPlayer = _turn === 1 ? Players.player1 : Players.player2;
    _winConditions.forEach(condition => {
      if (board[condition[0]] === currentPlayer && board[condition[1]] === currentPlayer
        && board[condition[2]] === currentPlayer) {
        _gameOver = true;
        gameBoard.setWinningRow(condition);
      } else if (board.every(value => value != null)) {
        _gameOver = true;
      }
    });
  };
  const _endGame = () => {
    gameBoard.finishGame();
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
  const getGameOver = () => _gameOver;
  const setGameOver = () => _gameOver = !_gameOver;
  return { changeTurn, currentTurn, getGameOver, setGameOver }
})();
