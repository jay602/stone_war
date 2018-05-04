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

        startWalk: function()
        {
            cc.log("8989 avatar %d start walk, scaleX=%d", this.id);
            this.cellCall("startWalk");
        },

        onStartWalk: function()
        {
            cc.log("8989 other avatar %d start walk, scaleX=%d", this.id);
            KBEngine.Event.fire("otherAvatarOnStartWalk", this.id);
        },

        stopWalk: function(pos)
        {
            cc.log("8989 avatar %d stop walk, pos(%f, %f)", this.id, pos.x, pos.y);   
            var vec3 = new KBEngine.Vector3();
            vec3.x = pos.x;
            vec3.y = pos.y;
            vec3.z = 0.0;
            this.cellCall("stopWalk", pos);
        },

        onStopWalk: function(pos)
        {
            var v2 = new cc.Vec2();
            v2.x = pos.x;
            v2.y = pos.y;
            cc.log("8989 other avatar %d stop walk, pos(%f, %f)", this.id, v2.x, v2.y);   
            KBEngine.Event.fire("otherAvatarOnStopWalk", this.id, v2);
        },

        jump : function()
	    {
            cc.log("avatar %d cell jump", this.id);
		    this.cellCall("jump");
        }, 

        onJump : function()
	    {
            cc.log("other avatar %d onJump", this.id);
		    KBEngine.Event.fire("otherAvatarOnJump", this);
        }, 

        onPickUpItem : function(itemID, positon)
        {
            KBEngine.Event.fire("otherAvatarOnPickUpItem", this.id, itemID);
        },

        pickUpItem : function(itemID, pickPos)
	    {
            var vec3 = new KBEngine.Vector3();
            vec3.x = pickPos.x;
            vec3.y = pickPos.y;
            vec3.z = 0.0;
		    this.cellCall("pickUpItem", itemID, vec3);
        }, 
          
        throwItem : function(itemID, force)
        {
            var vec3 = new KBEngine.Vector3();
            vec3.x = force.x;
            vec3.y = force.y;
            vec3.z = 0.0;
		    this.cellCall("throwItem", itemID, vec3);
        },
         
        onThrowItem : function(itemID, force)
        {
            var v2 = new cc.Vec2();
            v2.x = force.x;
            v2.y = force.y;
		    KBEngine.Event.fire("otherAvatarThrowItem", this.id, itemID, v2);
        },

        onNewTurn : function(eid, second)
	    {
		    KBEngine.Event.fire("newTurn", eid, second);
        }, 

        newTurn : function()
	    {
            this.cellCall("newTurn");
        }, 

        resetItem: function(itemID)
        {
            this.cellCall("resetItem", itemID);
        },

        onResetItem: function(itemID)
        {
            cc.log("other avater=%d reset item=%d", this.id, itemID);
            KBEngine.Event.fire("otherAvatarResetItem", this.id, itemID);
        },

        recvDamage: function(itemID)
        {
            this.cellCall("recvDamage", itemID);
            cc.log(" 9090 avatar id=%d recvDamage from item=%d", this.id, itemID);
        },

        onRecvDamage: function(avatarID, harm, hp)
        {
            cc.log("avatar %d recv harm=%d, hp=%d", avatarID, harm, hp);
            KBEngine.Event.fire("onRecvDamage", avatarID, harm, hp);
        },
    });
    
    
    