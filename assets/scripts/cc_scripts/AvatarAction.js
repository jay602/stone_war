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
        gravity: -1000,

        jumpSpeed: cc.v2(300, 300),
        maxSpeed: cc.v2(400, 600),
        walkspeed: cc.v2(120, 50),
        jumpSpeedY : 0,

        jumping : false,
        isOnGround : true,

        moveFlag : 0,
        modelID : 0,
        leftDir: 1,
        rightDir: -1,
        eid:0,

        drawNode: {
            default: null,
            type: cc.Node,
        },

        anim: {
            default: null,
            type: cc.Node,
        },

        start_point : {
            default: null,
            type: cc.Node,
        },

        end_point : {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {
        this.start_point = this.node.getChildByName("start_point");
        this.end_point = this.node.getChildByName("end_point");
        this.drawNode = cc.find("worldDraw");
        this.ctx = this.drawNode.getComponent(cc.Graphics);
        this.targetPosition = null;
        this.isCollision = false;
    },

    start () {

    },

    setEntityId: function(eid) {
        this.eid = eid;
    },

    getSelfWorldPointAR: function() {
        return this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    },

    getSelfWorldPoint: function() {
        return this.node.convertToWorldSpace(cc.Vec2.ZERO);
    },

    setModelID: function(num) {
        this.modelID = num;
        if(this.modelID == 0) {
            this.leftDir = 1;
            this.rightDir = -1;
        }else if(this.modelID == 1) {
            this.leftDir = -1;
            this.rightDir = 1;
        }
    },

    addAxisX: function(num) {
        this.node.x += num;
    },

    addAxisY: function(num) {
        this.node.y += num;
    },

    changAxisY: function(num) {
        this.node.y = num;
    },

    changAxisX: function(num) {
        this.node.x += num;
    },

    leftWalk: function() {
        if(this.moveFlag == MOVE_LEFT) 
            return;

        this.moveFlag = MOVE_LEFT;
        if(!this.jumping) {
            this.node.scaleX = this.leftDir;
        }
           
        this._playWalkAnim();
    },

    rightWalk: function() {
        if(this.moveFlag == MOVE_RIGHT) 
            return;

        this.moveFlag = MOVE_RIGHT;
        if(!this.jumping) {
            this.node.scaleX = this.rightDir;
        }
        
        this._playWalkAnim();
    },

    _playWalkAnim: function() {
        if(!this.jumping && this.anim) {
            this.anim.playWalkAnim();
        }
    },

    stopWalk: function() {
        if(!this.jumping && this.moveFlag!=STATIC) {
            //this.moveFlag &= ~MOVE_LEFT;
            this.moveFlag = STATIC;
            if(this.anim){
                this.anim.stopPlayAnim();
            }
        }
    },

    jump: function() {
        this._jump();
        if(this.jumping) {
            var player = KBEngine.app.player();
            if(player != undefined && player.inWorld) {
                player.jump()
            }
        }
    },

    _jump: function() {
        if (!this.jumping) {
            this.jumping = true;
            this.jumpSpeedY = this.jumpSpeed.y;
            if(this.anim) {
                this.anim.playJumpAnim(); 
            }
        }
    },

    onJump: function() {
        this._jump();
    },

    setAnim: function(anim) {
        this.anim = anim;
    },

    setPosition: function(position) {
        this.targetPosition = position;
        var dx = position.x - this.node.x;
       
        if (dx > 1) // 右
        {
            this.rightWalk();
        }
        else if (dx < -1) //左
        {
            this.leftWalk();
        }
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        cc.log("8888 onBeginContact selfCollider.tag=%d", selfCollider.tag);
        cc.log("8888 onBeginContact otherCollider.tag=%d", otherCollider.tag);
        if(otherCollider.tag == 999) {
            contact.disabled = true;
            this.isCollision = true;
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        cc.log("8888 onEndContact selfCollider.tag=%d", selfCollider.tag);
        cc.log("8888 onEndContact otherCollider.tag=%d", otherCollider.tag);
        if(otherCollider.tag == 999) {
            this.isCollision = false;
        }
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        cc.log("8888 onPreSolve selfCollider.tag=%d", selfCollider.tag);
        cc.log("8888 onPreSolve otherCollider.tag=%d", otherCollider.tag);
        if(otherCollider.tag == 999) {
            contact.disabled = true;
            this.isCollision = true;
        }
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        cc.log("8888 onPostSolve selfCollider.tag=%d", selfCollider.tag);
        cc.log("8888 onPostSolve otherCollider.tag=%d", otherCollider.tag);
        // if(otherCollider.tag == 999) {
        //     cc.log("888 selfCollider.sensor=%s", selfCollider.sensor.toString());
        //     selfCollider.sensor = false;
        // }
        
    },
    
   
    update: function(dt) {
        var player = KBEngine.app.player();
        var speedX = this.walkspeed.x * dt;
        var results = null;

        this.ctx.clear();

        if(this.moveFlag == MOVE_LEFT) {
            if(player.id == this.eid) {
                if(!this.isCollision) {
                    this.addAxisX(-speedX);
                }
            }else {
                if(this.node.x >= this.targetPosition.x) {
                    this.addAxisX(-speedX);
                }else {
                    this.stopWalk();
                }
            }
        } 
        else if (this.moveFlag == MOVE_RIGHT ) {
            if(player.id == this.eid) {
                if(!this.isCollision) {
                    this.addAxisX(speedX);
                }
            }else {
                if(this.node.x <= this.targetPosition.x) {
                    this.addAxisX(speedX);
                }else {
                    this.stopWalk();
                }
            }
        }  

        if(this.jumping) {
            this.jumpSpeedY +=  this.gravity * dt;

            if(Math.abs(this.jumpSpeedY) > this.maxSpeed.y) {
                this.jumpSpeedY = this.jumpSpeedY > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }

            this.addAxisY(this.jumpSpeedY*dt);
            this.isOnGround = false;
        }

        var start = this.start_point.convertToWorldSpaceAR(cc.v2(0, 0));
        var end = this.end_point.convertToWorldSpaceAR(cc.v2(0, 0));
        results = cc.director.getPhysicsManager().rayCast(start, end, cc.RayCastType.Closest);
        // cc.log("6666 down rayCast Result Count=%d", results.length);
        // cc.log("7777 down rayCast: start(%f, %f)  end(%f, %f)", start.x, start.y, end.x, end.y);

        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        this.ctx.stroke();

        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var collider = result.collider;
            //cc.log("6666 down rayCast Result %d  name: %s,  point(%s, %s)", i, collider.node.name, result.point.x, result.point.y);
            if(collider.node.name == "land_bg") {
                var foot_point = this.node.parent.convertToNodeSpace(result.point);
                this.node.y = foot_point.y;
                this.isOnGround = true;
                if(this.jumping) {
                    this.jumping = false;
                    this.moveFlag = STATIC;
                    this.anim.playIdleAnim();
                }
                break;
            }
        }

       
    },

});
