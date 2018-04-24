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

        hello : function() 
        {
            cc.log("item %d say hello", this.id);
        }
});
    
    
    