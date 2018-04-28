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

        pickRadius: 100.0,

        drawNode: {
            default: null,
            type: cc.Node,
        },

        testNode1: {
            default: null,
            type: cc.Node,
        },

        playerControl: {
            default: null,
            type: cc.Node,
        },

        camera: {
            default: null,
            type: cc.Camera,
        },

        itemID : 0,

        rigidBody: {
            default: null,
            type: cc.RigidBody,
        },
    },

    onLoad () {
        this.chainCollider = this.node.getComponent(cc.PhysicsChainCollider );
        this.polyCollider = this.node.getComponent(cc.PolygonCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        
        this.testNode1 = cc.find("testNode1");
        this.camera = cc.find("Camera").getComponent(cc.Camera);
        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.pickUped, this);

        this.draw = new cc.DrawNode();
        this.node._sgNode.addChild(this.draw);

        this.canPicked = false;
        this.prePosition = null;
        this.isThrowed = false;
        this.touchPlayerCount = 0;
    },

    onCollisionEnter: function (other, self) {
        if(other.node.name === this.player.name && this.playerControl.isEnable()) {
            this.draw.drawPoly(this.chainCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;
        }
    },

    onCollisionStay: function (other, self) {
        if(other.node.name === this.player.name && this.playerControl.isEnable()) {
            this.draw.drawPoly(this.chainCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;
        }
    },

    onCollisionExit: function (other, self) {
        if(other.node.name === this.player.name && this.playerControl.isEnable()) {
            this.draw.clear();
            this.canPicked = false;
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
      
        if( (otherCollider.node.name == "pipiPrefab" || otherCollider.node.name == "popPrefab") && this.isThrowed) {
            this.touchPlayerCount++;
            var linearVelocity = this.rigidBody.linearVelocity;
           
           // cc.log("3333 ItemAction::onPreSolve touch player  count=%d", this.touchPlayerCount);
           // cc.log("3333 item speed(%f, %f)", linearVelocity.x, linearVelocity.y);

            if(this.touchPlayerCount > 180 && !linearVelocity.equals(cc.Vec2.ZERO)) {
                this.isThrowed = false;
                this.touchPlayerCount = 0;
                this.rigidBody.linearVelocity = cc.Vec2.ZERO;
                this.rigidBody.gravityScale = 0;
            }

        }
    },


    setThrowed: function(throwed) {
        cc.log("3333 item is throwed");
        this.isThrowed = throwed;
        this.touchPlayerCount = 0;
    },

    setCamera: function(camera) {
        this.camera = camera;
    },

    setPlacePrePosition: function() {
        if(this.prePosition) {
            cc.log("item set prePosition");
            this.node.setPosition(this.prePosition);
            this.prePosition = null;
        }
    },

    recordPrePosition: function() {
        this.prePosition = this.node.getPosition();
        cc.log("pre position(%f, %f)", this.prePosition.x, this.prePosition.y);
    },

    pickUped: function(event) {
        var pickPos = event.getLocation();
        
        pickPos = this.camera.getCameraToWorldPoint(pickPos);

        var isHited = cc.Intersection.pointInPolygon(pickPos, this.polyCollider.world.points);
        if(event.getButton() === cc.Event.EventMouse.BUTTON_LEFT && this.canPicked && isHited) {
            cc.log("pick up Item %s ", this.node.name);
            if(this.player) {
                var v2 = new cc.Vec2();
                v2.x = pickPos.x;
                v2.y = pickPos.y;
                this.player.getComponent("AvatarControl").pickUpItem(this.node, this.itemID, v2);
            }
        }else {
            cc.log("not hit Item %s ", this.node.name);
        }
    },

    setPlayer: function(player) {
        if(player) {
            this.player = player;
            this.playerControl = this.player.getComponent("AvatarControl");
        }
    },

    setItemID: function(itemID) {
        this.itemID = itemID;
    },

    getPlayerDistance: function () {
        var playerPos = this.player.getPosition();
        var dist = cc.pDistance(this.node.getPosition(), playerPos);
        return dist;
    },

    update (dt) {
        // var centerPoint = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        // var worldPoint = this.worldNode.convertToWorldSpaceAR(cc.v2(0, 0));

        // this.ctx.clear();

        // this.ctx.circle(centerPoint.x, centerPoint.y, 30);
        // this.ctx.fillColor = cc.Color.RED;
        // this.ctx.fill();

        // this.ctx.circle(worldPoint.x, worldPoint.y, 5);
        // this.ctx.fillColor = cc.Color.GREEN;
        // this.ctx.fill();

        // this.ctx.stroke();

        // this.draw.clear();
        // if (this.getPlayerDistance() < this.pickRadius) {
        //     cc.log("0000 Item:%s show red", this.node.name);
        //    this.draw.drawPoly(this.collider.points, cc.color(200, 0, 0, 100), 1, cc.color(0, 0, 0, 125));
        // }
    },
});
