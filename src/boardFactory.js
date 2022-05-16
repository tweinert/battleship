import Ship from './shipFactory';

const SIZE = 10;

class Board {    
    constructor(grid = [], gridHits = []) {
        this.grid = grid;
        this.gridHits = gridHits;
        this.initialize();
    }

    initialize() {
        // create grid and missedShots
        this.grid = Array.from(Array(SIZE), () => new Array(SIZE));
        this.gridHits = Array.from(Array(SIZE), () => new Array(SIZE));
    }

    placeShip(ship, row, col) {
        if(ship.isVertical) {
            // go down from start pos
            for (let i = row; i < (ship.size + row); i++) {
                this.grid[i][col] = ship;
            }
            return typeof(this.grid[row][col]);
        } else {
            // go right from start pos
            for (let i = col; i < ship.size + col; i++) {
                this.grid[row][i] = ship;
            }
        }
        
    }

    receiveAttack(row, col) {
        // check if ship is at coords
        // if true, send hit to ship
        // if false, record coords of miss
        // TODO check if square has already been shot
        if (this.gridHits[row][col]) {
            throw new Error("Square has already been shot");
        }
        if (typeof this.grid[row][col] === "object" && this.grid[row][col] !== null) {
            this.grid[row][col].hit(1);
            this.gridHits[row][col] = true;
            return true;
        } else {
            this.gridHits[row][col] = true;
            return false;
        }
    }

    isMissedShot(row, col) {
        return this.gridHits[row][col]
            && typeof this.grid[row][col] !== "object";
    }

    hasAllShipsSunk() {
        // TODO ensure there are ships on the board if necessary
        // row
        for (let row = 0; row < SIZE; row++) {
            // col
            for (let col = 0; col < SIZE; col++) {
                // if ship and not hit
                if(typeof this.grid[row][col] === "object" && this.grid[row][col] !== null && !this.gridHits[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }
}

export default Board;