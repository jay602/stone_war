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
		    this.cellCall("jump");
        }, 

        newTurn : function(eid)
	    {
            cc.log("0000 avatar %d newTurn", this.id);
		    KBEngine.Event.fire("newTurn", eid);
        }, 

        onJump : function()
	    {
            cc.log("0000 avatar %d otherAvatarOnJump", this.id);
		    KBEngine.Event.fire("otherAvatarOnJump", this);
        }, 

        onPickUpItem : function(itemID)
        {
            cc.log("0000 other avatar %d pick up item=%d", this.id, itemID);
            KBEngine.Event.fire("otherAvatarOnPickUpItem", this.id, itemID);
        },

        pickUpItem : function(itemID)
	    {
            cc.log("0000 avatar %d pick up item=%d", this.id, itemID);
		    this.cellCall("pickUpItem", itemID);
  	    }, 
         
    });
    
    
    