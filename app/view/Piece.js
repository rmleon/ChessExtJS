/**
 Author: Ricardo Leon
 Jan 2012
*/
/**
 Mainly used to generate a simple object used to display the pieces
 */
Ext.define('jChess.view.Piece', {
    extend: 'Ext.draw.Sprite',

    alias: 'widget.piece',

    statics: {
/**
		 Called to generate simple objects used to render the pieces
		 */
        factory: function (pieceModel, boardView) {
            var baseSvgPiece = {
                type: 'text',
                font: !Ext.firefoxVersion? "80px Arial" : "120px Arial",
                fill: (pieceModel.getColor() == 'white' ? '#BBBBBB' : '#000000'),
                x: !Ext.firefoxVersion? 0 : 5,
                y: 40,
                width: 80,
                height: 80,
                pieceModel: pieceModel
            };

            switch (Ext.getClassName(pieceModel)) {
            case 'jChess.Pawn':
                baseSvgPiece.text = '&#9823;';
                break;
            case 'jChess.Knight':
                baseSvgPiece.text = '&#9822;';
                break;
            case 'jChess.Bishop':
                baseSvgPiece.text = '&#9821;';
                break;
            case 'jChess.Rook':
                baseSvgPiece.text = '&#9820;';
                break;
            case 'jChess.Queen':
                baseSvgPiece.text = '&#9819;';
                break;
            case 'jChess.King':
                baseSvgPiece.text = '&#9818;';
                break;
            default:
                throw new Error("Piece type unknown");
            }

            return Ext.create('Ext.draw.Component', {
                viewBox: false,
                width: 82,
                height: 82,
                items: [baseSvgPiece]
            });
        }
    }
});