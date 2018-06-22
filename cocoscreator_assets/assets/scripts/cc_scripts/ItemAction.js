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

        rigidBody: {
            default: null,
            type: cc.RigidBody,
        },

        harm: 10,
        itemID : 0,
    },

    onLoad () {
        this.phyPolyCollider = this.node.getComponent(cc.PhysicsPolygonCollider);
        this.polyCollider = this.node.getComponent(cc.PolygonCollider);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        
        this.testNode1 = cc.find("testNode1");
        this.sky = cc.find("World/sky_bg");
        this.camera = cc.find("Camera").getComponent(cc.Camera);
        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);

        this.draw = new cc.DrawNode();
        this.node._sgNode.addChild(this.draw);

        this.canPicked = false;
        this.prePosition = null;
        this.isThrowed = false;
        this.isOutRange = false;
        this.touchPlayerCount = 0;

        if(cc.sys.isMobile) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.pickUped, this);
        } else {
            this.node.on(cc.Node.EventType.MOUSE_DOWN, this.pickUped, this);
        }
    },

    onCollisionEnter: function (other, self) {
        if(self.tag == 110 && this.player && other.node.name === this.player.name && this.playerControl &&this.playerControl.isEnable()) {
            if(other.node.getComponent("AvatarAction").isDead())
                return;

            this.draw.drawPoly(this.phyPolyCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;
            other.node.getComponent("AvatarAction").addItem(self.node);
        }
    },

    onCollisionStay: function (other, self) {
        if(self.tag == 110 && this.player && other.node.name === this.player.name && this.playerControl &&this.playerControl.isEnable()) {
            if(other.node.getComponent("AvatarAction").isDead())
                return;

            this.draw.drawPoly(this.phyPolyCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;

            other.node.getComponent("AvatarAction").addItem(self.node);
        }
    },

    onCollisionExit: function (other, self) {
        if(self.tag == 110 && this.player && other.node.name === this.player.name && this.playerControl &&this.playerControl.isEnable()) {
            this.draw.clear();
            this.canPicked = false;
            other.node.getComponent("AvatarAction").removeItem(self.node);
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if( (otherCollider.node.name == PIPI_NAME || otherCollider.node.name == POP_NAME) && this.isThrowed) { //扣血
            let avatarID = otherCollider.node.getComponent("AvatarAction").getEntityID();
            let hp = otherCollider.node.getComponent("AvatarAction").hpValue;
            var player = KBEngine.app.findEntity(avatarID);
            
            if(player == undefined || !player.inWorld)
                return;
            if(hp > 0) {
                player.recvDamage(this.itemID);
            }
        }

        if( otherCollider.tag == 998 || otherCollider.tag == 10 || otherCollider.tag == 11 ||  otherCollider.tag == 12 ||  otherCollider.tag == 13) {
            contact.disabled = true;
        }

        if( otherCollider.tag == 100) {
            contact.disabled = true;
        }
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        if( otherCollider.tag == 100) {
            contact.disabled = true;
        }
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {
        if( otherCollider.tag == 998 ) {
            contact.disabled = true;
        }

        if( otherCollider.tag == 100) {
            contact.disabled = true;
        }
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
        if( (otherCollider.node.name == PIPI_NAME || otherCollider.node.name == POP_NAME) && this.isThrowed) {
            this.touchPlayerCount++;
            var linearVelocity = this.rigidBody.linearVelocity;
            
            if(this.touchPlayerCount>100 && linearVelocity.mag()<= 8) {
                cc.log("item touch player too much");
                //this.isThrowed = false;
                this.touchPlayerCount = 0;
                this.rigidBody.linearVelocity = cc.Vec2.ZERO;
                this.rigidBody.gravityScale = 0;
            }
        }

        if( otherCollider.tag == 100) {
            contact.disabled = true;
        }

        if( otherCollider.tag == 998 || otherCollider.tag == 10 || otherCollider.tag == 11 ||  otherCollider.tag == 12 ||  otherCollider.tag == 13) {
            contact.disabled = true;
        }
    },

    setHarm: function(num) {
        this.harm = num;
    },

    setThrowed: function(throwed) {
        this.isThrowed = throwed;
        this.touchPlayerCount = 0;
    },

    setCamera: function(camera) {
        this.camera = camera;
    },

    setPlacePrePosition: function() {
        if(this.prePosition) {
            this.node.setPosition(this.prePosition);
            this.prePosition = null;
        }
    },

    recordPrePosition: function() {
        this.prePosition = this.node.getPosition();
        KBEngine.INFO_MSG("item " + this.node.name + " pre position: " + this.prePosition.x + " , " + this.prePosition.y);
    },

    pickUped: function(event) {
        var pickPos = this.camera.getCameraToWorldPoint( event.getLocation());
        var isHited = cc.Intersection.pointInPolygon(pickPos, this.polyCollider.world.points);
        var ret = cc.sys.isMobile ? true : (event.getButton() === cc.Event.EventMouse.BUTTON_LEFT);

        if(ret && this.canPicked && isHited && this.player) {
            var point = new cc.Vec2(pickPos.x,  pickPos.y);
            this.player.getComponent("AvatarControl").pickUpItem(this.node, this.itemID, point);
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

    throw: function(impulse) {
        var itemRigidbody = this.node.getComponent(cc.RigidBody);
        itemRigidbody.gravityScale = 1;

        var worldCenter = itemRigidbody.getWorldCenter();
        itemRigidbody.applyLinearImpulse(impulse, worldCenter, true);

        var torque = impulse.x >= 0 ?  -500 : 500;
        
        itemRigidbody.applyTorque(torque, true);
        KBEngine.INFO_MSG("torque = " + torque);

        cc.log("AvatarActio::thowItem torque : force(%f, %f), worldCenter(%f, %f) pos(%f, %f)", impulse.x, impulse.y, worldCenter.x, worldCenter.y
        , this.node.x, this.node.y);
        
        this.isThrowed = true;
    },

    setZeroRigidBody: function() {
        var itemRigidbody = this.node.getComponent(cc.RigidBody);
        itemRigidbody.gravityScale = 0;
        itemRigidbody.linearVelocity = cc.v2(0, 0);
    },
});
