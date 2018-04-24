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

        maxPlayerCount: 2,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.keyBoardListener = null;
        this.mouseListener = null;
        this.curPlayerCount = 0;
        this.entities = {};
        this.playerControl = null;
        this.curEntityId = 0;
        this.cameraControl =this.camera.getComponent("CameraControl");

        this.enablePhysicManager();
       // this.enablePhysicsDebugDraw();
        this.installEvents();
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
		KBEngine.Event.register("onKicked", this, "onKicked");
		KBEngine.Event.register("onDisconnected", this, "onDisconnected");
		KBEngine.Event.register("onConnectionState", this, "onConnectionState");
		KBEngine.Event.register("onReloginBaseappFailed", this, "onReloginBaseappFailed");
		KBEngine.Event.register("onReloginBaseappSuccessfully", this, "onReloginBaseappSuccessfully");

        // in world
        KBEngine.Event.register("onAvatarEnterWorld", this, "onAvatarEnterWorld");
		KBEngine.Event.register("onEnterWorld", this, "onEnterWorld");
        KBEngine.Event.register("onLeaveWorld", this, "onLeaveWorld");
        KBEngine.Event.register("updatePosition", this, "updatePosition");
        KBEngine.Event.register("otherAvatarOnJump", this, "otherAvatarOnJump");
        KBEngine.Event.register("set_position", this, "set_position");
        KBEngine.Event.register("startPlay", this, "startPlay");
    },

    onKicked : function(failedcode){
        
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

                //注意顺序： anim ---> action
                anim.setModelID(entity.modelID);
                anim.setAnim(ae.getComponent(cc.Animation));

                action.setModelID(entity.modelID);
                action.setAnim(anim);
                action.setEntityId(entity.id);
                
                this.curPlayerCount++;
            }else if(entity.className == "Item") {
                cc.log("Item:%s enter world", entity.name);
                ae = cc.instantiate(ItemPrefabMap[entity.name]);
                var action = ae.addComponent("ItemAction");
                action.setPlayer(this.player);
               // action.setCamera(this.camera);
            }
            
            this.node.addChild(ae);
            ae.setPosition( entity.position.x*SCALE,  entity.position.z*SCALE);
            this.entities[entity.id] = ae;
            cc.log("other  join room");
        }
    },

    onLeaveWorld: function (entity) {
        
    },

    onAvatarEnterWorld : function(rndUUID, eid, avatar){
        if(!this.player) {
            cc.log("player id=%d onAvatarEnterWorld", avatar.id);
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

            ctrl.setPlayer(this.player);

            this.cameraControl.setTarget(this.player);
            this.node.addChild(this.player);
            this.player.setPosition(avatar.position.x*SCALE, avatar.position.z*SCALE);

            this.entities[avatar.id] = this.player;
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
		var ae = this.entities[entity.id];
		if(ae == undefined)
			return;
        ae.isOnGround = entity.isOnGround;
        
        var action = ae.getComponent("AvatarAction");
        var position = cc.p(entity.position.x*SCALE, entity.position.z*SCALE);
        action.setPosition(position);
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

    startPlay: function(entityID){
        this.curEntityId = entityID;
        this.setCameraTarget(entityID);
        cc.log("666 WorldScene::startPlay: eid=%d  playerID=%d", entityID,  KBEngine.app.player().id);
        if(this.curEntityId == KBEngine.app.player().id) {
            this.enableControlPlayer();
        }
    },
    
    enableControlPlayer: function() {
        this.player.getComponent("AvatarControl").enableEventListen();
    },

    disEnableControlPlayer: function() {
        this.player.getComponent("AvatarControl").disEnableEventListen();
    },

    update: function (dt) {
        
    },


    start () {
                
    },

});
