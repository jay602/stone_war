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
        this.onEnable();

        this.camera = this.getComponent(cc.Camera);

        this.sky = cc.find("World/sky_bg");
        this.skyBox = this.sky.getBoundingBoxToWorld();
        this.cameraBox = this.node.getBoundingBoxToWorld();

        var walls = this.sky.getComponents(cc.BoxCollider);
        for(var i=0; i < walls.length; i++) {
            if(walls[i].tag == 10) this.leftWallCollider = walls[i];
            if(walls[i].tag == 11) this.topWallCollider = walls[i];
            if(walls[i].tag == 12) this.rightWallCollider = walls[i];
            if(walls[i].tag == 13) this.bottomWallCollider = walls[i];
        }

        this.ctx = cc.find("worldDraw").getComponent(cc.Graphics);

        this.targetIsPlayer = false;

        this.touchLeft = false;
        this.touchTop = false;
        this.touchRight = false;
        this.touchBottom = false;

        this.limitTopY = 0;
        this.limitBottomY = 0;
        this.limitLeftX = 0;
        this.limitRightX = 0;
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
        this.resetLimit();

        if(this.target.name == PIPI_NAME || this.target.name == POP_NAME) {
            this.targetIsPlayer = true;
        }else {
            this.targetIsPlayer = false;
        }
    },

    resetLimit: function() {
        this.touchLeft = false;
        this.touchTop = false;
        this.touchRight = false;
        this.touchBottom = false;

        this.limitTopY = 0;
        this.limitBottomY = 0;
        this.limitLeftX = 0;
        this.limitRightX = 0;
    },

    getTarget: function() {
        return this.target;
    },

    getTartName: function() {
        var targetName = "";
        if(this.target) {
            targetName = this.target.name;
        }

        return targetName;
    },

    testDraw: function(tempoint) {
        this.ctx.clear();
        this.ctx.strokeColor = cc.Color.RED;
        this.ctx.circle(this.node.x, this.node.y, 3);
        this.ctx.fillColor = cc.Color.RED;
        this.ctx.fill();

        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.ctx.circle(targetPos.x, targetPos.y, 3);
        this.ctx.fillColor = cc.Color.GREEN;
        this.ctx.fill();
       
        this.cameraBox = this.node.getBoundingBoxToWorld();
        this.ctx.rect(this.cameraBox.origin.x+1, this.cameraBox.origin.y+1, this.cameraBox.width-2, this.cameraBox.height-2);
        this.ctx.stroke();

        this.skyBox = this.sky.getBoundingBoxToWorld();
        this.ctx.strokeColor = cc.Color.GREEN;
        this.ctx.rect(this.skyBox.origin.x+1, this.skyBox.origin.y+1, this.skyBox.width-2, this.skyBox.height-2);
        this.ctx.stroke();
    },

    // called every frame, uncomment this function to activate update callback
    lateUpdate: function (dt) {
        if(this.target==null) return;
        
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var point = this.node.parent.convertToNodeSpaceAR(targetPos);

        if(this.touchTop && point.y+160 < this.limitTopY) {
            this.touchTop = false;
            this.limitTopY = 0;
        }

        if(this.touchBottom && point.y+160 > this.limitBottomY) {
            this.touchBottom = false;
            this.limitBottomY = 0;
        }

        if(this.touchLeft && point.x > this.limitLeftX) {
            this.touchLeft = false;
            this.limitTopY = 0;
        }

        if(this.touchRight && point.x < this.limitRightX) {
            this.touchRight = false;
            this.limitRightX = 0;
        }
        
        //cc.log("9999 touchTop=%s, limitTopY=%f, y1=%f point.y+160=%f", this.touchTop.toString(), this.limitTopY, point.y, point.y+160);
        point.y += 160;

        if(this.touchTop && this.limitTopY != 0) {
            point.y = this.limitTopY;
        }

        //cc.log("camera position(%f)", point.x, point.y);
        if(this.touchBottom && this.limitBottomY != 0) {
            point.y = this.limitBottomY;
        }

        if(this.touchLeft && this.limitLeftX != 0) {
            point.x = this.limitLeftX;
        }

        if(this.touchRight && this.limitRightX != 0) {
            point.x = this.limitRightX;
        }
        
        this.node.position = point;
        let ratio = targetPos.y / cc.winSize.height;
        //this.camera.zoomRatio = 1 + (0.5 - ratio) * 0.5 ;
        this.camera.zoomRatio = 1;

       // this.testDraw();
    },

    onCollisionEnter: function (other, self) {
        if(other.tag == this.topWallCollider.tag) {
            this.touchTop = true;
            this.limitTopY = self.node.y;
        }

        if(other.tag == this.bottomWallCollider.tag) {
            this.touchBottom = true;
            this.limitBottomY = self.node.y;
        }

        if(other.tag == this.leftWallCollider.tag) {
            this.touchLeft = true;
            this.limitLeftX = self.node.x;
        }

        if(other.tag == this.rightWallCollider.tag) {
            this.touchRight = true;
            this.limitRightX = self.node.x;
        }
    },

    onCollisionStay: function (other, self) {
       
    },

    onCollisionExit: function (other, self) {

    }
});