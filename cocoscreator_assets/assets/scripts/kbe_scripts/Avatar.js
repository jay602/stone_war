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
            console.log("Fire onEnterWorld");
            this._super();
            if(this.isPlayer()) {
                KBEngine.Event.fire("onAvatarEnterWorld", KBEngine.app.entity_uuid, this.id, this);
                console.log("Fire onAvatarEnterWorld 111");
                console.log("-----------------------");
            }		
        },


        startWalk: function()
        {
            cc.log("8989 avatar %d start walk, scaleX=%d", this.id);
            this.cellCall("startWalk");
        },

        onStartWalk: function()
        {
            cc.log("other avatar %d start walk, scaleX=%d", this.id);
            KBEngine.Event.fire("otherAvatarOnStartWalk", this.id);
        },

        stopWalk: function(pos)
        {
            cc.log("avatar %d stop walk, pos(%f, %f)", this.id, pos.x, pos.y);   
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
            cc.log("other avatar %d stop walk, pos(%f, %f)", this.id, v2.x, v2.y);   
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
            var point = new cc.Vec2(positon.x, positon.y);
            KBEngine.Event.fire("otherAvatarOnPickUpItem", this.id, itemID, point);
            console.warn("otherAvatarOnPickUpItem  " + itemID);
        },

        pickUpItem : function(itemID, pos)
	    {
            var vec3 = new KBEngine.Vector3();
            vec3.x = pos.x;
            vec3.y = pos.y;
            vec3.z = 0.0;
            this.cellCall("pickUpItem", itemID, vec3);
            console.warn("cellCall: avatar pick item = %d pos(%f, %f)", itemID, pos.x, pos.y);
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
            var v2 = new cc.Vec2(force.x, force.y);
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
            KBEngine.Event.fire("otherAvatarResetItem", this.id, itemID);
        },

        recvDamage: function(itemID)
        {
            this.cellCall("recvDamage", itemID);
            KBEngine.INFO_MSG("avatar " + this.id + " recvDamage from item=" + itemID);
        },

        onRecvDamage: function(avatarID, harm, hp)
        {
            KBEngine.INFO_MSG("avatar " + avatarID + " recv harm=" + harm + " hp=" + hp);
            KBEngine.Event.fire("onRecvDamage", avatarID, harm, hp);
        },

        onDie: function(avatarID)
        {
            KBEngine.INFO_MSG("avatar " + avatarID + " die");
            KBEngine.Event.fire("onAvatarDie", avatarID);
        },

        onGameOver: function(isWin)
        {
            KBEngine.INFO_MSG("Game is over: avatar " + this.id + "win= " + isWin.toString());
            KBEngine.Event.fire("onGameOver", this.id, isWin);
        },
    });
    
    
    