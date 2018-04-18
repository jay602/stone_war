cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.log("9999 CameraControl OnLoad");
        this.camera = this.getComponent(cc.Camera);
        this.onEnable();
    },

    onEnable: function () {
        cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        cc.director.getCollisionManager().attachDebugDrawToCamera(this.camera);
    },
    
    onDisable: function () {
        cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
        cc.director.getCollisionManager().detachDebugDrawFromCamera(this.camera);
    },

    setTarget: function(target) {
        this.target = target;
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if(this.target==null) return;
        
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var point = this.node.parent.convertToNodeSpaceAR(targetPos);
        point.y += 200;
        this.node.position = point;
        let ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5 ;
    },
});