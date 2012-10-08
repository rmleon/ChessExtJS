/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Self explanatory.  To see how "moves" works, see the jChess.Piece class.
 */
Ext.define("jChess.King", {
    extend: "jChess.Piece",

    moves: function () {
        var possibleMoves = [
            [-1, 1],
            [1, -1],
            [0, 1],
            [0, -1],
            [1, 1],
            [-1, -1],
            [-1, 0],
            [1, 0]
        ];
        // TODO: Check that the king won't be in check
        // TODO: Add castling move
        return possibleMoves.filter(function (move) {
            return this.board.check(["empty", "opponent"], this, move);
        }, this);
    }
});