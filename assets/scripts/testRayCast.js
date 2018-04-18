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
        ctx: {
            default: null,
            type: cc.Graphics,
        },

        point2 : {
            default: null,
            type: cc.Node,
        },

        sprite: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.ctx = this.getComponent(cc.Graphics);
    },

    start () {

    },

     update (dt) {
         return;
        var p1 = this.node.getPosition();
        p1 = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        var p2 = this.point2.getPosition();
        p2 = this.point2.convertToWorldSpaceAR(cc.v2(0, 0));
        cc.log("5555 testRayCast: p1(%f, %f)", p1.x, p1.y);
        cc.log("5555 testRayCast: p2(%f, %f)", p2.x, p2.y);

        var t1 = this.node.convertToNodeSpace(this.point2.getPosition());
        var t2 = this.node.convertToWorldSpace(this.point2.getPosition());
        var t3 = this.node.convertToNodeSpaceAR(this.point2.getPosition());
        var t4 = this.node.convertToWorldSpaceAR(this.point2.getPosition());
        var t5 = this.node.convertToWorldSpace(cc.v2(0, 0));
        var t6 = this.node.convertToWorldSpaceAR(cc.v2(0, 0));

        cc.log("5555 testRayCast t1(%f, %f)", t1.x, t1.y);
        cc.log("5555 testRayCast t2(%f, %f)", t2.x, t2.y);
        cc.log("5555 testRayCast t3(%f, %f)", t3.x, t3.y);
        cc.log("5555 testRayCast t4(%f, %f)", t4.x, t4.y);
        cc.log("5555 testRayCast t5(%f, %f)", t5.x, t5.y);
        cc.log("5555 testRayCast t5(%f, %f)", t6.x, t6.y);

        var results = cc.director.getPhysicsManager().rayCast(p1, p2, cc.RayCastType.Closest);
        cc.log("5555 rayCast result count=%d", results.length);
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var point = result.point;
            var collider = result.collider;
             cc.log("5555 collider name=%s", collider.node.name);
            var p3 =this.node.convertToNodeSpace(point);
             this.ctx.circle(p3.x, p3.y, 5);
        }
       
     },
});
