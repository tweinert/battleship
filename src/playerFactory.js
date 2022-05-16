class Player {
    constructor() {

    }

    sendAttack(board, row, col) {
        board.receiveAttack(row, col);
    }

    sendRandomAttack(board) {
        let row = this.getRandomInt(10);
        let col = this.getRandomInt(10);
        board.receiveAttack(row, col);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
}

export default Player;