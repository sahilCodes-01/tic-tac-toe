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

function player(name, marker) {
  return { name: name, marker: marker };
}

const Controller = (function (
  playerOneName = "Player One",
  playerTwoName = "Player Two",
) {
  const board = Gameboard;

  const players = [player(playerOneName, "X"), player(playerTwoName, "O")];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  function playRound(index) {
    if (gameOver) return;
    Gameboard.placeMarker(index, activePlayer.marker);
    DisplayController.renderBoard();

    const winner = checkWinner();
    if (winner !== undefined) {
      gameOver = true;
      DisplayController.showResult(`player ${winner} has won`);
    } else if (Gameboard.gameboard.every((cell) => cell !== "")) {
      gameOver = true;
      DisplayController.showResult("it's a tie");
    } else {
      switchPlayerTurn();
    }
  }

  const getActivePlayer = () => activePlayer;

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
  };
})();

const DisplayController = (function () {
  const cells = document.querySelectorAll(".cell");
  let resetBtn = document.querySelector("#reset");
  let newGameBtn = document.querySelector("#new-btn");
  let msgContainer = document.querySelector(".msg-container");
  let msg = document.querySelector("#msg");

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

  renderBoard();

  return {
    renderBoard,
    showResult,
    resetDisplay,
  };
})();
