import Board from "./boardFactory";
import Player from "./playerFactory";
import Ship from "./shipFactory";

let playerBoard;
let computerBoard;
let player1;
let player2;

function startGame() {
    playerBoard = new Board();
    computerBoard = new Board();
    player1 = new Player(true);
    player2 = new Player(false);

    refreshGameBoard(playerBoard, true);
    refreshGameBoard(computerBoard, false);
}

function refreshGameBoard(board, isPlayer) {
    // display grid squares
    // const computerBoardDiv = document.getElementById("computer-board");

    let boardDiv;
    if (isPlayer) {
        boardDiv = document.querySelector("#player-board");
    } else {
        boardDiv = document.querySelector("#computer-board");
    }

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const gridSquare = document.createElement("div");

            gridSquare.classList.add("gridSquare");
            gridSquare.setAttribute("style", "width:48px; height:48px");
            gridSquare.id = i + ", " + j;

            boardDiv.appendChild(gridSquare);
        }
    }
}

export default startGame;
