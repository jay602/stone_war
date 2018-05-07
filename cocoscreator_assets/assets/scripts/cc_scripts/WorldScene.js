// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var KBEngine = require("kbengine");
const kPlayerStartX = 657;
const kPlayerStartY = 29;

const kOtherPlayerStartX = 105;
const kOtherPlayerStartY = 34;

var entitypos = 0;
var entityID = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

        pipiPrefab: {
            default: null,
            type: cc.Prefab,
        },

        popPrefab: {
            default: null,
            type: cc.Prefab,
        },

        camera: {
            default: null,
            type: cc.Camera,
        },

        cameraControl: {
            default: null,
            type: cc.Node,
        },

        gameState: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.keyBoardListener = null;
        this.mouseListener = null;
        this.curPlayerCount = 0;
        this.entities = {};
        this.playerControl = null;
        this.curAvatarID = 0;
        this.cameraControl = this.camera.getComponent("CameraControl");

        this.enablePhysicManager();
        //this.enablePhysicsDebugDraw();
        this.installEvents();
        this.items = new Array();

        this.gameState = this.node.getComponent("GameState");
    },

    enablePhysicManager: function () {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getPhysicsManager().enabled = true;
    },

    enablePhysicsDebugDraw: function() {
        var manager = cc.director.getCollisionManager();
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit |
        cc.PhysicsManager.DrawBits.e_rayCast;
    },

    installEvents : function() {
		// common
		KBEngine.Event.register("onDisconnected", this, "onDisconnected");
		KBEngine.Event.register("onConnectionState", this, "onConnectionState");
		KBEngine.Event.register("onReloginBaseappFailed", this, "onReloginBaseappFailed");
		KBEngine.Event.register("onReloginBaseappSuccessfully", this, "onReloginBaseappSuccessfully");

        // in world
        KBEngine.Event.register("onAvatarEnterWorld", this, "onAvatarEnterWorld");
		KBEngine.Event.register("onEnterWorld", this, "onEnterWorld");
        KBEngine.Event.register("onLeaveWorld", this, "onLeaveWorld");
        KBEngine.Event.register("updatePosition", this, "updatePosition");
       
        KBEngine.Event.register("set_position", this, "set_position");
        KBEngine.Event.register("newTurn", this, "newTurn");

        KBEngine.Event.register("otherAvatarOnJump", this, "otherAvatarOnJump");
        KBEngine.Event.register("otherAvatarOnPickUpItem", this, "otherAvatarOnPickUpItem");
        KBEngine.Event.register("otherAvatarThrowItem", this, "otherAvatarThrowItem");
        KBEngine.Event.register("otherAvatarOnStopWalk", this, "otherAvatarOnStopWalk");
        KBEngine.Event.register("otherAvatarOnStartWalk", this, "otherAvatarOnStartWalk");
        KBEngine.Event.register("otherAvatarResetItem", this, "otherAvatarResetItem");
        KBEngine.Event.register("onRecvDamage", this, "onRecvDamage");
        KBEngine.Event.register("onAvatarDie", this, "onAvatarDie");
        KBEngine.Event.register("onGameOver", this, "onGameOver");
    },

    onDisconnected : function() {
       cc.log("disconnect! will try to reconnect...");
    },
    
    onReloginBaseappTimer : function(self) {
       cc.log("will try to reconnect(" + this.reloginCount + ")...");
    },
    
    onReloginBaseappFailed : function(failedcode)
    {
        KBEngine.INFO_MSG("reogin is failed(断线重连失败), err=" + KBEngine.app.serverErr(failedcode));   
    },
        
    onReloginBaseappSuccessfully : function(){
        cc.log("reogin is successfully!(断线重连成功!)");	
    },
        
    onConnectionState : function(success){
        if(!success) {
            KBEngine.ERROR_MSG("Connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)");
        }
        else {
            KBEngine.INFO_MSG("Connect successfully, please wait...(连接成功，请等候...)");
        }
    },

    onEnterWorld: function (entity) {
        if(!entity.isPlayer()) {
            var ae = null;

            if(entity.className == "Avatar") {
                if(entity.modelID == 0) {
                    ae = cc.instantiate(this.pipiPrefab);
                }else if(entity.modelID == 1) {
                    ae = cc.instantiate(this.popPrefab);
                }
                var action = ae.addComponent("AvatarAction");
                var anim = ae.addComponent("AvatarAnim");
                cc.log("another avatar(id=%d, accountName=%s) enter world", entity.id, entity.accountName);
                //注意顺序： anim ---> action
                anim.setModelID(entity.modelID);
                anim.setAnim(ae.getComponent(cc.Animation));

                action.setModelID(entity.modelID);
                action.setAnim(anim);
                action.setEntityId(entity.id);
                action.setAccountName(entity.accountName);
                if(entity.direction.z >= 1)  {
                    ae.scaleX = 1;
                }else if(entity.direction.z <= -1) {
                    ae.scaleX = -1;
                }
                this.curPlayerCount++;
               
            }else if(entity.className == "Item") {
                cc.log("Item:%s enter world", entity.name);
                ae = cc.instantiate(ItemPrefabMap[entity.name]);
                var action = ae.addComponent("ItemAction");
                action.setPlayer(this.player);
                action.setItemID(entity.id);
                action.setHarm(entity.harm);

                this.items.push(ae);
            }
            this.node.addChild(ae);
            
            ae.setPosition(entity.position.x*SCALE,  entity.position.z*SCALE);
            this.entities[entity.id] = ae;
            cc.log("other entity %d join room, dir=%f", entity.id, entity.direction.z);
        }
    },

    onLeaveWorld: function (entity) {
        
    },

    onAvatarEnterWorld : function(rndUUID, eid, avatar){
        if(!this.player) {
            cc.log("player id=%d name=%s onAvatarEnterWorld", avatar.id, avatar.accountName);
            if(avatar.modelID == 0) {
                this.player = cc.instantiate(this.pipiPrefab);
            }else if(avatar.modelID == 1) {
                this.player = cc.instantiate(this.popPrefab);
            }

            var ctrl= this.player.addComponent("AvatarControl");
            var action= this.player.addComponent("AvatarAction");
            var anim= this.player.addComponent("AvatarAnim");
           
              //注意顺序： anim ---> action --->ctrl
            anim.setModelID(avatar.modelID);
            anim.setAnim(this.player.getComponent(cc.Animation));

            action.setAnim(anim);
            action.setModelID(avatar.modelID);
            action.setEntityId(avatar.id);
            action.setGameState(this.gameState);
            action.setHP(avatar.HP);

            ctrl.setPlayer(this.player);

            this.cameraControl.setTarget(this.player);
            this.node.addChild(this.player);
            this.player.setPosition(avatar.position.x*SCALE, avatar.position.z*SCALE);

            this.entities[avatar.id] = this.player;

            this.gameState.setPlayerHP(avatar.HP);
        }
    },

    otherAvatarOnJump: function(entity) {
        var ae = this.entities[entity.id];
		if(ae == undefined)
            return;
            
        ae.isOnGround = entity.isOnGround;
        if(!ae.isOnGround)
            return;

        var action = ae.getComponent("AvatarAction");
        action.onJump();
    },

    updatePosition : function(entity)
	{
        // 服务器同步到实体的新位置，我们需要将实体平滑移动到指定坐标点
        if(entity.className == "Item")
            return;

		var ae = this.entities[entity.id];
		if(ae == undefined)
            return;
    
        var player = KBEngine.app.player();
        if(player && player.inWorld && player.id == entity.id)
            return;
        
       
        ae.isOnGround = entity.isOnGround;
        if(entity.direction.z >= 1)  {
            ae.scaleX = 1;
        }else if(entity.direction.z <= -1) {
            ae.scaleX = -1;
        }
        var position = cc.p(entity.position.x*SCALE, entity.position.z*SCALE);
       // cc.log("8888 updatePosition, entityid=%d dir=%f position(%f, %f)", entity.id, entity.direction.z, position.x, position.y);
        var action = ae.getComponent("AvatarAction");
        action.onStartMove(position);
    },	  
    
    set_position: function(entity) {
        var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
		
		ae.x = entity.position.x * SCALE;
        ae.y = entity.position.z * SCALE;
        ae.setPosition(ae.x, ae.y);
    },

    setCameraTarget: function(entityID){
        var ae = this.entities[entityID];
		if(ae == undefined)
            return;
            
        this.cameraControl.setTarget(ae);
    },

    newTurn: function(avatarID, second){
        this.curAvatarID = avatarID;
        this.setCameraTarget(avatarID);
        cc.log("WorldScene::newTurn: eid=%d  playerID=%d second=%d", avatarID,  KBEngine.app.player().id, second);
       
        this.resetItem();
        this.gameState.newTurn(second);
        if(!this.gameState.isGameStart()) {
            this.gameState.setGameStart(true);
        }

        if(this.curAvatarID == KBEngine.app.player().id) {
            this.enableControlPlayer();
        }else {
            this.disEnableControlPlayer();
        }
    },


    resetItem: function() {
        for(var i in this.items) {
            var item = this.items[i];
            item.getComponent("ItemAction").setThrowed(false);
        }
    },

    otherAvatarOnPickUpItem: function(avatarID, itemID, position) {
        cc.log("WorldScene::otherAvatarOnPickUpItem: avatarID=%d, itemID=%d ", avatarID, itemID);
        var player = this.entities[avatarID];
        var item = this.entities[itemID];
        if(player == undefined || item == undefined)
            return;
        var action = player.getComponent("AvatarAction");
        action.setPlaceItem(item, position);
    },

    otherAvatarThrowItem: function(avatarID, itemID, force){
        cc.log("WorldScene::otherAvatarThrowItem: avatarID=%d, itemID=%d force(%f, %f)", avatarID, itemID, force.x, force.y);
        var player = this.entities[avatarID];
        var item = this.entities[itemID];
        if(player == undefined || item == undefined)
            return;
        
        this.setCameraTarget(itemID);
        var action = player.getComponent("AvatarAction");
        action.throwItem(item, force);
    },

    otherAvatarOnStopWalk: function(avatarID, pos){
        var player = this.entities[avatarID];
        if(player == undefined)
            return;

        cc.log("WorldScene::otherAvatarOnStopWalk: avatarID=%d, pos(%f, %f) ", avatarID, pos.x, pos.y);
        var action = player.getComponent("AvatarAction");
        action.onStopWalk(pos);
    },

    otherAvatarOnStartWalk: function(avatarID){
        var player = this.entities[avatarID];
        if(player == undefined)
            return;

        cc.log("WorldScene::otherAvatarOnStartWalk: avatarID=%d, scale=%f ", avatarID);
        var action = player.getComponent("AvatarAction");
        action.playWalkAnim();
    },

    otherAvatarResetItem: function(avatarID, itemID) {
        var player = this.entities[avatarID];
        var item = this.entities[itemID];
        if(player == undefined || item == undefined)
            return;

        player.getComponent("AvatarAction").reset();
        item.getComponent("ItemAction").setPlacePrePosition();
    },

    onRecvDamage: function(avatarID, harm, hp) {
        cc.log("WorldScene::otherAvatarRecvDamage: avatarID=%d, harm=%d, hp=%d ", avatarID, harm, hp);
        var player = this.entities[avatarID];
        if(player == undefined)
            return;

        var action = player.getComponent("AvatarAction");
        action.recvDamage(harm, hp);
    },

    onAvatarDie: function(avatarID) {
        cc.log("WorldScene::onAvatarDie, avatarid=%d", avatarID)
        var player = this.entities[avatarID];
        if(player == undefined)
            return;
        
        var anim = player.getComponent("AvatarAnim");
        var collider = player.getComponent(cc.PhysicsPolygonCollider);
        collider.sensor = true;
        anim.playDieAnim();
    },

    onGameOver: function(avatarID, isWin) {
        cc.log("WorldScene::onGameOver: avatarID=%d, win=%s, hp=%d ", avatarID, isWin.toString());
        if(avatarID == KBEngine.app.player().id) {
            if(this.player.name == PIPI_NAME) {
                GAME_RESULT = isWin ? PIPI_WIN : PIPI_LOSE;
            } else {
                GAME_RESULT = isWin ? POP_WIN : POP_LOSE;
            }

            if(isWin) {
                cc.director.loadScene("WinScene");
            } else {
                cc.director.loadScene("LoseScene");
            }
        }

        this.disEnableControlPlayer();
    },

    enableControlPlayer: function() {
        this.player.getComponent("AvatarControl").enableEventListen();
    },

    disEnableControlPlayer: function() {
        this.player.getComponent("AvatarControl").disEnableEventListen();
        this.player.getComponent("AvatarAction").reset();
    },
});
