import Ship from './shipFactory';

const SIZE = 10;

class Board {    
    constructor(grid = [], hits = []) {
        this.grid = grid;
        this.hits = hits;
        this.initialize();
    }

    initialize() {
        // create grid and hits
        this.grid = Array.from(Array(SIZE), () => new Array(SIZE));
        this.hits = Array.from(Array(SIZE), () => new Array(SIZE));
    }

    placeShip(ship, row, col) {
        this.grid[row][col] = ship;
        return typeof(this.grid[row][col]);
    }

    receiveAttack(row, col) {
        // check if ship is at coords
        if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null) {
            this.grid[row][col].hit(1);
            // TODO need way to determine what ship part to hit
            return true;
        } else {
            this.hits[row][col] = true;
            return false;
        }
        // if true, send hit to ship
        // if false, record coords of miss
    }
}

export default Board;