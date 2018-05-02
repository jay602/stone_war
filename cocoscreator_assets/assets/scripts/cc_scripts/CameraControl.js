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
        this.camera = this.getComponent(cc.Camera);
        this.sky = cc.find("World/sky_bg");
        this.skyBox = this.sky.getBoundingBoxToWorld();

        this.onEnable();

        // cc.log("9999 Camera onLoad: skyBox.Rect(%f, %f, %f, %f)", this.skyBox.x, this.skyBox.y, this.skyBox.width, this.skyBox.height);
        // cc.log("9999 Camera onLoad: skyBox : xMin=%f, yXmin=%f, xMax=%f, yMax=%f)", this.skyBox.xMin, this.skyBox.yMin, this.skyBox.xMax, this.skyBox.yMax);
        // cc.log("9999 Camera onLoad: skyBox.center(%f, %f)", this.skyBox.center.x, this.skyBox.center.y);
        // cc.log("9999 Camera onLoad: skyBox.origin(%f, %f)", this.skyBox.origin.x, this.skyBox.origin.y);
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

    getTarget: function() {
        return this.target;
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if(this.target==null) return;
        
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);

        var point = this.node.parent.convertToNodeSpaceAR(targetPos);
        point.y += 160;
        this.node.position = point;
        let ratio = targetPos.y / cc.winSize.height;
        this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5 ;
    },
});