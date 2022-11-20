// Constants
const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;

let boardNumRows = 15;
let boardLength = 540;    // The length of the sides of the outermost gridline
let boardEdgeLength = 30; // Distance from outermost line to edge of board
let stoneDiameter = 32;
let boardBorderRadius = 15;

// Other global variables
let isPlaying = false;
let isWhoseTurn = BLACK;
let blackTime = 0;
let whiteTime = 0;
let board = [];     // 2D array that represent current state of the board
let tileDivs = [];  // 1D array of document elements
let verLines = [];
let horLines = [];

// CSS constants
const COLOR_STR_TRANSPARENT = "rgba(0, 0, 0, 0)";
const COLOR_STR_WHITE = "rgb(245, 245, 245)";
const COLOR_STR_BLACK = "rgb(100, 100, 100)";
const COLOR_STR_HIGHLIGHT_WHITE = "rgba(245, 245, 245, .35)";
const COLOR_STR_HIGHLIGHT_BLACK = "rgba(100, 100, 100, .35)";

// CSS global vars
let highlightWidth = stoneDiameter / 8;
let BOX_SHADOW = "1px 3px 4px -2px rgb(38 38 38 / 40%), 0px 5px 6px -3px #000000bb";
let BOX_SHADOW_HIGHLIGHT = `0px 0px ${highlightWidth * 4}px ${highlightWidth}px rgb(160 38 38 / 60%)`;
let BOX_SHADOW_BLACK_STONE = "inset -10px -6px 16px rgba(0, 0, 0, 0.8), " + BOX_SHADOW;
let BOX_SHADOW_WHITE_STONE = "inset -5px -3px 8px rgba(0, 0, 0, 0.3), " + BOX_SHADOW;
let BOX_SHADOW_HIGHLIGHT_BLACK_STONE = "inset -10px -6px 16px rgba(0, 0, 0, 0.8), " + BOX_SHADOW_HIGHLIGHT;
let BOX_SHADOW_HIGHLIGHT_WHITE_STONE = "inset -5px -3px 8px rgba(0, 0, 0, 0.3), " + BOX_SHADOW_HIGHLIGHT;
let BACKGROUND_IMAGE_STONE = "inset -5px -3px 8px rgba(0, 0, 0, 0.3)";


// Elements
const gameBody = document.getElementById("game-body");
const buttonStartGame = document.getElementById("btn-start-game");
const buttonEndGame = document.getElementById("btn-end-game");
const gameBoard = document.getElementById("game-board");
const tileContainer = document.getElementById("game-board-tiles");
const gridContainer = document.getElementById("game-board-grids");
const leftTimerStone = document.getElementById("left-timer-stone");
const rightTimerStone = document.getElementById("right-timer-stone");
const leftTimerTextP = document.getElementById("left-timer-text-p");
const rightTimerTextP = document.getElementById("right-timer-text-p");

let leftStopwatch;
let rightStopwatch;

function genBoardLines() {
    let padding = `${boardEdgeLength}px`;
    function genVerLine() {
        let line = document.createElement("div");
        line.setAttribute("class", "board-line-ver");
        return line;
    }

    function genHorLine() {
        let line = document.createElement("div");
        line.setAttribute("class", "board-line-hor");
        return line;
    }

    // Generate grid lines on board
    for (let i = 0; i < boardNumRows; ++i) {
        let verLine = genVerLine();
        let horLine = genHorLine();
        verLines.push(verLine);
        horLines.push(horLine);
        gridContainer.appendChild(horLine);
        gridContainer.appendChild(verLine);
    }
}

function updateBoardSize() {
    /**
     * Resize board according to boardLength and boardEdgeLength
     */
    let height = 2 * boardEdgeLength + boardLength;
    let width = height;
    gameBoard.style.height = `${height}px`;
    gameBoard.style.width = `${width}px`;
    gameBoard.style.borderRadius = `${boardBorderRadius}px`;
}

function initBoard() {
    boardNumRows = localStorage.getItem("boardSize");
    genBoardLines();
    genTileDivs();
    initBoardArray();
    resizeBoard();
}

