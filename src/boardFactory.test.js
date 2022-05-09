import Board from './boardFactory';
import Ship from './shipFactory';

let board;
let ship;
beforeEach(() => {
    board = new Board();
    ship = new Ship(4);
});

it("Place ship at coords", () => {
    expect(board.placeShip(ship, 4, 4)).toBe("object");
});

it("Ship is detected at coords", () => {
    board.placeShip(ship, 5, 5);
    expect(board.receiveAttack(5, 5)).toBeTruthy();
    expect(board.receiveAttack(8, 8)).toBeFalsy();
});