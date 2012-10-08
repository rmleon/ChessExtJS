/**
 Author: Ricardo Leon
 Jan 2012
*/
Ext.define("jChess.Bishop", {
    extend: "jChess.Piece",

    moves: function () {
        var coordinates = this.getCoordinates();
        if (!coordinates) {
            return null;
        }
        var x = coordinates[0],
            y = coordinates[1];
        var validMoves = [];
        var i;

        for (i = x + 1; i < this.board.getWidth(); i += 1) { // scan the table from left to right
            if (!this.standardCheck(validMoves, [-x + i, -x + i])) {
                break;
            }
        }

        for (i = x - 1; i >= 0; i -= 1) { // scan the table from right to left
            if (!this.standardCheck(validMoves, [-x + i, -x + i])) {
                break;
            }
        }

        for (i = x + 1; i < this.board.getWidth(); i += 1) { // scan the table from left to right
            if (!this.standardCheck(validMoves, [-x + i, x - i])) {
                break;
            }
        }

        for (i = x - 1; i >= 0; i -= 1) { // scan the table from right to left
            if (!this.standardCheck(validMoves, [-x + i, x - i])) {
                break;
            }
        }

        return validMoves;
    }
});