function initBoardArray() {
    // assume board = []
    for (let i = 0; i < boardNumRows; ++i) {
        let row = [];
        for (let j = 0; j < boardNumRows; ++j) {
            row.push(EMPTY);
        }
        board.push(row);
    }
}

function setBoardArrayEmpty() {
    for (let i = 0; i < boardNumRows; ++i) {
        for (let j = 0; j < boardNumRows; ++j) {
            board[i][j] = EMPTY;
        }
    }
}

function genTileDivs() {
    // Store tile divs in an array for faster access later
    for (let i = 0; i < boardNumRows; i++) {
        for (let j = 0; j < boardNumRows; j++) {
            tileDiv = document.createElement("div");
            tileDiv.setAttribute("class", "tile-div");
            tileDiv.setAttribute("id", "tile: " + i.toString() + "," + j.toString());
            tileDiv.setAttribute("onclick", `onClickDivAt(${i}, ${j})`);

            let onMouseEnter = (e) => {
                if (!isPlaying) return
                if (board[i][j] == EMPTY) {
                    if (isWhoseTurn == BLACK) {
                        e.target.style.backgroundColor = COLOR_STR_HIGHLIGHT_BLACK;
                    } else {
                        e.target.style.backgroundColor = COLOR_STR_HIGHLIGHT_WHITE;
                    }
                }
            };
            let onMouseLeave = (e) => {
                if (board[i][j] == EMPTY) {
                    e.target.style.backgroundColor = COLOR_STR_TRANSPARENT;
                }
            };

            tileDiv.addEventListener('mouseenter', onMouseEnter);
            tileDiv.addEventListener('mouseleave', onMouseLeave);

            tileDivs.push(tileDiv);  // The index of this element is (i * boardNumRows + j)
        }
    }
    
    // Set each tile div as children of "game-board" div.
    for (tileDiv of tileDivs) {
        tileContainer.appendChild(tileDiv);
    }
}

function resizeTileDivs() {
    for (let i = 0; i < boardNumRows; i++) {
        for (let j = 0; j < boardNumRows; j++) {
            let tileDiv = getTileDiv(i, j);
            // Distance between neighboring lines
            let rowGap = boardLength / (boardNumRows - 1);
            let y = boardEdgeLength + i * rowGap - stoneDiameter / 2; // horizontal
            let x = boardEdgeLength + j * rowGap - stoneDiameter / 2; // vertical
            tileDiv.style.left = y.toString() + "px";
            tileDiv.style.top = x.toString() + "px";
            tileDiv.style.width = stoneDiameter.toString() + "px";
            tileDiv.style.height = stoneDiameter.toString() + "px";
        }
    }
}

function resizeBoardLines() {
    let padding = `${boardEdgeLength}px`;
    for (let i = 0; i < boardNumRows; i++) {
        // Distance between neighboring lines
        let rowGap = boardLength / (boardNumRows - 1);
        
        let offset = boardEdgeLength + i * rowGap;
        let offsetStr = `${offset}px`; 

        // Set style
        let verLine = verLines[i];
        verLine.style.top = padding;
        verLine.style.bottom = padding;
        verLine.style.left = offsetStr;
        
        let horLine = horLines[i];
        horLine.style.top = offsetStr;
        horLine.style.left = padding;
        horLine.style.right = padding;
    }
}

function updateBoardSizeParams() {
    /**
     * Set parameters that control the appearance of the game board.
     * Specifically, set the following variables depending on size of 
     * the page:
     * 
     *   boardLength, boardEdgeLength, stoneDiameter, boardBorderRadius
     * 
     */
    let maxWidth = gameBody.clientWidth - 2 * boardEdgeLength;
    let gameBodyHeight = document.body.clientHeight * 0.85 - 128;
    boardLength = Math.min(gameBodyHeight, maxWidth);
    let lineGap = boardLength / (boardNumRows - 1);
    stoneDiameter = lineGap * 0.84;
    boardEdgeLength = stoneDiameter * 1;
    boardBorderRadius = stoneDiameter / 2;
}

