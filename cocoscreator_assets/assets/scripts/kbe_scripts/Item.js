/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/

var KBEngine = require("kbengine");

KBEngine.Item = KBEngine.Entity.extend(
    {
        __init__ : function()
        {
            this._super();
            
        },
                   
        onEnterWorld : function()
        {
            this._super();
        },
});
    
    
    