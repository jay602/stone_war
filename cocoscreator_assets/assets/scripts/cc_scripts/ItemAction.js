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
        player: {
            default: null,
            type: cc.Node,
        },

        pickRadius: 100.0,

        drawNode: {
            default: null,
            type: cc.Node,
        },

        center: {
            default: null,
            type: cc.Node,
        },

        worldNode: {
            default: null,
            type: cc.Node,
        },

        camera: {
            default: null,
            type: cc.Camera,
        },
    },

    onLoad () {
        this.chainCollider = this.node.getComponent(cc.PhysicsChainCollider );
        this.polyCollider = this.node.getComponent(cc.PolygonCollider);
        this.center = this.node.getChildByName("center");
        this.worldNode = cc.find("worldNode");
        this.camera = cc.find("Camera").getComponent(cc.Camera);
        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);

        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.pickUped, this);

        this.draw = new cc.DrawNode();
        this.node._sgNode.addChild(this.draw);

        this.canPicked = false;
    },

    onCollisionEnter: function (other, self) {
        if(other.node.name === this.player.name) {
            this.draw.drawPoly(this.chainCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;
        }
    },

    onCollisionStay: function (other, self) {
        if(other.node.name === this.player.name) {
            this.draw.drawPoly(this.chainCollider.points, cc.color(100, 0, 0, 50), 1, cc.color(0, 0, 0, 125));
            this.canPicked = true;
        }
    },

    onCollisionExit: function (other, self) {
        if(other.node.name === this.player.name) {
            this.draw.clear();
            this.canPicked = false;
        }
    },

    setCamera: function(camera) {
        this.camera = camera;
    },

    pickUped: function(event) {
        var pickPos = event.getLocation();
        
        pickPos = this.camera.getCameraToWorldPoint(pickPos);
        this.worldNode.setPosition(pickPos);

        cc.log("mouse down:  worldNodePoint(%f, %f)",   this.worldNode.x,  this.worldNode.y);

        var isHited = cc.Intersection.pointInPolygon(pickPos, this.polyCollider.world.points);
        if(event.getButton() === cc.Event.EventMouse.BUTTON_LEFT && this.canPicked && isHited) {
            cc.log("pick up Item %s ", this.node.name);
            if(this.player) {
                this.player.getComponent("AvatarAction").pickUpItem(this);
            }
        }else {
            cc.log("not hit Item %s ", this.node.name);
        }
    },

    setPlayer: function(player) {
        if(player) {
            this.player = player;
        }
    },

    getPlayerDistance: function () {
        var playerPos = this.player.getPosition();
        var dist = cc.pDistance(this.node.getPosition(), playerPos);
        return dist;
    },

    start () {

    },

    update (dt) {
        // var centerPoint = this.center.convertToWorldSpaceAR(cc.v2(0, 0));
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