function resizeBoard() {
    updateBoardSizeParams();
    updateBoardSize();
    resizeTileDivs();
    resizeBoardLines();
}

function isTileOccupied(x, y) {
    return board[x][y] != EMPTY;
}

function onClickDivAt(x, y) {
    if (!isPlaying) return
    if (!isTileOccupied(x, y)) {
        putStoneAt(x, y);
        if (!isWon(x, y)) {
            nextTurn();
        }
    }
}

function putStoneAt(x, y) {
    let tile = getTileDiv(x, y);
    if (isWhoseTurn == BLACK) {
        tile.style.backgroundColor = COLOR_STR_BLACK;
        tile.style.boxShadow = BOX_SHADOW_BLACK_STONE;
        tile.backgroundImage = BACKGROUND_IMAGE_STONE;
        board[x][y] = BLACK;
    } else if (isWhoseTurn == WHITE) {
        tile.style.backgroundColor = COLOR_STR_WHITE;
        tile.style.boxShadow = BOX_SHADOW_WHITE_STONE;
        tile.backgroundImage = BACKGROUND_IMAGE_STONE;
        board[x][y] = WHITE;
    }
    playPlaceStoneSound()
}

function nextTurn() {
    if (isWhoseTurn == BLACK) {
        isWhoseTurn = WHITE;
        leftStopwatch.stop();
        rightStopwatch.start();
    } else {
        isWhoseTurn = BLACK;
        rightStopwatch.stop();
        leftStopwatch.start();
    }
}

function getTileDiv(x, y) {
    // Return tile div at position (x, y)
    return tileDivs[x * boardNumRows + y];
}

function popupVictory(winningColor) {
    if (winningColor == BLACK) {
        setTimeout(function() {
            console.log("BLACK won")
            animationShowGamOverText("BLACK WON");
            setTimeout(function() {
                document.querySelector(".popupBarContainer").style.backgroundColor = "#000000aa";
            }, 2)
        }, 20)
    } else {
        setTimeout(function() {
            console.log("WHITE won")
            animationShowGamOverText("WHITE WON");
            setTimeout(function() {
                document.querySelector(".popupBarContainer").style.backgroundColor = "#ffffffaa";
            }, 2)
        }, 20)
    }
}

function isWon(x, y) {
    // Check if the given piece participate in a 5-in-a-row
    // empty, out of board (negative and bigger than length)
    
    let winningPos = getWinningPos(x, y)
    if (winningPos.length > 0) {
        // The stone at (x, y) caused a victory
        for (let pos of winningPos) highlightStone(pos[0], pos[1])
        popupVictory(board[x][y]);
        playVictoryMusic()
        endGame();
        return true;
    }
    return false;
}

function highlightStone(x, y) {
    let tile = getTileDiv(x, y);
    if (board[x][y] == BLACK) {
        tile.style.boxShadow = BOX_SHADOW_HIGHLIGHT_BLACK_STONE;
    } else {
        tile.style.boxShadow = BOX_SHADOW_HIGHLIGHT_WHITE_STONE;
    }
}

function isOutOfBounds(x, y) {
    return (x < 0 || x >= boardNumRows || y < 0 || y >= boardNumRows)
}

