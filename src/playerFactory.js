class Player {
    constructor() {

    }

    sendAttack(board, row, col) {
        board.receiveAttack(row, col);
    }
}

export default Player;