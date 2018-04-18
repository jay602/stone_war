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
        walkAnim : "",
        jumpAnim : "",
        idleAnim : "",
        modelID : 0,
        anim: {
            default: null,
            type: cc.Animation,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //this.anim = this.getComponent(cc.Animation);
    },

    setAnim: function(anim) {
        this.anim = anim;
    },

    setModelID: function(num) {
        this.modelID = num;
        if(this.modelID == 0) {
            this.walkAnim = "pipi_walk";
            this.jumpAnim = "pipi_jump";
            this.idleAnim = "pipi_idle";
         }else if(this.modelID == 1){
            this.walkAnim = "pop_walk";
            this.jumpAnim = "pop_jump";
            this.idleAnim = "pop_idle";
         }
    },

   playWalkAnim: function(){
        if(this.anim) {
            var animState = this.anim.play(this.walkAnim);
            animState.wrapMode = cc.WrapMode.Loop;
            animState.repeatCount = Infinity;
            cc.log("AvatarAnim::playWalkAnim %s", this.walkAnim);
        }
    },

    stopPlayAnim: function() {
        if(this.anim) {
            cc.log("AvatarAnim::stopPlayAnim",);
            this.anim.stop();
        }
    },

    playJumpAnim: function(){
        if(this.anim) {
            cc.log("AvatarAnim::playJumpAnim %s", this.jumpAnim);
            this.anim.play(this.jumpAnim);
        }
    },

    playIdleAnim: function() {
        if(this.anim) {
            cc.log("AvatarAnim::playIdleAnim %s", this.idleAnim);
            this.anim.play(this.idleAnim);
        }
    },

    start () {

    },

    update: function(dt) {},
});
