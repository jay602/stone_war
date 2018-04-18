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
        speed: 6,
        modelID : 0,
        gravity: -1000,
        jumpSpeed: 300,
        maxSpeed: cc.v2(400, 600),
        speedY : 300,
        moveFlag : 0,
        isCollision : false,
        isOnGround : true,
        walkAnim : null,
        jumpAnim : null,
        idleAnim : null,
        startPoint : null,
        dir: 0,
        anim: {
            default: null,
            type: cc.Animation,
        },

        item: {
            default: null,
            type: cc.Node,
        }
    },

    onLoad () {
      
    },

    start () {

    },

   setModelID: function(num) {
        this.modelID = num;
        if(this.modelID == 0) {
            this.walkAnim = "pipi_walk";
            this.jumpAnim = "pipi_jump";
            this.idleAnim = "pipi_idle";
        }else if(this.modelID == 1){
            this.walkAnim = "pop_walk";
            this.jumpAnim = "pop_jump";
            this.idleAnim = "pop_idle";
        }
    },

   playWalkAnim: function() {
        if(this.anim) {
            this.anim.play(this.walkAnim);
        }
    },

    playJumpAnim: function() {
        if(this.anim) {
            this.anim.play(this.jumpAnim);
        }
    },

    stopPlayAnim: function() {
        if(this.anim) {
            this.anim.stop();
            this.anim.play(this.idleAnim);
        }
    },

    setSpeed: function(speed) {
        this.speed = speed;
    },

    clearItem: function() {

    },

    setDirection: function(dir) {
        this.dir = dir;
    },

    calcDirection: function (dx, dy) 
    {
        // 坐标系 →x ↑y， 0 当前方向不变， 1 到 4 分别为右、上、左、下        
        if (dx > 0 && dx >= Math.abs(dy))
        {
            return MOVE_RIGHT; // 右
        }
        else if (dx < 0 && Math.abs(dx) >= Math.abs(dy))
        {
            return MOVE_LEFT; // 左
        }
        // else if (dy > 0 && dy >= Math.abs(dx))
        // {
        //     return MOVE_UP; // 上
        // }
        // else if (dy < 0 && Math.abs(dy) >= Math.abs(dx))
        // {
        //     return MOVE_DOWN; // 下
        // }
        
        return NOT_MOVE; // 当前方向不变
    },

    moveToPosition: function(position) {
        this.clearItem();
        cc.log("123 tarPos(%f, %f) curPos(%f, %f)", position.x, position.y, this.node.x, this.node.y);
        var x = position.x - this.node.x;
        var y = position.y - this.node.y;
        this.setDirection(this.calcDirection(x, y));
        cc.log("123: entity %d posChange(%f, %f), dir=%d", this.modelID, x, y, this.dir);
        this.updateAnim();
    },

    updateAnim: function(){
        if(this.dir==MOVE_LEFT) {
            this.node.scaleX = this.modelID==0 ? 1 : -1;
            this.playWalkAnim();
        }else if(this.dir == MOVE_RIGHT) {
            this.node.scaleX = this.modelID==0 ? -1 : 1;
            this.playWalkAnim();
        }
    },

    onMoveToPositionOver: function(pSender) {
        this.stopPlayAnim();
        this.isMoving = false;
    },

    onCollisionEnter: function (other, self) {
        if(self.tag == 333) {
            self.node.y += 1.5;
            this.isCollision = true;
            if(this.jumping) {
                this.jumping = false;
                this.offsetY = 0;
                this.moveFlag = 0;
                this.stopPlayAnim();
            }
        } else if(self.tag == 444) {
            self.node.x += 5;
        }
    },
    
    onCollisionStay: function (other, self) {
        if(self.tag == 333) {
            self.node.y += 1.5;
        } else if(self.tag == 444) {
            if(this.moveFlag === MOVE_LEFT) {
                self.node.x += 1.5;
            } 
            else if (this.moveFlag === MOVE_RIGHT) {
                self.node.x -= 1.5;
            }
        }
    },

    addAxisX: function(num) {
        this.node.x += num;
    },

    addAxisY: function(num) {
        this.node.y += num;
    },

    onCollisionExit: function (other) {
        this.isCollision = false;
    },

    update: function (dt) {
        if(!this.isCollision && !this.jumping){
            this.addAxisY(-1);
        }

        var  isStop = true;
        if(this.moveFlag == MOVE_LEFT) {
            this.addAxisX(-1);
            this.isCollision = false;
            isStop = false;
        } 
        else if (this.moveFlag == MOVE_RIGHT ) {
            this.addAxisX(1);
            this.isCollision = false;
            isStop = false;
        }  

        if(this.jumping) {
            this.speedY +=  this.gravity * dt;
            if(Math.abs(this.speedY) > this.maxSpeed.y) {
                this.speedY = this.speedY > 0 ? this.maxSpeed.y : -this.maxSpeed.y;
            }
            this.addAxisY(this.speedY*dt);
            isStop = false;
        }
    },

  

});
