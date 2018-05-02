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
       labelTime: {
           default: null,
           type: cc.Label,
       },

       second: 30,

       isStart: false,
    },

    onLoad () {
       this.labelTime.string = "";
       this.scheduler = cc.director.getScheduler();
       this.camera = cc.find("Camera").getComponent("CameraControl");
       this.ctx = cc.find("World/drawNode").getComponent(cc.Graphics);

       this.node1 = cc.find("World/node1");
       this.node2 = cc.find("World/node2");
    },

    isGameStart: function() {
        return this.isStart;
    },

    setGameStart: function(isStart) {
        cc.log("Is game start: %s", isStart.toString());
        this.isStart = isStart;
        if(this.isStart) {
            this.scheduler.schedule(this.countDownSecond, this, 1, cc.REPEAT_FOREVER, 0, false);
        }else {
            this.labelTime.string = "";
            this.scheduler.unscheduleAllForTarget(this); 
        }
    },

    newTurn: function(second) {
        this.second = second;
        this.labelTime.string = this.second;
    },
   
    countDownSecond: function() {
        if(this.isStart) {
            if(this.second > 0) {
                this.second--;
            }else {
                this.second = 0;
            }

            this.labelTime.string = this.second;
            cc.log("count down second: %d %s", this.second, this.labelTime.string);
        }
    },

});
