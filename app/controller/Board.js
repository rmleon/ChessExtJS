/**
 Author: Ricardo Leon
 Jan 2012
*/
Ext.require('jChess.view.Piece');

/**
 Main class in project.  Binds the board view and model.  It also setups the drag and drop for the view.
*/
Ext.define('jChess.controller.Board', {

    extend: 'Ext.app.Controller',

    views: ['Board', 'Piece'],

    refs: [{
        ref: 'board',
        selector: 'board'
    }, {
        ref: 'status',
        selector: '#status'
    }],

/**
	 piece sprites indexed by board position
	*/
    square: {},

/**
	 drag and drop proxies (for the sprites) indexed by board position
	*/
    pieceProxies: {},

    init: function () {
        var boardModel = Ext.create('jChess.Board');
        Ext.apply(this, {
            boardModel: boardModel
        });

        this.control({
            'board': {
                afterrender: function (boardView) {
                    var controller = this;
                    // Set up the Drag and Drop for the Pieces
                    boardModel.pieces.forEach(this.createPiece, this);

                    // Set up the drag and drop targets
                    boardView.items.each(function (square) {
                        var ddtarget = Ext.create('Ext.dd.DDTarget', square, 'pieces', {
                            boardX: square.boardX,
                            boardY: square.boardY,
                            ddGroup: 'pieces'
                        });
                    }, this);
                    this.nextTurn();
                }
            }
        });
    },

/**
	 Make sure that only the movable pieces have the proxy unlocked
	*/
    nextTurn: function () {
        // Unlock the movable pieces 
        var movablePieces = this.boardModel.getMovablePieces();
        movablePieces.forEach(function (piece) {
            var position = piece.getPosition();
            this.pieceProxies[position].unlock();
        }, this);
        // Lock unmovable pieces 
        var unmovablePieces = this.boardModel.getNotMovablePieces();
        unmovablePieces.forEach(function (piece) {
            var position = piece.getPosition();
            if (!Ext.isEmpty(position)) {
                this.pieceProxies[position].lock();
            }
        }, this);
        this.getStatus().removeAll();
        if (!Ext.isEmpty(movablePieces)) {
            this.getStatus().add({
                html: this.boardModel.turn + " plays next"
            });
        } else {
            this.getStatus().add({
                html: "There are no more pieces to move"
            });
        }
    },

/**
	 Tell the model that there was a play and prepare for the next turn
	*/
    movePiece: function (pieceModel, squareContainer) {
        var newCoordinates = [squareContainer.boardX, squareContainer.boardY];
        var oldPosition = pieceModel.getPosition();
        var newPosition = this.boardModel.pieceMoved(pieceModel, newCoordinates);
        // Update our local references
        this.pieceProxies[newPosition] = this.pieceProxies[oldPosition];
        delete this.pieceProxies[oldPosition];
        if (this.square[newPosition]) {
            this.getBoard().removePiece(this.square[newPosition], newCoordinates);
        }
        this.square[newPosition] = this.square[oldPosition];
        delete this.square[oldPosition];
        if (pieceModel instanceof jChess.Pawn) {
            if (this.boardModel.turn == 'black' && squareContainer.boardY == 7 || this.boardModel.turn == 'white' && squareContainer.boardY == 0) {
                this.selectPromotion(pieceModel);
            }
        }
        this.nextTurn();
    },

/**
	 This is called when a pawn reaches the other end
	 */
    promotePiece: function (pawnModel, newPieceName) {
        var oldPosition = pawnModel.getPosition();
        var oldCoordinates = pawnModel.getCoordinates();
        var newPieceModel = Ext.create('jChess.' + newPieceName, this.boardModel, oldPosition, pawnModel.getColor());
        // Remove it from the view
        this.getBoard().removePiece(this.square[oldPosition], oldCoordinates); // This is the board view
        this.boardModel.promotePiece(pawnModel, newPieceModel);
        delete this.pieceProxies[oldPosition];
        delete this.square[oldPosition];
        this.createPiece(newPieceModel);
        this.nextTurn();
    },

/**
	 Create the piece view, partially setups the drag and drop
	*/
    createPiece: function (pieceModel) {
        var pieceView = jChess.view.Piece.factory(pieceModel, this.getBoard());
        var coordinates = pieceModel.getCoordinates();
        var pieceSprite = this.getBoard().addPiece(pieceView, coordinates);
        var ddproxy = Ext.create('Ext.dd.DDProxy', pieceSprite, 'pieces', {
            isTarget: false,
            scroll: true,
            maintainOffset: true,
            constrainTo: this.getBoard().getEl(),
            constrain: true
        });
        ddproxy.constrainTo(this.getBoard().getEl());
        Ext.apply(ddproxy, this.overrides());
        ddproxy.pieceSprite = pieceSprite;
        pieceSprite.pieceModel = pieceModel;
        this.square[pieceModel.getPosition()] = pieceSprite;
        this.pieceProxies[pieceModel.getPosition()] = ddproxy;
    },

/**
	 Ask the user to select a piece for promotion
	*/
    selectPromotion: function (pawnModel) {
        var color = this.boardModel.turn == 'white' ? 'black' : 'white';
        var data = [
            ["Queen", "&#9819;", color],
            ["Rook", '&#9820;', color],
            ["Bishop", '&#9821;', color],
            ["Knight", '&#9822;', color]
        ];
        Ext.define('jChess.PieceOption', {
            extend: 'Ext.data.Model',
            fields: ['name', 'text', 'color']
        });
        var store = Ext.create('Ext.data.ArrayStore', {
            model: 'jChess.PieceOption',
            data: data
        });
        var dataView = Ext.create('Ext.view.View', {
            id: 'promotionPieces',
            deferInitialRefresh: false,
            store: store,
            tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '<div class="promote-square" name="{name}">', '<div style="text-align:center; width: 80px; height: 80px; color: {color}; font-size: 80px;"><div style="position:relative">{text}</div></div>', '<div style="font-weight:bold; text-align:center; height:20px;">{name}</div>', '</div>', '</tpl>'),
            itemSelector: 'div.promote-square',
            singleSelect: true,
            multiSelect: false,
        });

        var controller = this;

        var window = Ext.create('Ext.window.Window', {
            title: 'Select Promoted Piece',
            layout: 'fit',
            floating: true,
            items: dataView,
            height: 200,
            renderTo: Ext.getBody(),
            closable: false,
            modal: true,
            bbar: [{
                xtype: 'button',
                text: 'Select Promoted Piece',
                handler: function () {
                    var selectedItem = dataView.getSelectedNodes();
                    if (Ext.isEmpty(selectedItem)) {
                        Ext.Msg.alert('Select Promoted Piece', 'Please select the piece that you want to promote');
                    } else {
                        selectedItem = selectedItem[0];
                        var name = selectedItem.getAttribute('name');
                        controller.promotePiece(pawnModel, name);
                        window.close();
                    }
                }

            }]
        }).show();
    },

/**
	 New function implementations needed to get the drag and drop working
	*/
    overrides: function () {
        var controller = this;
        var boardModel = this.boardModel;
        var boardView = this.getBoard();
        return {
            onDragDrop: function (evtObj, targetElId) {
                Ext.fly(targetElId).removeCls('jChess-dropOK');
            },
            checkBeforeMove: function () {
                var squareContainer = this.squareContainer;
                if (squareContainer) {
                    var coordinates = [squareContainer.boardX, squareContainer.boardY];
                    if (!boardModel.isValidCoordinate(this.pieceSprite.pieceModel, coordinates)) {
                        return false;
                    }
                    return true;
                }
                return false;
            },
            onDragEnter: function (evtObj, targetElId) {
                var squareContainer = boardView.getSquareByElementId(targetElId);
                var coordinates = [squareContainer.boardX, squareContainer.boardY];
                this.squareContainer = squareContainer; // To be used by checkBeforeMove
                if (boardModel.isValidCoordinate(this.pieceSprite.pieceModel, coordinates)) {
                    Ext.fly(targetElId).addCls('jChess-dropOK');
                }
            },
            onDragOut: function (evtObj, targetElId) {
                Ext.fly(targetElId).removeCls('jChess-dropOK');
            },
            endDrag: function (e) {
                // Copied from Sencha ExtJS source code
                var lel = this.getEl();
                var del = this.getDragEl();
                if (this.checkBeforeMove()) { // Don't move if this is invalid
                    // Show the drag frame briefly so we can get its position
                    del.style.visibility = "";
                    this.beforeMove();
                    // Hide the linked element before the move to get around a Safari
                    // rendering bug.
                    lel.style.visibility = "hidden";
                    var animCfgObj = {
                        duration: 750,
                        to: {
                            x: this.squareContainer.getEl().getX(),
                            y: this.squareContainer.getEl().getY()
                        },
                        listeners: {
                            scope: this,
                            afteranimate: function () {
                                // Move the element to the real container
                                this.squareContainer.removeAll(true);
                                this.squareContainer.add(this.pieceSprite);
                                lel.style.left = 0;
                                lel.style.top = 0;
                            }
                        }
                    };
                    Ext.fly(lel).animate(animCfgObj);
                    controller.movePiece(this.pieceSprite.pieceModel, this.squareContainer);
                    del.style.visibility = "hidden";
                }
                lel.style.visibility = "";
                this.afterDrag();
            }
        };
    }
});