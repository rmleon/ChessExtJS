/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Abstract class for all pieces
 */
Ext.define("jChess.Piece", {
    taken: false,

    path: {},

    config: {
        color: null
    },

    constructor: function (board, position, color) {
        if (!Ext.isString(position)) {
            throw new Error("[" + Ext.getDisplayName(arguments.callee) + "] Position must be string: \"[Letter from A to H][Digit from 1-8]\"");
        }
        if (color != "white" && color != "black") {
            throw new Error("[" + Ext.getDisplayName(arguments.callee) + "] color must be white or black");
        }
        this.position = position;
        this.color = color;
        this.board = board;
        return this;
    },

    setPosition: function (position, turn) {
        if (this.taken) {
            throw new Error("[" + Ext.getDisplayName(arguments.callee) + "] This piece cannot be moved because it has been taken");
        }
        if (!Ext.isString(position)) {
            throw new Error("[" + Ext.getDisplayName(arguments.callee) + "] Position must be string: \"[Letter from A to H][Digit from 1-8]\"");
        }
        this.position = position;
        this.path[turn] = position;
        return this;
    },

    getPosition: function () {
        return this.taken ? null : this.position;
    },

/**
	 Mark this piece as taken by the opponent.
	 */
    take: function () {
        this.taken = true;
        return this;
    },

    getCoordinates: function () {
        return this.board.getCoordinates(this.getPosition());
    },

/**
	 Utility function that checks if the piece can move to the given square.  If it can move, it adds the move to the validMoves array.
	 If it cannot move beyond this point because the square is not empty, returns false.
	*/
    standardCheck: function (validMoves, move) {
        if (this.board.check(["empty", "opponent"], this, move)) {
            validMoves.push(move);
        }
        if (!this.board.check("empty", this, move)) { // If there is a piece in that square, stop
            return false;
        }
        return true;
    },

/**
	 Empty abstract function to be implemented by the subclasses.  It should return an array of valid moves.
	*/
    moves: Ext.emptyFn
});