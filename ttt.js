// Factory function to create a game board of given size
function gameBoard() {
  const board = [];
  for (let i = 0; i < 3; i++) {
    board.push([]);
    for (let j = 0; j < 3; j++) {
      board[i].push(null);
    }
  }
  return { board };
}

// Factory function to create a player with a given name and symbol
function player(name, symbol) {
  return { name, symbol };
}

// function to manage the game logic
function gameController() {
    
    let currentPlayerIndex = 0;
    let movesCount = 0;

    // Get player names from input fields
    const name1Input = document.getElementById("player1-name");
    const name2Input = document.getElementById("player2-name");

    // Create 2 players
    const player1 = player(name1Input.value, "X");
    const player2 = player(name2Input.value, "O");
    const players = [player1, player2];

    // Create a 3x3 game board
    const { board } = gameBoard();

    // Function to make a move on the board
    function makeMove(row, col) {
    if (board[row][col] !== null) {
        throw new Error("Cell is already occupied.");
    }
    const currentPlayer = players[currentPlayerIndex];
    board[row][col] = currentPlayer.symbol;
    movesCount++;
    if (checkWin(row, col, currentPlayer.symbol)) {
        return `${currentPlayer.name} wins!`;
    }
    if (movesCount === 3 * 3) {
        return "It's a draw!";
    }
    currentPlayerIndex = 1 - currentPlayerIndex; // Switch player
    return "Move accepted.";
    }

    // Function to check if the current player has won
    function checkWin(row, col, symbol) {
    // Check row
    if (board[row].every(cell => cell === symbol)) return true;
    // Check column
    if (board.every(r => r[col] === symbol)) return true;
    // Check diagonals
    if (row === col && board.every((r, i) => r[i] === symbol)) return true;
    if (row + col === 3 - 1 && board.every((r, i) => r[3 - 1 - i] === symbol)) return true;
    return false;
    }

    function getBoard() {
    return board;
    }
return { makeMove, getBoard };
}

// Render the game board in the DOM
function renderBoard() {
    const gameBoardDiv = document.getElementById("game-board");
    gameBoardDiv.innerHTML = ""; // Clear previous board

    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.textContent = controller.getBoard()[i][j] || "";
        gameBoardDiv.appendChild(cell);
    } 
    }
}

// Add event listener for Start Game button
document.getElementById("start-button").addEventListener("click", () => {
    renderBoard();
}); 

const controller = gameController();

// Add event listener for Reset Game button
document.getElementById("reset-button").addEventListener("click", () => {
    // Reset the board
    for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        controller.getBoard()[i][j] = null;
    }
    }
    renderBoard();
}); 

// Add event listener for cell clicks
document.getElementById("game-board").addEventListener("click", (event) => {
    
    if (event.target.classList.contains("cell")) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    try {
        const result = controller.makeMove(row, col);
        renderBoard();
        if (result !== "Move accepted.") {
        alert(result);
        }
    } catch (error) {
        alert(error.message);
    }
    }
});

