/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/

var KBEngine = require("kbengine");

KBEngine.Avatar = KBEngine.Entity.extend(
    {
        __init__ : function()
        {
            this._super();
            if(this.isPlayer()) {
                KBEngine.Event.fire("enterScene", KBEngine.app.entity_uuid, this.id, this);
            }
        },
                   
          
        onEnterWorld : function()
        {
            this._super();
            if(this.isPlayer()) {
                KBEngine.Event.fire("onAvatarEnterWorld", KBEngine.app.entity_uuid, this.id, this);
            }		
        },

        jump : function()
	    {
            cc.log("Avatar Jump Cell");
		    this.cellCall("jump");
        }, 
          
        onJump : function()
	    {
            cc.log("666 avatar %d otherAvatarOnJump", this.id);
		    KBEngine.Event.fire("otherAvatarOnJump", this);
  	    }, 
    });
    
    
    