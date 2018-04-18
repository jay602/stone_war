// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        gravity: -1000,
        maxSpeed: cc.v2(400, 900),

        start_point : {
            default: null,
            type: cc.Node,
        },

        end_point : {
            default: null,
            type: cc.Node,
        },

        speed: cc.v2(120, 50),

        ctx: {
            default: null,
            type: cc.Graphics,
        },

        draw: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ctx = this.node.getChildByName("draw").getComponent(cc.Graphics);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);

        this.moveFlag = 0;

        this.anim = this.getComponent(cc.Animation);

        this.draw = this.node.parent.getChildByName("worldDraw").getComponent(cc.Graphics);

        this.jumping = false;
        this.startPointY = 0.0;
        this.jumpSpeedY = 0.0;

        this.start_point = this.node.getChildByName("start_point");
        this.end_point = this.node.getChildByName("end_point");
    },

    onKeyPressed: function (event) {
        cc.log("5555 press key: ", event.keyCode);
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.moveFlag != MOVE_LEFT) {
                    cc.log("6666 start move left");
                    this.moveFlag = MOVE_LEFT;
                    this.node.scaleX = 1;
                    this._playWalkAnim();
                }
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                if(this.moveFlag != MOVE_RIGHT) {
                    cc.log("6666 start move right");
                    this.moveFlag = MOVE_RIGHT;
                    this.node.scaleX = -1;
                    this._playWalkAnim();
                }
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                this.jump();
                break;
        }
    },
    
    onKeyReleased: function (event) {
        cc.log("5555 release key: ", event.keyCode);
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
            case cc.KEY.d:
            case cc.KEY.right:
                    cc.log("6666 stop move ");
                    this.anim.stop();
                    this.moveFlag = 0;               
                break;
        }
    },

    getSelfWorldPointAR: function() {
        return this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    },

    getSelfWorldPoint: function() {
        return this.node.convertToWorldSpace(cc.Vec2.ZERO);
    },

    _playWalkAnim: function() {
        if(this.anim && !this.jumping) {
            this.anim.play("pipi_walk");
        }
    },

    jump: function() {
        if (!this.jumping) {
            cc.log("6666 AvatarAction::start jump");
            this.jumping = true;
            this.startPointY = this.node.y;
            this.jumpSpeedY = 300;
            if(this.anim) {
                this.anim.play("pipi_jump"); 
            }
        }
    },

    start () {

    },

    update (dt) {
        var speedX = this.speed.x * dt;

        var p1 = this.start_point.getPosition();
        var p2 = this.end_point.getPosition();

        if(this.moveFlag == MOVE_LEFT) {
            cc.log("6666 move left ing %f", speedX);
            this.node.x -= speedX;
        } 
        else if (this.moveFlag == MOVE_RIGHT ) {
            cc.log("6666 move right ing %f", speedX);
            this.node.x += speedX;
        }  

        if(this.jumping) {
            this.jumpSpeedY +=  this.gravity * dt;

            if(Math.abs(this.jumpSpeedY) > this.maxSpeed.y) {
                this.jumpSpeedY = this.jumpSpeedY > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
             
            var speed = this.jumpSpeedY*dt
            this.node.y += speed;
            cc.log("7777 player is jump speed=%f", speed);
        }    

        var start = this.start_point.convertToWorldSpaceAR(cc.v2(0, 0));
        var end = this.end_point.convertToWorldSpaceAR(cc.v2(0, 0));
        var results = cc.director.getPhysicsManager().rayCast(start, end, cc.RayCastType.Closest);

        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var collider = result.collider;

            if(collider.node.name == "land_bg") {
                var foot_point = this.node.parent.convertToNodeSpace(result.point);
                cc.log("6666 foot_point(%f, %f)", foot_point.x, foot_point.y);
                cc.log("6666 self point(%f, %f)", this.node.x, this.node.y);
                this.node.y = foot_point.y;
                if(this.jumping) {
                    this.jumping = false;
                    this.anim.play("pipi_idle");
                }
                
                break;
            }
        }

           

        this.draw.clear();
        this.draw.moveTo(start.x, start.y);
        this.draw.lineTo(end.x, end.y);
        this.draw.stroke();
        
    },
});
