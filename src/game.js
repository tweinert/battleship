import Board from "./boardFactory";
import Player from "./playerFactory";
import Ship from "./shipFactory";

let playerBoard;
let computerBoard;
let player1;
let player2;

let shipSmallBoard1;
let shipMedBoard1;
let shipLargeBoard1;

let shipSmallBoard2;
let shipMedBoard2;
let shipLargeBoard2;

let isPlayerTurn = true;

function startGame() {
    playerBoard = new Board();
    computerBoard = new Board();
    player1 = new Player(true);
    player2 = new Player(false);

    shipSmallBoard1 = new Ship(2);
    shipMedBoard1 = new Ship(3);
    shipLargeBoard1 = new Ship(4);

    shipSmallBoard2 = new Ship(2);
    shipMedBoard2 = new Ship(3);
    shipLargeBoard2 = new Ship(4);

    placeShips();

    refreshGameBoard(playerBoard, true);
    refreshGameBoard(computerBoard, false);
}

function refreshGameBoard(board, isPlayer) {
    let boardDiv;

    if (isPlayer) {
        boardDiv = document.querySelector("#player-board");
    } else {
        boardDiv = document.querySelector("#computer-board");
    }

    boardDiv.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const gridSquare = document.createElement("div");

            gridSquare.classList.add("gridSquare");
            gridSquare.setAttribute("style", "width:48px; height:48px");
            gridSquare.id = i.toString() + j.toString();

            if(!isPlayer) {
                gridSquare.addEventListener("click", playerSendAttack, false);
            }

            // TODO this is not functional, this does not work
            let gridContent = board.getGridContent(i, j);
            gridSquare.classList.add(gridContent);
            if (gridContent === "grid-miss") {
                gridSquare.textContent = "o";
            } else if (gridContent === "grid-ship-hit") {
                gridSquare.textContent = "X";
            }

            boardDiv.appendChild(gridSquare);
        }
    }

    if (board.hasAllShipsSunk()) {
        if (!isPlayer) {
            alert("You is Win");
        } else {
            alert("You is Lose");
        }
    }
}

function playerSendAttack(event) {
    if (isPlayerTurn) {
        let coords = event.currentTarget.id;
        let row = coords.charAt(0);
        let col = coords.charAt(1);

        computerBoard.receiveAttack(row, col);

        if (computerBoard.getGridContent(row, col) !== "grid-ship-hit") {
            isPlayerTurn = false;
            computerSendAttack();
        }

        refreshGameBoard(computerBoard, false);
    }
}

function computerSendAttack() {
    let gridContent;
    do {
        gridContent = player2.sendRandomAttack(playerBoard);
    } while (gridContent === "grid-ship-hit" || gridContent === "grid-hit");

    refreshGameBoard(playerBoard, true);

    isPlayerTurn = true;
}

// TODO change to take inputs from form
function placeShipsFixed() {
    playerBoard.placeShip(shipSmallBoard1, 0, 0);
    playerBoard.placeShip(shipMedBoard1, 0, 2);
    playerBoard.placeShip(shipLargeBoard1, 0, 5);

    computerBoard.placeShip(shipSmallBoard2, 0, 0);
    computerBoard.placeShip(shipMedBoard2, 0, 2);
    computerBoard.placeShip(shipLargeBoard2, 0, 5);
}

function placeShips() {
    let shipSmallRow = Number(document.getElementById("ship-small-row").value);
    let shipSmallCol = Number(document.getElementById("ship-small-col").value);

    let shipMedRow = Number(document.getElementById("ship-med-row").value);
    let shipMedCol = Number(document.getElementById("ship-med-col").value);
    
    let shipLargeRow = Number(document.getElementById("ship-large-row").value);
    let shipLargeCol = Number(document.getElementById("ship-large-col").value);

    playerBoard.placeShip(shipSmallBoard1, shipSmallRow, shipSmallCol);
    console.log("1");
    playerBoard.placeShip(shipMedBoard1, shipMedRow, shipMedCol);
    console.log("2");
    playerBoard.placeShip(shipLargeBoard1, shipLargeRow, shipLargeCol);
    console.log("3");

    computerBoard.placeShip(shipSmallBoard2, getRandomInt(8), getRandomInt(10));
    computerBoard.placeShip(shipMedBoard2, getRandomInt(7), getRandomInt(10));
    computerBoard.placeShip(shipLargeBoard2, getRandomInt(6), getRandomInt(10));
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

export default startGame;
