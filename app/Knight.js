/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Self explanatory.  To see how "moves" works, see the jChess.Piece class.
 */
Ext.define("jChess.Knight", {
    extend: "jChess.Piece",

    moves: function () {
        if (this.taken) {
            return null;
        }
        var possibleMoves = [
            [-2, 1], // Left up
            [-1, 2], // Left up
            [1, 2], // Right up
            [2, 1], // Right up
            [2, -1], // Right dowm
            [1, -2], // Right down
            [-1, -2], // Left down
            [-2, -1] // Left down
            ];
        return possibleMoves.filter(function (move) {
            return this.board.check(["empty", "opponent"], this, move);
        }, this);
    }
});