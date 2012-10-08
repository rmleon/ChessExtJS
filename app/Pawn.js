/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Pawn implementation with some extra code to support promotion.
*/
Ext.define("jChess.Pawn", {

    extend: "jChess.Piece",

/**
	 Was the pawn promoted?
	*/
    isPromoted: false,

    moves: function () {
        var coordinates = this.getCoordinates();
        if (!coordinates) {
            return null;
        }
        var validMoves = [],
            sign = this.color == "white" ? 1 : -1;
        if (this.board.check("opponent", this, [-1, sign * 1])) { // Up left
            validMoves.push([-1, sign * 1]);
        }
        if (this.board.check("opponent", this, [1, sign * 1])) { // Up right
            validMoves.push([1, sign * 1]);
        }
        if (this.board.check("empty", this, [0, sign * 1])) { // Up one square
            validMoves.push([0, sign * 1]);
            if (this.color == "white" && coordinates[1] == 1 && this.board.check("empty", this, [0, 2])) { // If this is the first movement, it can advance two squares
                validMoves.push([0, 2]); // Advances two squares ahead from the white side
            } else if (this.color == "black" && coordinates[1] == 6 && this.board.check("empty", this, [0, -2])) {
                validMoves.push([0, -2]); // Advances two squares ahead from the black side
            }
        }
        // TODO: Add en passant movement
        return validMoves;
    },

    promoted: function () {
        this.isPromoted = true;
    },

    getPosition: function () {
        return this.taken || this.isPromoted ? null : this.position;
    }
});