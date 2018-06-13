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

        pickTouchRange: {
            default: null,
            type: cc.Node,
        },

        itemID : 0,

        enableEvent: false,
    },

    onLoad () {
        this.canvas = cc.find("Canvas");
        this.camera = cc.find("Camera").getComponent(cc.Camera);
        this.cameraControl = cc.find("Camera").getComponent("CameraControl");

        this.sky = cc.find("World/sky_bg");
        this.skyBox = this.sky.getBoundingBoxToWorld();

        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);
        this.itemBox = null;
       
        if(!cc.sys.isMobile) {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
    },

    setTouchControl: function(touchControl) {
        this.touchControl = touchControl;
        this.stickBg = this.touchControl.getChildByName("joyStickBg");
        this.oriStickPos = this.stickBg.position;
        this.stick = this.stickBg.getChildByName("joyStick");
        this.touchRadius = this.touchControl.getBoundingBoxToWorld().width/2;
        this.stickBgRadius = this.stickBg.getBoundingBoxToWorld().width/2;

        this.pickTouchRange = cc.find("touchRange");
        this.pickTouchRange.active = true;

        this.createTouchEvent();
    },

    createTouchEvent: function() {
        this.touchControl.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.touchControl.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.touchControl.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.touchControl.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded, this);

        this.pickTouchRange.on(cc.Node.EventType.TOUCH_START, this.touchPickIem, this);
        this.pickTouchRange.on(cc.Node.EventType.TOUCH_MOVE, this.touchAdjustThrow, this);
        this.pickTouchRange.on(cc.Node.EventType.TOUCH_END, this.touchStartThrow, this);
        this.pickTouchRange.on(cc.Node.EventType.TOUCH_CANCEL, this.touchStartThrow, this);
    },

    enableEventListen: function() {
        this.enableEvent = true;
    },

    disEnableEventListen: function() {
        this.enableEvent = false;
    },

    isEnable: function() {
        return this.enableEvent;
    },

    enableMouseEvent: function() {
        this.canvas.on(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
        this.canvas.on(cc.Node.EventType.MOUSE_UP, this.starThrowItem, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
        this.node.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        if(this.item) {
            this.item.on(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
            this.item.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },

    disEnableMouseEvent: function() {
        this.canvas.off(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
        this.canvas.off(cc.Node.EventType.MOUSE_UP, this.starThrowItem, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
        this.node.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        if(this.item) {
            this.item.off(cc.Node.EventType.MOUSE_MOVE, this.mouseAdjustThrow, this);
            this.item.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },

    onKeyDown: function(event) {
        if(!this.enableEvent) return;
        //cc.log("AvatarControl press key=%d", keyCode);
        switch(event.keyCode) {
            case cc.KEY.a: 
                this.player.leftWalk();
                break;

            case cc.KEY.d:
                this.player.rightWalk();
                break;

            case cc.KEY.w:
                this.player.jump();
                break;
        };
    },

    onKeyUp: function(event) {
        if(!this.enableEvent) return;
                   // cc.log("AvatarControl release key=%d", keyCode);
        switch(event.keyCode) {
            case cc.KEY.a: 
            case cc.KEY.d:
                this.player.stopWalk();                          
                break;
            };
    },

    setPlayer: function(player) {
        if(player) {
            this.player = player.getComponent("AvatarAction");
        }
    },

    touchControlPlayer: function(point) {
        var angle =  Math.atan2(point.y, point.x) * (180/Math.PI); 
       // KBEngine.INFO_MSG("angle = " + angle);
        //向右走
        if( (angle > -90 && angle < 0 || angle > 0 && angle < 30)  && this.player)  
        {  
           // KBEngine.INFO_MSG("right walk");
            this.player.rightWalk();
        } 
        else if( (angle < -90 && angle >= -180 || angle <= 180 && angle > 150) && this.player)  
        {
          //  KBEngine.INFO_MSG("left walk");
            this.player.leftWalk();
        }
        else if(angle >= 30 && angle <= 60 && this.player)  
        {
            this.player.touchRightJump();
        }
        else if(angle >= 120 && angle <= 150 && this.player)  
        {
           // KBEngine.INFO_MSG("left jump");
           this.player.touchLeftJump();
        }
        else if(angle > 60 && angle < 120 && this.player)  
        {
          //  KBEngine.INFO_MSG("jump");
            this.player.jump();
        }
    },

    resetJoyStick: function() {
        this.stickBg.setPosition(this.oriStickPos);
        this.stick.setPosition(0, 0);
    },

    onTouchBegan: function(event) {
        if(!this.enableEvent) return;
        
        var touchPos = this.touchControl.convertToNodeSpaceAR(event.getLocation());
        var len = cc.pDistance(touchPos, cc.v2(0, 0));

       KBEngine.INFO_MSG("onTouchBegan: pos(" + touchPos.x + ", " + touchPos.y + "," + "  Radius = " + this.touchRadius);
      
        this.stickBg.setPosition(touchPos);
    } ,

    onTouchMoved: function(event) {
        if(!this.enableEvent) return;

        var touchPos = this.stickBg.convertToNodeSpaceAR( event.getLocation());
        var len = cc.pDistance(touchPos, this.stickBg.position);

       // console.log("onTouchMoved: pos(%f, %f) radius=%s", touchPos.x, touchPos.y, this.touchRadius);
        
        var normal = touchPos.normalize();
        var point = normal.mul(this.stickBgRadius);
        this.stick.setPosition(point);
        this.touchControlPlayer(point);
        
    } ,

    onTouchEnded: function(event) {
        if(!this.enableEvent) return;

       // console.log("onTouchEnded");
        this.stickBg.setPosition(this.oriStickPos);
        this.stick.setPosition(0, 0);
        if(this.player) {
            this.player.stopWalk();
        }
    } ,

    touchPickIem: function(event) {
        if(!this.enableEvent) return;
        
        if(this.player) {
            var pos = this.camera.getCameraToWorldPoint(event.getLocation());
            var item = this.player.touchPickItem(pos);

            if(item)  this.item = item;
        }
    },

    touchAdjustThrow: function(event) {
        if(!this.enableEvent) return;

        if(this.player) {
            var pos = this.camera.getCameraToWorldPoint(event.getLocation());
            this.player.touchAdjustThrow(pos);
        }
    },
    
    touchStartThrow: function(event) {
        if(!this.enableEvent) return;

        if(this.player) {
            if(this.item) this.cameraControl.setTarget(this.item);
            var pos = this.camera.getCameraToWorldPoint(event.getLocation());
            var point = new cc.Vec2(pos.x, pos.y);
            this.player.throw(point);
        }
    },

    mouseAdjustThrow: function(event) {
        if(!this.enableEvent) return;

        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var point = new cc.Vec2(pos.x, pos.y);
        this.player.adjustThrow(point);
    },

    starThrowItem: function(event) {
        if(!this.enableEvent) return;

        cc.log("player start throw item");
        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var point = new cc.Vec2(pos.x, pos.y);
       
        if(this.item) {
            cc.log("carama settarget item");
            this.cameraControl.setTarget(this.item);
        }
        
        this.player.throw(point);

        if(!cc.sys.isMobile) {
            this.disEnableMouseEvent();
        }
    },

    pickUpItem: function(item, itemID, pickPos) {
        if(!this.enableEvent) return;

        cc.log("AvatarControl pickUpItem:");
        this.player.onMousePickUpItem(item, itemID, pickPos);
        this.item = item;
       
        if(!cc.sys.isMobile) {
            this.enableMouseEvent();
        }
    },

    checkItemOutRange: function() {
        var ret = false;
        if(this.item) {
            this.skyBox = this.sky.getBoundingBoxToWorld();
            this.itemBox = this.item.getBoundingBoxToWorld();

            if(this.itemBox.xMax < this.skyBox.xMin || this.itemBox.xMin > this.skyBox.xMax || this.itemBox.yMin < this.skyBox.yMin) {
                ret = true;
            } 
        }

        return ret;
    },

    update: function (dt) {
        var player = KBEngine.app.player();
        if(player == undefined || !player.inWorld)
            return;
    
        //同步位置
        player.position.x = this.node.x/SCALE;
        player.position.y = 0;
        player.position.z = this.node.y/SCALE;
        player.isOnGround = this.player.isOnGround;
        player.direction.z = this.player.node.scaleX;

        //扔出石头后，石头出界或停下来就新的一轮
        if(this.item) {
            var itemAction = this.item.getComponent("ItemAction");
            var isOutRange = this.checkItemOutRange();
            var itemSpeed = this.item.getComponent(cc.RigidBody).linearVelocity.mag();
            if( itemAction.isThrowed && (isOutRange ||itemSpeed == 0) ) {
                cc.log("new turn");
                itemAction.setThrowed(false);
                this.item = null;
                player.newTurn();

                //出界就产生新的石头
                if(isOutRange) {
                    player.resetItem(itemAction.itemID);
                }
            }
        }
    },
});
