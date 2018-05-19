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

       forceX: {
            default: null,
            type: cc.Label,
       },

       forceY: {
            default: null,
            type: cc.Label,
       },

       force: {
            default: null,
            type: cc.Label,
       },

       HP: {
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

       this.forceLayout =  cc.find("forceLayout");
       this.forceLayout.active = false;

    //    this.hpLayout =  cc.find("hpLayout");
    //    this.hpLayout.active = false;
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
            //cc.log("count down second: %d %s", this.second, this.labelTime.string);
        }
    },

    showForce: function(force) {
        //cc.log("game statez: show force: x=%f, y=%f, force=%f", force.x, force.y, force.mag());
        this.forceLayout.active = true;
        this.forceX.string = force.x.toFixed(1);
        this.forceY.string = force.y.toFixed(1);
        this.force.string = force.mag().toFixed(1);
    },

    setPlayerHP: function(hp) {
      //  this.hpLayout.active = true;
        if(this.HP) {
            if(hp<0) hp = 0;
            this.HP.string = hp
        }
    },

});
