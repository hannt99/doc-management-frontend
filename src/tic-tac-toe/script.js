/* 
    We store our game status element here to 
    allow us to more easily use it later on.
*/
let gameState = [
    "", "", "",
    "", "", "",
    "", "", ""
];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let currentPlayer = "X";
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
let gameActive = true;

const statusDisplay = document.querySelector('.game-status');
/*
    We set the initial message to let the players know whose turn it is.
*/
statusDisplay.innerHTML = currentPlayerTurn();
document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

const gameStatus = document.querySelector('.game-status');
gameStatus.classList.remove(".game-finish");

const btnRestart = document.querySelector('.game-restart');
btnRestart.classList.add("hide");
btnRestart.addEventListener('click', handleGameRestart);

function handleCellClick(clickedCellEvent) {
    /*
        We will save the clicked html element in a variable for easier further use.
    */
    const clickedCell = clickedCellEvent.target;

    /*
        Here we will grab the "data-cell-index" attribute from the clicked cell to 
        identify where that cell is in our grid. Please note that the getAttribute will 
        return a string value. Since we need an actual number we will parse it to an integer (number).
    */
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    /* 
        Next up we need to check whether the cell has already been played, or 
        if the game is paused. If either of those is true we will simply ignore the click.
    */
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    /* 
        If everything is in order we will proceed with the game flow.
    */
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

function handleCellPlayed(clickedCell, clickedCellIndex) {
    /* 
        We update our internal game state to reflect the played move,
        as well as update the user interface to reflect the played move.
    */
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
};

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        gameStatus.classList.add("game-finish");
        btnRestart.classList.remove("hide");
        return;
    }
    /* 
        We will check whether there are any values in our game state array
        that are still not populated with a player sign.
    */
   let roundDraw = !gameState.includes("");
   if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        gameStatus.classList.add("game-finish");
        btn.classList.remove("hide");
        return;
   }
    /* 
        If we get to here we know that no one won the game yet,
        and that there are still moves to be played, so we continue by
        changing the current player.
    */
    this.handlePlayerChange();
};

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
};

function handleGameRestart() {
    currentPlayer = "X";
    gameState = [
        "", "", "",
        "", "", "",
        "", "", ""
    ];
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = "";
    });
    statusDisplay.innerHTML = currentPlayerTurn();
    gameStatus.classList.remove("game-finish");
    btn.classList.add("hide");
};
