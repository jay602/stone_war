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

        jumpSpeed: cc.v2(300, 505),
        maxSpeed: cc.v2(400, 550),
        walkspeed: cc.v2(110, 50),
        jumpSpeedY : 0,
        maxThrowSpeed: cc.v2(800, 800),

        jumping : false,
        isOnGround : true,

        moveFlag : 0,
        modelID : 0,
        leftDir: 1,
        rightDir: -1,
        eid:0,
        accountName: "",

        labelName: {
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

        arrow : {
            default: null,
            type: cc.Node,
        },

        leftHand: {
            default: null,
            type: cc.Node,
        },

        rightHand: {
            default: null,
            type: cc.Node,
        },

        testNode1:{
            default: null,
            type: cc.Node,
        },

        testNode2:{
            default: null,
            type: cc.Node,
        },

        basePoint: {
            default: null,
            type: cc.Node,
        },

        item_point: {
            default: null,
            type: cc.Node,
        },

        item: {
            default: null,
            type: cc.Node,
        },

        playerRigidBody: {
            default: null,
            type: cc.RigidBody,
        },

        gameState: {
            default: null,
            type: cc.Node,
        },

        hp: {
            default: null,
            type: cc.Label,
        },

        harm: {
            default: null,
            type: cc.Node,
        },
    },

    onLoad () {
        this.start_point = this.node.getChildByName("start_point");
        this.end_point = this.node.getChildByName("end_point");
        this.item_point = this.node.getChildByName("item_point");
        this.basePoint = this.node.getChildByName("basePoint");
        this.labelName = this.node.getChildByName("name");
        
        this.arrow = this.node.getChildByName("arrow");
        this.arrow.active = false;

        this.leftHand = this.node.getChildByName("leftHand");
        this.rightHand = this.node.getChildByName("rightHand");

        this.harm = this.node.getChildByName("harm");

        this.hpProcessBar = this.node.getChildByName("hpProcessBar");
        this.hpProcessBar.active = false;

        this.hp = this.hpProcessBar.getChildByName("hp");

        this.testNode1 = cc.find("testNode1");
        this.testNode2 = cc.find("testNode2");
        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);

        this.playerRigidBody = this.node.getComponent(cc.RigidBody);

        this.targetPosition = null;
        this.isCollideLand = false;
        this.hasPickUpItem = false;
        this.arrowAngle = 0.0;
        this.itemID = 0;
        this.hpValue = 100;
        this.itemPoint = null;
        this.items = [];
    },

    addItem: function(item){
        this.items.push(item);
    },

    removeItem: function(item){
        for(var i = 0; i < this.items.length; i++) {
            if(item.name == this.items[i].name) {
                this.items.splice(i, 1);
                break;
            }
        }
    },

    setAccountName: function(name) {
        this.accountName = name;
    },

    setHP: function(hp){
        this.hpValue = hp;
    },

    start () {
        this.showOtherHp();
        this.labelName.getComponent(cc.Label).string = this.accountName;
    },

    isDead: function() {
        return this.hpValue <= 0;
    },

    showHarm: function(harmStr) {
        var flyNode = new cc.Node();
        var flyWord = flyNode.addComponent("FlyWord");
        this.harm.addChild(flyNode);
        flyWord.showHarm(harmStr, cc.p(0, 0), this.node.scaleX);
    },

    hideOtherHp: function() {
        this.hpProcessBar.active = false;
    },

    showOtherHp: function() {
        //cc.log("show other avatar hp: eid=%d  playerid=%d hp=%d", this.eid, KBEngine.app.player().id, this.hpValue);
        if(this.eid != KBEngine.app.player().id) {
            this.hpProcessBar.active = true;
            this.hp.active = true;
            this.hp.getComponent(cc.Label).string = this.hpValue;
            this.hpProcessBar.getComponent(cc.ProgressBar).progress = (100-this.hpValue)/100;
        }
    },

    recvDamage: function(harm, hp) {
        var harmStr = "-" + harm;
        this.hpValue = hp;

        this.showHarm(harmStr);

        cc.log("avatar %d recvDamage: harm=%d, hp=%d", this.eid, harm, hp);
        if(this.eid == KBEngine.app.player().id) {
            cc.log("self harm");
            this.gameState.setPlayerHP(hp);
        }else {
            cc.log("other harm");
           this.showOtherHp();
        }
    },

    setGameState: function(gameState) {
        this.gameState = gameState;
    },

    reset: function() {
        cc.log("Avatation Reset");
        this.stopWalk();
        this.arrow.active = false;
        this.arrowAngle = 0.0;
        this.hpProcessBar.active = false;
        if(this.item) {
            this.item.getComponent("ItemAction").setPlacePrePosition();
            var player = KBEngine.app.player();
            if(this.eid==player.id && player != undefined && player.inWorld) {
                player.resetItem(this.itemID);
            }

            this.item = null;
            this.itemID = 0;
        }
        
        this.hasPickUpItem = false;
    },

    setEntityId: function(eid) {
        this.eid = eid;
    },

    getEntityID: function() {
        return this.eid;
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

        if(this.hasPickUpItem)
            return;

        this.moveFlag = MOVE_LEFT;
        if(!this.jumping) {
            this.node.scaleX = this.leftDir;
        }
        this.playWalkAnim();

        var player = KBEngine.app.player();
        if(player != undefined && player.inWorld) {
            player.startWalk();
        }
    },

    rightWalk: function() {
        if(this.moveFlag == MOVE_RIGHT) 
            return;

        if(this.hasPickUpItem)
            return;

        this.moveFlag = MOVE_RIGHT;
        if(!this.jumping) {
            this.node.scaleX = this.rightDir;
        }
        this.playWalkAnim();

        var player = KBEngine.app.player();
        if(player != undefined && player.inWorld) {
            player.startWalk();
        }
    },

    playWalkAnim: function() {
        if(!this.jumping && this.anim) {
            this.anim.playWalkAnim();
        }
    },

    _stopWalk: function() {
        var canStop = false;
        if(!this.jumping && this.moveFlag!=STATIC) {
            cc.log("stop stalk");
            this.moveFlag = STATIC;
            if(this.anim) {
                this.anim.stopPlayAnim();
                this.anim.playIdleAnim();
            }
            canStop = true;
        }

        return canStop;
    },

    stopWalk: function() {
        var canStop = this._stopWalk();

        if(canStop) {
            var pos = this.node.getPosition();
            cc.log("4567 avatar %s stop walk, last position(%f, %f)", this.node.name, pos.x, pos.y);
            var player = KBEngine.app.player();
            if(player != undefined && player.inWorld) {
                player.stopWalk(pos);
            }
        }
    },

    onStopWalk: function(pos) {
        cc.log("Avatar onStopWalk");
        this.moveFlag = STATIC;
        if(this.anim){
            this.anim.stopPlayAnim();
            this.anim.playIdleAnim();
        }
    },

    jump: function() {
        if(this.hasPickUpItem)
            return;

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
        cc.log("AvatarAction onJump");
        this._jump();
    },

    setAnim: function(anim) {
        this.anim = anim;
    },

    getItemPoint: function() {
        this.itemPoint = this.leftHand.convertToWorldSpaceAR(cc.v2(0, 0));
        this.itemPoint = this.node.parent.convertToNodeSpace(this.itemPoint);
        return this.itemPoint;
    },

    setPlaceItem: function(item, position) {
        cc.log("AvatarAction::setPlaceItem");
        this.moveFlag = STATIC;

        if(this.node.scaleX == this.rightDir) {
            this.arrow.scaleX = this.rightDir;
        } else if(this.node.scaleX == this.leftDir) {
            this.arrow.scaleX = this.leftDir;
        }

        //改变石头的位置，放到手中
        var itemAction = item.getComponent("ItemAction");
        itemAction.recordPrePosition();
        itemAction.setZeroRigidBody();
        
        item.setPosition(position);
    },

    pickUpItem: function(item, itemID, pickPos) {
        cc.log("player start pick up item ....");
        if(!this.item) {
            this.hasPickUpItem = true;
            this.item = item;
            this.itemID = itemID;

            var player = KBEngine.app.player();
            if(player != undefined && player.inWorld) {
                player.pickUpItem(itemID, this.getItemPoint());
            }

            this.setPlaceItem(item, this.getItemPoint());
            this.adjustArrowDir(pickPos);
        }
    },

    adjustArrowDir: function(pos) {
        //cc.log("player adjustArrowDir: pos(%f, %f)", pos.x, pos.y);
        this.arrow.active = true;
        var arrowWorldPoint = this.arrow.convertToWorldSpaceAR(cc.v2(0, 0));
        var dx = pos.x - arrowWorldPoint.x;
        var dy = pos.y - arrowWorldPoint.y;

        var factor = 1;
        if(this.node.scaleX == this.rightDir) {
            this.arrow.scaleX = this.rightDir;
            factor = this.modelID==0 ? 1 : -1;
        } else if(this.node.scaleX == this.leftDir) {
            this.arrow.scaleX = this.leftDir;
            factor = this.modelID==0 ? -1 : 1;
        }

        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        this.arrowAngle = angle*factor;

        this.calculateForce(pos);

        this.testNode1.setPosition(arrowWorldPoint);
        this.testNode2.setPosition(pos);
    },

    adjustThrow: function(pos) {
        if(!this.hasPickUpItem) return;

        this.adjustArrowDir(pos);
    },

    calculateForce: function(pos) {
        var arrowWorldPoint = this.arrow.convertToWorldSpaceAR(cc.v2(0, 0));
        
        var force = arrowWorldPoint.sub(pos);
        force.mulSelf(MULTIPLE);
        if(force.y > MAX_THROW_FORCE_Y) 
            force.y = MAX_THROW_FORCE_Y; 

        if(this.gameState) {
            this.gameState.showForce(force);
        }
        return force;
    },

    throw: function(pos) {
        if(!this.hasPickUpItem) return;

        var impulse = this.calculateForce(pos);
      
        cc.log("AvatarAction throwItem: force(%f, %f)", impulse.x, impulse.y);

        var player = KBEngine.app.player();
        if(player != undefined && player.inWorld) {
            player.throwItem(this.itemID, impulse);
        }

        this.throwItem(this.item, impulse);

        if(this.gameState) {
            this.gameState.forceLayout.active = false;
        }
        
        this.hasPickUpItem = false;
        this.arrow.active = false;
        this.item = null;
        this.itemAction = null;
    },

    throwItem: function(item, impulse) {
        item.getComponent("ItemAction").throw(impulse);
    },

    touchPickItem: function(touchPos) {
        var minDistance = 0.0;
        var item = null;
        for(var i = 0; i < this.items.length; i++) {
            var distance = cc.pDistance(this.items[i].position, this.node.position);
            if(distance > minDistance) {
                minDistance = distance;
                item = this.items[i];
            } 
        }

        if(item) {
            var itemId = item.getComponent("ItemAction").itemID;
            this.pickUpItem(item, itemId, touchPos);
        }

        return item;
    },

    onStartMove: function(position) {
        this.targetPosition = position;
        var dx = position.x - this.node.x;
        if (dx > 0.8) // 右
        {
            this.moveFlag = MOVE_RIGHT;
           
        } else if (dx < -0.8) //左
        {
            this.moveFlag = MOVE_LEFT;
        } else 
        {
            this.moveFlag = STATIC;
        }
        this.hpProcessBar.scaleX = this.node.scaleX;
        this.labelName.scaleX = this.node.scaleX;
        //cc.log("AvatarAction::onStartMove, dx=%f, move=%f, prePosition(%f, %f)", dx, this.moveFlag, this.node.x, this.node.y);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag == 999 || otherCollider.tag == 998) {
            this.isCollideLand = true;
        }else if(otherCollider.node.name == "land_bg") {
            contact.disabled = true;
        }else if(otherCollider.tag == 100 ) {
            var rigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var speedX =  rigidBody.linearVelocity.x;
            var speedY =  rigidBody.linearVelocity.y;
            if(this.hpValue <= 0) {
                contact.disabled = true;
                return;
            }

            if( (speedX<=0.5 && speedX>=-0.5) && (speedY<=0.5 && speedY>=-0.5) || this.hasPickUpItem) {
                contact.disabled = true;
            }else {
                this.playerRigidBody.linearVelocity = cc.Vec2.ZERO;
            }
        }
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
       if(otherCollider.tag == 999 || otherCollider.tag == 998) {
            this.isCollideLand = false;
        }else if(otherCollider.node.name == "land_bg") {
            // this.isCollideLand = false;
        }else if(otherCollider.tag == 100 ) {
            var rigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var speedX =  rigidBody.linearVelocity.x;
            var speedY =  rigidBody.linearVelocity.y;
            
            if( (speedX<=0.5 && speedX>=-0.5) && (speedY<=0.5 && speedY>=-0.5) ) {
                 contact.disabled = true;
            }else {
                this.playerRigidBody.linearVelocity = cc.Vec2.ZERO;
            }
        }
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        if(otherCollider.tag == 999 || otherCollider.tag == 998) {
            //this.isCollideLand = true;
        }else if(otherCollider.node.name == "land_bg") {
            contact.disabled = true;
        }else if(otherCollider.tag == 100) {
            var rigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var speedX =  rigidBody.linearVelocity.x;
            var speedY =  rigidBody.linearVelocity.y;

            if(this.hpValue <= 0) {
                contact.disabled = true;
                return;
            }

            if( (speedX<=0.5 && speedX>=-0.5) && (speedY<=0.5 && speedY>=-0.5) || this.hasPickUpItem ) {
                contact.disabled = true;
            }
        }
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
      
        if(otherCollider.tag == 999 || otherCollider.tag == 998) {
            this.isCollideLand = false;
        }else if(otherCollider.tag == 100 ) {
            var rigidBody = otherCollider.node.getComponent(cc.RigidBody);
            var speedX =  rigidBody.linearVelocity.x;
            var speedY =  rigidBody.linearVelocity.y;
            
            if( (speedX<=0.5 && speedX>=-0.5) && (speedY<=0.5 && speedY>=-0.5) ) {
                 contact.disabled = true;
            }else {
                this.playerRigidBody.linearVelocity = cc.Vec2.ZERO;
            }
        }
    },

    drawTestNode: function() {
        this.ctx.clear();
        if(!this.hasPickUpItem) return;

        this.ctx.circle(this.testNode1.x, this.testNode1.y, 3);
        this.ctx.fillColor = cc.Color.RED;
        this.ctx.fill();

        this.ctx.circle(this.testNode2.x, this.testNode2.y, 3);
        this.ctx.fillColor = cc.Color.GREEN;
        this.ctx.fill();

        this.ctx.moveTo(this.testNode1.x, this.testNode1.y);
        this.ctx.lineTo(this.testNode2.x, this.testNode2.y);
        this.ctx.stroke();

        // var basePoint = this.basePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        // this.ctx.rect(basePoint.x, basePoint.y, 256, 256);

    },
   
    update: function(dt) {
        this.drawTestNode();

        if(this.arrow.active) {
            this.arrow.rotation = this.arrowAngle;
        }

        var player = KBEngine.app.player();
        var speedX = this.walkspeed.x * dt;
        var results = null;

        if(this.moveFlag == MOVE_LEFT) {
            if(player.id == this.eid) {
               if(!this.isCollideLand) {
                    this.addAxisX(-speedX);
               }
            }else {
               if(this.node.x >= this.targetPosition.x) {
                    this.addAxisX(-speedX);
                 } 
            }
        } 
        else if (this.moveFlag == MOVE_RIGHT ) {
            if(player.id == this.eid) {
                if(!this.isCollideLand) {
                    this.addAxisX(speedX);
                }
            }else {
                if(this.node.x <= this.targetPosition.x) {
                    this.addAxisX(speedX);
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
        results = cc.director.getPhysicsManager().rayCast(start, end, cc.RayCastType.AllClosest);

      // cc.log("0000 down rayCast Result Count=%d", results.length);
      // cc.log("0000 down rayCast: start(%f, %f)  end(%f, %f)", start.x, start.y, end.x, end.y);

        // this.ctx.clear();
        // this.ctx.moveTo(start.x, start.y);
        // this.ctx.lineTo(end.x, end.y);
        // this.ctx.stroke();

        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var collider = result.collider;
            //cc.log("0000 down rayCast Result %d  name: %s,  point(%s, %s)", i, collider.node.name, result.point.x, result.point.y);
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
