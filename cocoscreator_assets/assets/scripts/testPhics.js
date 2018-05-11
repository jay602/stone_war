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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var physicsManager =  cc.director.getPhysicsManager();
        physicsManager.enabled = true;
        physicsManager.enabledAccumulator = true;
        this.gravity = physicsManager.gravity;
        cc.log("gravity(%f, %f)", this.gravity.x, this.gravity.y);
       
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getPhysicsManager().enabled = true;
        
        this.enablePhysicsDebugDraw();

        this.rigidbody = this.node.getComponent(cc.RigidBody);
    },

    enablePhysicsDebugDraw: function() {
        var manager = cc.director.getCollisionManager();
        manager.enabledDebugDraw = true;
        manager.enabledDrawBoundingBox = true;

        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit |
        cc.PhysicsManager.DrawBits.e_rayCast;
    },

    start () {
        var m = this.rigidbody.getMass();
        var a = cc.v2(this.gravity.x, Math.abs(this.gravity.y)*2);
        var force = a.mul(m);
        this.rigidbody.applyForceToCenter(force, true);

        cc.log("a(%f, %f)  (%f, %f)", a.x, a.y, a.x/32, a.y/32);
        cc.log("stone mass = %f", m);

        cc.log("force(%f, %f)", force.x, force.y);
    },

     update (dt) {
        var speed = this.rigidbody.linearVelocity;
        cc.log("dt=%f  speed(%f, %f)", dt, speed.x, speed.y);
        cc.log("position(%f, %f)", this.node.x, this.node.y);
     },
});
