/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 A placeholder to keep track of all the components displayed in the browser.
 */
Ext.define('jChess.view.Board', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.board',

    layout: {
        type: 'table',
        columns: 8
    },

    initComponent: function () {
        this.callParent(arguments);

        var items = [];
        for (var i = 0; i < 8; i += 1) {
            for (var j = 0; j < 8; j += 1) {
                items.push(
                Ext.create('Ext.container.Container', {
                    itemId: i * 8 + j,
                    width: 82,
                    height: 82,
                    layout: 'fit',
                    style: {
                        backgroundColor: (i + (j % 2)) % 2 == 0 ? '#EEEEFF' : '#3333FF',
                    },
                    boardX: j,
                    boardY: 7 - i
                }));
            }
        }
        this.add(items);
    },

    addPiece: function (pieceView, coordinates) {
        var i = coordinates[0] + (7 - coordinates[1]) * 8;
        var newPieceSprite = this.getComponent(i).add(pieceView);
        return newPieceSprite;
    },

    removePiece: function (pieceView, coordinates) {
        var i = coordinates[0] + (7 - coordinates[1]) * 8;
        this.getComponent(i).removeAll(true);
    },

    getSquare: function (coordinates) {
        var i = coordinates[0] + (7 - coordinates[1]) * 8;
        this.getComponent(i);
    },

    getSquareByElementId: function (elementId) {
        for (var i = 0; i < 8 * 8; i += 1) {
            if (this.getComponent(i).getEl().id == elementId) {
                return this.getComponent(i);
            }
        }
        return null;
    }
});