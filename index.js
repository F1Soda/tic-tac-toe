const CROSS = 'X';
const ZERO = 'O';
const EMPTY = '';

const container = document.getElementById('fieldWrapper');
const gridSize = 4;

let currentPlayer = CROSS;
let gameBoard = Array(gridSize * gridSize).fill(EMPTY);
let isGameOver = false;

startGame();
addResetListener();

function startGame() {
    renderGrid(gridSize);
}

function renderGrid(dimension) {
    container.innerHTML = '';
    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    const index = row * gridSize + col;
    if (gameBoard[index] !== EMPTY || isGameOver) {
        return;
    }

    renderSymbolInCell(currentPlayer, row, col);
    gameBoard[index] = currentPlayer;

    if (checkWinner()) {
        alert(currentPlayer + ' Победил!');
        isGameOver = true;
        return;
    }

    if (!gameBoard.includes(EMPTY)) {
        alert("Победила дружба");
        isGameOver = true;
        return;
    }

    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    gameBoard = Array(gridSize * gridSize).fill(EMPTY);
    currentPlayer = CROSS;
    isGameOver = false;

    const cells = container.querySelectorAll('td');
    cells.forEach(cell => {
        cell.textContent = EMPTY;
        cell.style.color = '#333';
    });
}

function checkWinner() {
    let winPatterns = [];

    for (let i = 0; i < gridSize; i++) {
        winPatterns.push([...Array(gridSize).keys()].map(j => i * gridSize + j));
        winPatterns.push([...Array(gridSize).keys()].map(j => j * gridSize + i));
    }

    winPatterns.push([...Array(gridSize).keys()].map(i => i * (gridSize + 1)));
    winPatterns.push([...Array(gridSize).keys()].map(i => (i + 1) * (gridSize - 1)));

    for (let pattern of winPatterns) {
        if (pattern.every(index => gameBoard[index] !== EMPTY && gameBoard[index] === gameBoard[pattern[0]])) {
            highlightWinningCells(pattern);
            return true;
        }
    }
    return false;
}

function highlightWinningCells(pattern) {
    for (let index of pattern) {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        renderSymbolInCell(gameBoard[index], row, col, 'red');
    }
}

function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell(row, col) {
    findCell(row, col).click();
}