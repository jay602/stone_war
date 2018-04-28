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


cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

        camera: {
            default: null,
            type: cc.Camera,
        },

        cameraControl: {
            default: null,
            type: cc.Node,
        },

        canvas: {
            default: null,
            type: cc.Node,
        },

        item: {
            default: null,
            type: cc.Node,
        },

        itemBody: {
            default: null,
            type: cc.RigidBody,
        },

        itemID : 0,

        enableEvent: false,
    },

    onLoad () {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);
        this.canvas = cc.find("Canvas");
        this.createEventListener();
        this.camera = cc.find("Camera").getComponent(cc.Camera);
        this.cameraControl = cc.find("Camera").getComponent("CameraControl");
    },

    enableEventListen: function() {
        cc.log("enableEventListen");
        this.enableEvent = true;
    },

    disEnableEventListen: function() {
        cc.log("disEnableEventListen");
        this.enableEvent = false;
    },

    isEnable: function() {
        return this.enableEvent;
    },


    enableMouseEvent: function() {
        cc.log("AvatarControl::enableMouseEvent");
        this.canvas.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.canvas.on(cc.Node.EventType.MOUSE_UP, this.starThrowItem, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        if(this.item) {
            this.item.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },

    disEnableMouseEvent: function() {
        cc.log("AvatarControl::disEnableMouseEvent");
        this.canvas.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.canvas.off(cc.Node.EventType.MOUSE_UP, this.starThrowItem, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        if(this.item) {
            this.item.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },

    createEventListener: function () {
            var self = this;
            var keyBoardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function(keyCode, event){
                    if(!self.enableEvent) return;
                    cc.log("AvatarControl press key=%d", keyCode);
                    switch(keyCode) {
                        case cc.KEY.a: 
                            self.player.leftWalk();
                            break;
            
                        case cc.KEY.d:
                            self.player.rightWalk();
                            break;
            
                        case cc.KEY.w:
                            self.player.jump();
                            break;
                    };
                },
                onKeyReleased: function(keyCode, event){
                    if(!self.enableEvent) return;
                    cc.log("AvatarControl release key=%d", keyCode);
                    switch(keyCode) {
                        case cc.KEY.a: 
                        case cc.KEY.d:
                            self.player.stopWalk();                          
                            break;
                        };
                },
            }
        );  

        cc.eventManager.addListener(keyBoardListener, 1);
    },

    onKeyPressed: function (keyCode, event) {
        if(!this.enableEvent) return;
       // cc.log("789 press key: ", keyCode);
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.player) {
                    this.player.leftWalk();
                }
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                if(this.player) {
                    this.player.rightWalk();
                }
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                if(this.player) {
                    this.player.jump();
                }
                break;
        }
    },
    
    onKeyReleased: function (keyCode, event) {
        if(!this.enableEvent) return;
        cc.log("789 release key: ", keyCode);
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.player){
                    this.player.stopWalk();
                }
                
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                if(this.player) {
                    this.player.stopWalk();
                }
                break;
        }
    },

    setPlayer: function(player) {
        if(player) {
            this.player = player.getComponent("AvatarAction");
        }
    },

    adjustThrow: function(event) {
        if(!this.enableEvent) return;

        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var v2 = new cc.Vec2();
        v2.x = pos.x;
        v2.y = pos.y;

        this.player.adjustThrow(v2);
    },

    starThrowItem: function(event) {
        if(!this.enableEvent) return;

        cc.log("player start throw item");
        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var v2 = new cc.Vec2();
        v2.x = pos.x;
        v2.y = pos.y;

        if(this.item) {
            cc.log("carama settarget item");
            this.cameraControl.setTarget(this.item);
        }
        
        this.player.throw(v2);
        this.itemBody = this.item.getComponent(cc.RigidBody);
        this.disEnableMouseEvent();
    },

    pickUpItem: function(item, itemID, pickPos) {
        if(!this.enableEvent) return;

        cc.log("AvatarControl pickUpItem:");
        this.player.pickUpItem(item, itemID, pickPos);
        this.item = item;
       
        this.enableMouseEvent();
    },

    update: function (dt) {
        var player = KBEngine.app.player();
        if(player == undefined || !player.inWorld)
            return;
    
        player.position.x = this.node.x/SCALE;
        player.position.y = 0;
        player.position.z = this.node.y/SCALE;
        player.isOnGround = this.player.isOnGround;
        player.direction.z = this.player.node.scaleX;
       
        if( this.item && this.item.getPosition().y<-100 ||
          this.itemBody && this.itemBody.linearVelocity.equals(cc.Vec2.ZERO)
          ) {
                this.item.getComponent("ItemAction").setThrowed(false);
                this.item = null;
                this.itemBody = null;
                player.newTurn();
        }
        
    },
});
