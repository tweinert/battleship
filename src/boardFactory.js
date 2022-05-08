import Ship from './shipFactory';

const SIZE = 10;

class Board {    
    constructor(grid = []) {
        this.grid = grid;
        this.initialize();
    }

    initialize() {
        // create grid
        this.grid = Array.from(Array(SIZE), () => new Array(SIZE));
    }

    placeShip(ship, row, col) {
        this.grid[row][col] = ship;
        return typeof(this.grid[row][col]);
    }
}

export default Board;