//creat empty cell for the game
//And a reset button for game to restart
const Gameboard = (function () {
  const gameboard = ["", "", "", "", "", "", "", "", ""];

  const resetBoard = function () {
    gameboard.forEach((cell, index) => {
      gameboard[index] = "";
    });
  };

  return {
    gameboard: gameboard,
    resetBoard,
    placeMarker: function (index, marker) {
      gameboard[index] = marker;
    },
  };
})();

//player name and marker with constructor function
function player(name, marker) {
  return { name: name, marker: marker };
}

//Main game controller with player discription select active player
// And switch player control
const Controller = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  function startGame(nameOne, nameTwo) {
    players[0].name = nameOne;
    players[1].name = nameTwo;
  }

  const board = Gameboard;

  const players = [player(playerOneName, "X"), player(playerTwoName, "O")];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  //Playround function check the winner and display on screen
  function playRound(index) {
    if (gameOver) return;
    Gameboard.placeMarker(index, activePlayer.marker);
    DisplayController.renderBoard();

    const winner = checkWinner();
    if (winner !== undefined) {
      gameOver = true;
      const winningPlayer = players.find((player) => player.marker === winner);
      DisplayController.showResult(`${winningPlayer.name} has won`);
    } 
    
    else if (Gameboard.gameboard.every((cell) => cell !== "")) {
      gameOver = true;
      DisplayController.showResult("it's a tie");
    } 
    
    else {
      switchPlayerTurn();
    }
  }

  const getActivePlayer = () => activePlayer;

  //All the possibility in tic tac toe
  const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];

  //Main function to check the winner using loop and pass the return to playround
  function checkWinner() {
    for (const pattern of winPatterns) {
      if (
        pattern.every(
          (index) =>
            Gameboard.gameboard[index] === Gameboard.gameboard[pattern[0]],
        ) &&
        Gameboard.gameboard[pattern[0]] !== ""
      ) {
        return Gameboard.gameboard[pattern[0]];
      }
    }
  }

  let gameOver = false;

  const resetGame = function () {
    gameOver = false;
    activePlayer = players[0];
    Gameboard.resetBoard();
  };

  return {
    players,
    playRound,
    getActivePlayer,
    resetGame,
    startGame,
  };
})();

//control the display and show user result and player discription
const DisplayController = (function () {
  const cells = document.querySelectorAll(".cell");
  let resetBtn = document.querySelector("#reset");
  let newGameBtn = document.querySelector("#new-btn");
  let msgContainer = document.querySelector(".msg-container");
  let msg = document.querySelector("#msg");
  let playerOneInput = document.querySelector("#player-1");
  let playerTwoInput = document.querySelector("#player-2");
  const startButton = document.querySelector(".start-btn");

  const renderBoard = function () {
    cells.forEach((cell, index) => {
      cell.textContent = Gameboard.gameboard[index];
    });
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", (event) => {
      Controller.playRound(index);
    });
  });

  const showResult = function (winner) {
    msg.textContent = winner;
    msgContainer.classList.remove("hide");
  };

  const resetDisplay = function () {
    msgContainer.classList.add("hide");
    Controller.resetGame();
    renderBoard();
  };

  resetBtn.addEventListener("click", (event) => {
    resetDisplay();
  });

  startButton.addEventListener("click", (event) => {
    Controller.startGame(playerOneInput.value, playerTwoInput.value);
  });

  renderBoard();

  return {
    renderBoard,
    showResult,
    resetDisplay,
  };
})();
