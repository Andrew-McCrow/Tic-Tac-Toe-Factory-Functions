// Factory function to create a game board of given size
function gameBoard(size) {
  const board = [];
  for (let i = 0; i < size; i++) {
    board.push([]);
    for (let j = 0; j < size; j++) {
      board[i].push(null);
    }
  }
  return { size, board };
}

// Create a 3x3 game board
const { board, size } = gameBoard(3);

// Factory function to create a player with a given name and symbol
function player(name, symbol) {
  return { name, symbol };
}

// Create 2 players for testing
const player1 = player("Player 1", "X");
const player2 = player("Player 2", "O");
const players = [player1, player2];

// function to manage the game logic
function gameController() {
    
    let currentPlayerIndex = 0;
    let movesCount = 0;

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
    if (movesCount === size * size) {
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
    if (row + col === size - 1 && board.every((r, i) => r[size - 1 - i] === symbol)) return true;
    return false;
    }

    function getBoard() {
    return board;
    }
return { makeMove, getBoard };
}

// Render the game board in the DOM
function renderBoard(size) {
    const gameBoardDiv = document.getElementById("game-board");
    gameBoardDiv.innerHTML = ""; // Clear previous board

    for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.textContent = board[i][j] || "";
        gameBoardDiv.appendChild(cell);
    } 
    }
}

// Initialize game controller and render the board
const controller = gameController();
renderBoard(size);

// Add event listener for cell clicks
document.getElementById("game-board").addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    try {
        const result = controller.makeMove(row, col);
        renderBoard(size);
        if (result !== "Move accepted.") {
        alert(result);
        }
    } catch (error) {
        alert(error.message);
    }
    }
});

// Add event listener for Reset Game button
document.getElementById("reset-button").addEventListener("click", () => {
    // Reset the board
    for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
        board[i][j] = null;
    }
    }
    renderBoard(size);
}); 