function getWinningPos(x, y) {
    // Return an array of pos that participate in winning rows
    function getConsecCountInDir(xStart, yStart, xDir, yDir) {
        let color = board[xStart][yStart]
        let x = xStart + xDir
        let y = yStart + yDir
        let count = 0
        while (!isOutOfBounds(x, y) && board[x][y] == color) {
            x += xDir
            y += yDir
            ++count
        }
        return count
    }
    
    let consecT = getConsecCountInDir(x, y, -1, 0)
    let consecB = getConsecCountInDir(x, y, 1, 0)
    let consecL = getConsecCountInDir(x, y, 0, -1)
    let consecR = getConsecCountInDir(x, y, 0, 1)
    let consecTL = getConsecCountInDir(x, y, -1, -1)
    let consecTR = getConsecCountInDir(x, y, -1, 1)
    let consecBL = getConsecCountInDir(x, y, 1, -1)
    let consecBR = getConsecCountInDir(x, y, 1, 1)
    
    let winningPos = []
    
    // vertical
    if (consecB + consecT >= 4) {
        for (let i = 1; i <= consecT; ++i) winningPos.push([x - i, y])
        for (let i = 1; i <= consecB; ++i) winningPos.push([x + i, y])
    }
    // horizontal
    if (consecL + consecR >= 4) {
        for (let i = 1; i <= consecL; ++i) winningPos.push([x, y - i])
        for (let i = 1; i <= consecR; ++i) winningPos.push([x, y + i])
    }
    // top left
    if (consecTL + consecBR >= 4) {
        for (let i = 1; i <= consecTL; ++i) winningPos.push([x - i, y - i])
        for (let i = 1; i <= consecBR; ++i) winningPos.push([x + i, y + i])
    }
    
    // top right
    if (consecTR + consecBL >= 4) {
        for (let i = 1; i <= consecTR; ++i) winningPos.push([x - i, y + i])
        for (let i = 1; i <= consecBL; ++i) winningPos.push([x + i, y - i])
    }
    if (winningPos.length > 0) winningPos.push([x, y])
    return winningPos
}

function initTimerStone() {
    leftTimerStone.style.backgroundColor = COLOR_STR_BLACK;
    leftTimerStone.style.boxShadow = BOX_SHADOW_BLACK_STONE;
    leftTimerStone.backgroundImage = BACKGROUND_IMAGE_STONE;
    rightTimerStone.style.backgroundColor = COLOR_STR_WHITE;
    rightTimerStone.style.boxShadow = BOX_SHADOW_WHITE_STONE;
    rightTimerStone.backgroundImage = BACKGROUND_IMAGE_STONE;
}

function initTimer() {
    initTimerStone()
    
    // Both player start with 0 time spent
    whiteTime = 0
    blackTime = 0
    leftStopwatch = new Stopwatch(leftTimerTextP, 20);
    rightStopwatch = new Stopwatch(rightTimerTextP, 20);

}

function hideBoardStones() {
    for (let tileDiv of tileDivs) {
        tileDiv.style.backgroundColor = COLOR_STR_TRANSPARENT;
        tileDiv.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
    }
}

function clearBoard() {
    setBoardArrayEmpty();
    hideBoardStones();
}

function startGameBtnClick() {
    if (!isPlaying) {
        animationRemoveGameOverText();
        startGame();
    } else {
        animationShowGamOverText("Game Over");
        endGame();
    }
}

function startStopwatch() {
    leftStopwatch.reset()
    rightStopwatch.reset()
    if (isWhoseTurn == BLACK) {
        leftStopwatch.start()
    } else if (isWhoseTurn == WHITE) {
        rightStopwatch.start()
    }
}

function startGame() {
    clearBoard()
    stopAudio()
    isWhoseTurn = BLACK
    // buttonStartGame.disabled = true
    // buttonEndGame.disabled = false
    buttonStartGame.textContent = "End Game"
    isPlaying = true
    
    // show pulse animation on board
    gameBoard.className = 'start'
    startStopwatch()
}

function endGameBtnClick() {
    animationShowGamOverText("Game Over");
    endGame();
}

function endGame() {
    isPlaying = false;
    gameBoard.className = '';
    // buttonStartGame.disabled = false;
    // buttonEndGame.disabled = true;
    buttonStartGame.textContent = "Start Game";

    leftStopwatch.stop()
    rightStopwatch.stop()
}

function goToMainMenu() {
    console.log("backToMainMenu()");
    window.location.href = "index.html";
}

function onResize() {
    resizeBoard();
}

function onLoad() {
    initTheme();
    initBoard();
    initTimer();
    setIsMutedAccordingToLocalStorage()
    window.onresize = onResize;
}


function onLoadSettings() {
    initBoardManager()
    initAudioManager()
}
