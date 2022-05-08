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