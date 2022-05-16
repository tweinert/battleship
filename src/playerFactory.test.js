import Player from "./playerFactory";
import Ship from "./shipFactory";
import Board from "./boardFactory";

let player1;
let player2;
let board1;
let board2;
let board1Ship1;
let board1Ship2;
let board2Ship1;
let board2Ship2;
beforeEach(() => {
    player1 = new Player();
    player2 = new Player();
    board1 = new Board();
    board2 = new Board();
    board1Ship1 = new Ship(1);
    board1Ship2 = new Ship(2);
    board2Ship1 = new Ship(1);
    board2Ship2 = new Ship(2, false);
});

it("Can attack opponent's board", () => {
    board1.placeShip(board1Ship1, 3, 3);
    board1.placeShip(board1Ship2, 6, 6);
    board2.placeShip(board2Ship1, 4, 4);
    expect(board1.hasAllShipsSunk()).toBe(false);
    expect(board2.hasAllShipsSunk()).toBe(false);
    player2.sendAttack(board1, 3, 3);
    expect(board1.hasAllShipsSunk()).toBe(false);
    expect(board2.hasAllShipsSunk()).toBe(false);
    player2.sendAttack(board1, 6, 6);
    player2.sendAttack(board1, 7, 6);
    expect(board1.hasAllShipsSunk()).toBe(true);
    expect(board2.hasAllShipsSunk()).toBe(false);
});

it("Computer can make random move", () => {
    expect(() => player1.sendRandomAttack(board1)).not.toThrow(Error);
});
