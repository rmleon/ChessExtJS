/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 This is the model of the board that keeps it everything together.  It represents the board with all its pieces.
 */
Ext.define("jChess.Board", {
    statics: {
        CODE_A: "A".charCodeAt(0),

        CODE_1: "1".charCodeAt(0),
    },

    config: {
        width: 8,

        height: 8,

/**
		 Initial positions
		*/
        initial: [
            ["white", "Pawn", ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2"]],
            ["white", "Rook", ["A1", "H1"]],
            ["white", "Knight", ["B1", "G1"]],
            ["white", "Bishop", ["C1", "F1"]],
            ["white", "Queen", ["D1"]],
            ["white", "King", ["E1"]],
            ["black", "Pawn", ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7"]],
            ["black", "Rook", ["A8", "H8"]],
            ["black", "Knight", ["B8", "G8"]],
            ["black", "Bishop", ["C8", "F8"]],
            ["black", "Queen", ["D8"]],
            ["black", "King", ["E8"]]
        ]
    },

    squares: {},

    pieces: [],

    turn: "white",
    // this value must be set to "white" or "black"
    constructor: function (config) {
        this.initConfig(config);

        this.getInitial().forEach(function (piece) {
            var color = piece[0];
            var className = "jChess." + piece[1];
            var positions = piece[2];
            positions.forEach(function (position) {
                this.addPiece(className, position, color);
            }, this)
        }, this);
        return this;
    },

    addPiece: function (className, position, color) {
        var newPiece = Ext.create(className, this, position, color);
        this.pieces.push(newPiece);
        this.squares[position] = newPiece;
        return newPiece;
    },

    calcCoordinates: function (piece, move) {
        var coordinates = piece.getCoordinates();
        if (!coordinates) {
            return null;
        }
        var x = coordinates[0],
            y = coordinates[1];
        if (move) {
            x += move[0];
            y += move[1];
        }
        if (x < 0 || x >= this.getWidth() || y < 0 || y >= this.getHeight()) {
            return null;
        }
        return [x, y];
    },

    calcPosition: function (piece, move) {
        var coordinates = this.calcCoordinates(piece, move);
        return coordinates ? String.fromCharCode(this.self.CODE_A + coordinates[0], this.self.CODE_1 + coordinates[1]) : null;
    },

/**
	 Utility function to check whether a movement would land in a opponent's piece or an empty square.
	 rule="empty" checks if the square is empty.
	 rule="opponent" checks if the square is occupied by the rival.
	 rule can be an array of rules to do an "OR" check.
	 */
    check: function (rule, piece, move) {
        if (Ext.isArray(rule)) {
            return rule.some(function (singleRule) {
                return this.check(singleRule, piece, move);
            }, this);
        }
        var newPosition = this.calcPosition(piece, move);
        if (rule == "empty") {
            if (newPosition == null) {
                return false;
            } else if (this.squares[newPosition]) {
                return false;
            }
            return true;
        } else if (rule == "opponent") {
            if (newPosition == null) {
                return false;
            } else if (this.squares[newPosition]) {
                var possibleOpponent = this.squares[newPosition];
                if (possibleOpponent.getColor() != piece.getColor()) {
                    return true;
                }
            }
            return false;
        } else {
            throw new Error("[" + Ext.getDisplayName(arguments.callee) + "] Rule \"" + rule + "\" hasn't been implemented");
        }
    },

    getCoordinates: function (position) {
        if (position) {
            var result = [];
            result.push(position.charCodeAt(0) - this.self.CODE_A);
            result.push(position.charCodeAt(1) - this.self.CODE_1);
            return result;
        } else {
            return null;
        }
    },

/**
	 Get the list of piece that can move
	*/
    getMovablePieces: function () {
        return this.pieces.filter(function (piece) {
            return (piece.getColor() == this.turn) && !Ext.isEmpty(this.validMoves(piece));
        }, this);
    },

/**
	 Get the list of pieces that cannot move
	 */
    getNotMovablePieces: function () {
        return this.pieces.filter(function (piece) {
            return piece.getColor() != this.turn || Ext.isEmpty(this.validMoves(piece));
        }, this);
    },

/**
	 What moves can this piece make
	*/
    validMoves: function (piece) {
        var moves = piece.moves();
        if (!Ext.isEmpty(moves)) {
            return moves.filter(function (move) {
                if (!Ext.isEmpty(move)) {
                    return this.calcCoordinates(piece, move) ? true : false;
                }
                return false;
            }, this);
        }
        return null;
    },

/**
	 What positions can this piece go to
	 */
    validPositions: function (piece) {
        var moves = this.validMoves(piece);
        if (moves) {
            return moves.map(function (move) {
                return this.calcPosition(piece, move);
            }, this);
        } else {
            return null;
        }
    },

/**
	 Can the piece go here
	*/
    isValidPosition: function (piece, position) {
        var validPositions = this.validPositions(piece);
        if (validPositions) {
            //console.log("'"+validPositions.join("', '")+"'");
            return Ext.Array.contains(validPositions, position);
        }
        return null;
    },

    isValidCoordinate: function (piece, coordinates) {
        if (coordinates) {
            var position = String.fromCharCode(this.self.CODE_A + coordinates[0], this.self.CODE_1 + coordinates[1]);
            return this.isValidPosition(piece, position);
        }
        return null;
    },

    pieceMoved: function (piece, newCoordinates) {
        var oldPosition = piece.getPosition();
        var newPosition = String.fromCharCode(this.self.CODE_A + newCoordinates[0], this.self.CODE_1 + newCoordinates[1]);
        var oldPiece = this.squares[newPosition];

        piece.setPosition(newPosition);
        if (oldPiece) {
            oldPiece.take();
        }
        delete this.squares[oldPosition];
        this.squares[newPosition] = piece;
        this.turn = this.turn == "white" ? "black" : "white";
        return newPosition;
    },

/**
	 We have a lucky pawn who made it all the way to the top
	 */
    promotePiece: function (pieceModel, newPieceModel) {
        var position = pieceModel.getPosition();
        newPieceModel.setPosition(position);
        pieceModel.promoted(); // Only Pawn implements this
        this.squares[position] = newPieceModel;
        this.pieces.push(newPieceModel);
    }
});