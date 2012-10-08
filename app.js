/**
 Author: Ricardo Leon
 Jan 2012
*/
Ext.require('Ext.panel.Panel');

/**
This gets all the jChess app started by drawing the board and the two windows on the right side
*/
Ext.application({
    name: 'jChess',

    controllers: ['Board'],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                title: 'jChess by Ricardo Leon',
                layout: 'hbox',
                items: [{
                    xtype: 'board',
                    padding: '1px'
                }, {
                    xtype: 'panel',
                    layout: 'auto',
                    title: false,
                    items: [{
                        xtype: 'panel',
                        layout: 'fit',
                        collapsible: true,
                        title: 'Instructions',
                        html: "Drag and drop the pieces to play",
                        padding: '1px'
                    }, {
                        xtype: 'panel',
                        itemId: 'status',
                        layout: 'fit',
                        collapsible: true,
                        title: 'Status',
                        padding: '1px'
                    }]
                }]
            }]
        });
    }
});