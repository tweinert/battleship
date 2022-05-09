class Ship {
    constructor(size, isVertical = true, hits = []) {
        this.size = size;
        this.hits = hits;
        this.isVertical = isVertical;
    }

    hit(position) {
        this.hits.push(position);
    }

    isSunk() {
        return this.hits.length == this.size;
    }

    // TODO need reference to ship
}

export default Ship;