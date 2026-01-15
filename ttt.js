
let controller; // Declare controller in the outer scope
const BOARD_SIZE = 3;

// Factory function to create a 3x3 game board
function gameBoard() {
  const board = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    board.push([]);
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i].push(null);
    }
  }
  return { board };
}

// Factory function to create a player with a given name and symbol
function player(name, symbol) {
  return { name, symbol };
}

// Get player names from input fields
function getPlayerNames() { 
    const name1Input = document.getElementById("player1-name");
    const name2Input = document.getElementById("player2-name");
    const name1 = name1Input ? name1Input.value.trim() : "Player 1";
    const name2 = name2Input ? name2Input.value.trim() : "Player 2";
    return [name1 || "Player 1", name2 || "Player 2"];
}   


// function to manage the game logic
function gameController(player1Name, player2Name) {
    
    // Track current player and moves count
    let currentPlayerIndex = 0;
    let movesCount = 0;

    // Create 2 players
    function createPlayers(player1Name, player2Name) {  
        const player1 = player(player1Name, "X");
        const player2 = player(player2Name, "O");
        const players = [player1, player2]; 
        return players;
    }
    const players = createPlayers(player1Name, player2Name);

    // Create a 3x3 game board
    const { board } = gameBoard();

    // Function to get the current state of the board
    function getBoard() {
    return board;
    }

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
            if (movesCount === BOARD_SIZE * BOARD_SIZE) {
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
        if (row + col === BOARD_SIZE - 1 && board.every((r, i) => r[BOARD_SIZE - 1 - i] === symbol)) return true;
    return false;
    }

    // Reset the game state
    function resetGame() {
        for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = null;
        }
        }
        currentPlayerIndex = 0;
        movesCount = 0;
    }

  return { getBoard, makeMove, resetGame };
}

// Add event listener for Start Game button
document.getElementById("start-button").addEventListener("click", () => {
    const players = getPlayerNames();

    // Now create the controller with the entered names
    controller = gameController(...players);
    renderBoard();
}); 

// Render the game board in the DOM
function renderBoard() {
    const gameBoardDiv = document.getElementById("game-board");
    gameBoardDiv.innerHTML = ""; // Clear previous board

    for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        cell.textContent = controller.getBoard()[i][j] || "";
        gameBoardDiv.appendChild(cell);
    } 
    }
}

// Add event listener for Reset Game button
document.getElementById("reset-button").addEventListener("click", () => {
    // Get updated player names
    controller = gameController(...getPlayerNames());
    // Reset the game state
    controller.resetGame();
    // Re-render the board
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

