class Board {
    constructor(z, x) {
        // Hard coded level for now -- make bridge NOT playable 
        this.board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
        this.pos1 = [z * -2 + 2, x * -2 + 1];
        this.pos2 = [undefined, undefined];
        // board[posY][posX] = 2;
        // 0 = sideways, 1 = along x, 2 = along y
        this.sideways = 0;
        // 0 = game in progress, 1 = player lost, 2 = player won
        this.state = 0;
    }

    //update the board to make bridge playable 
    boardUpdate() {
        this.board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    }

    movePlayer(direction) {
        let board = this.board;
        let sideways = this.sideways;
        let y1 = this.pos1[0];
        let x1 = this.pos1[1];
        let y2 = this.pos2[0];
        let x2 = this.pos2[1];
        switch (direction) {
            case "left":
                if (sideways === 0 && board[y1][x1 - 1] >= 1 && board[y1][x1 - 2] >= 1) {
                    this.sideways = 1;
                    this.pos1 = [y1, x1 - 2];
                    this.pos2 = [y1, x1 - 1];
                } else if (sideways === 2 && board[y1][x1 - 1] >= 1 && board[y2][x2 - 1] >= 1) {
                    this.pos1 = [y1, x1 - 1];
                    this.pos2 = [y2, x2 - 1];
                } else if (sideways === 1 && board[y1][x1 - 1] >= 1) {
                    this.sideways = 0;
                    this.pos1 = [y1, x1 - 1];
                    this.pos2 = [undefined, undefined];
                    if (board[this.pos1[0]][this.pos1[1]] === 2) {
                        this.state = 2;
                        console.log("YOU WIN"); 
                    }
                } else {
                    this.state = 1;
                }
                break;
            case "right":
                if (sideways === 0 && board[y1][x1 + 1] >= 1 && board[y1][x1 + 2] >= 1) {
                    this.sideways = 1;
                    this.pos1 = [y1, x1 + 1];
                    this.pos2 = [y1, x1 + 2];
                } else if (sideways === 2 && board[y1][x1 + 1] >= 1 && board[y2][x2 + 1] >= 1) {
                    this.pos1 = [y1, x1 + 1];
                    this.pos2 = [y2, x2 + 1];
                } else if (sideways === 1 && board[y2][x2 + 1] >= 1) {
                    this.sideways = 0;
                    this.pos1 = [y2, x2 + 1];
                    this.pos2 = [undefined, undefined];
                    if (board[this.pos1[0]][this.pos1[1]] === 2) {
                        this.state = 2;
                        console.log("YOU WIN"); 
                    }
                } else {
                    this.state = 1;
                }
                break;
            case "up":
                if (sideways === 0 && board[y1 - 1][x1] >= 1 && board[y1 - 2][x1] >= 1) {
                    this.sideways = 2;
                    this.pos1 = [y1 - 2, x1];
                    this.pos2 = [y1 - 1, x1];
                } else if (sideways === 1 && board[y1 - 1][x1] >= 1 && board[y2 - 1][x2] >= 1) {
                    this.pos1 = [y1 - 1, x1];
                    this.pos2 = [y2 - 1, x2];
                } else if (sideways === 2 && board[y1 - 1][x1] >= 1) {
                    this.sideways = 0;
                    this.pos1 = [y1 - 1, x1];
                    this.pos2 = [undefined, undefined];
                    if (board[this.pos1[0]][this.pos1[1]] === 2) {
                        this.state = 2;
                        console.log("YOU WIN"); 
                    }
                } else {
                    this.state = 1;
                }
                break;
            case "down":
                if (sideways === 0 && board[y1 + 1][x1] >= 1 && board[y1 + 2][x1] >= 1) {
                    this.sideways = 2;
                    this.pos1 = [y1 + 1, x1];
                    this.pos2 = [y1 + 2, x1];
                } else if (sideways === 1 && board[y1 + 1][x1] >= 1 && board[y2 + 1][x2] >= 1) {
                    this.pos1 = [y1 + 1, x1];
                    this.pos2 = [y2 + 1, x2];
                } else if (sideways === 2 && board[y2 + 1][x2] >= 1) {
                    this.sideways = 0;
                    this.pos1 = [y2 + 1, x2];
                    this.pos2 = [undefined, undefined];
                    if (board[this.pos1[0]][this.pos1[1]] === 2) {
                        this.state = 2;
                        console.log("YOU WIN"); 
                    }
                } else {
                    this.state = 1;
                }
                break;
        }
    }

    // Assumes the position being set is where the block is standing (not sideways)
    // Also assumes it is in a legal position
    reset(z, x) {
        this.pos1 = [z * -2 + 2, x * -2 + 1];
        this.pos2 = [undefined, undefined];
        this.sideways = 0;
        this.state = 0;

        // reset the board 
        this.board = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
                      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
                      [0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 0],
                      [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
                      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
    }

    // Takes in the world coordinate of the tile and the value to be assigned
    setTile(z, x, value){
        y = z * -2 + 2
        x = x * -2 + 1
        board[y][x] = value;
    }

}
