/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Self explanatory.  To see how "moves" works, see the jChess.Piece class.
 */
Ext.define("jChess.Rook", {
    extend: "jChess.Piece",

    moves: function () {
        var coordinates = this.getCoordinates();
        if (!coordinates) {
            return null;
        }
        var x = coordinates[0],
            y = coordinates[1];
        var validMoves = [];
        for (var i = x + 1; i < this.board.getWidth(); i += 1) { // scan the table from left to right
            if (!this.standardCheck(validMoves, [-x + i, 0])) {
                break;
            }
        }

        for (var i = x - 1; i >= 0; i -= 1) { // scan the table from right to left
            if (!this.standardCheck(validMoves, [-x + i, 0])) {
                break;
            }
        }

        for (var j = y + 1; j < this.board.getHeight(); j += 1) { // scan the table from bottom to top
            if (!this.standardCheck(validMoves, [0, -y + j])) {
                break;
            }
        }

        for (var j = y - 1; j >= 0; j -= 1) { // scan the table from bottom to top
            if (!this.standardCheck(validMoves, [0, -y + j])) {
                break;
            }
        }

        return validMoves;
    }
});