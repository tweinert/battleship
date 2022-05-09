import Board from './boardFactory';
import Ship from './shipFactory';

let board;
let ship1;
let ship2;
let ship4;
beforeEach(() => {
    board = new Board();
    ship1 = new Ship(1);
    ship2 = new Ship(2, false);
    ship4 = new Ship(4);
});

it("Place ship at coords", () => {
    expect(board.placeShip(ship1, 4, 4)).toBe("object");
});

it("Ship is detected at coords", () => {
    board.placeShip(ship1, 5, 5);
    expect(board.receiveAttack(5, 5)).toBeTruthy();
    expect(board.receiveAttack(8, 8)).toBeFalsy();
});

it("Ship length is correctly placed", () => {
    board.placeShip(ship4, 5, 5);
    board.placeShip(ship2, 1, 2);
    // vertical
    expect(board.receiveAttack(5, 5)).toBeTruthy();
    expect(board.receiveAttack(6, 5)).toBeTruthy();
    expect(board.receiveAttack(7, 5)).toBeTruthy();
    expect(board.receiveAttack(8, 5)).toBeTruthy();
    expect(board.receiveAttack(9, 5)).toBeFalsy();
    // horizontal
    expect(board.receiveAttack(1, 2)).toBeTruthy();
    expect(board.receiveAttack(2, 2)).toBeFalsy();
    expect(board.receiveAttack(1, 3)).toBeTruthy();
    expect(board.receiveAttack(1, 4)).toBeFalsy();
});

it("Ship can be sunk", () => {
    board.placeShip(ship2, 1, 2);
    board.receiveAttack(1, 2);
    expect(ship2.isSunk()).toBeFalsy();
    board.receiveAttack(1, 3);
    expect(ship2.isSunk()).toBeTruthy();
});