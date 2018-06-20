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
        dieAnim : "",
        throwPreAnim: "",
        throwAnim: "",

        modelID : 0,
        anim: {
            default: null,
            type: cc.Animation,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
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
            this.dieAnim = "pipi_die";
            this.throwPreAnim = "pipi_throw_pre";
            this.throwAnim = "pipi_throw";
         }else if(this.modelID == 1){
            this.walkAnim = "pop_walk";
            this.jumpAnim = "pop_jump";
            this.idleAnim = "pop_idle";
            this.dieAnim = "pop_die";
            this.throwPreAnim = "pop_throw_pre";
            this.throwAnim = "pop_throw";
         }
    },

   playWalkAnim: function(){
        if(this.anim) {
            this.anim.play(this.walkAnim);
        }
    },

    playThrowPreAnim () {
        if(this.anim) {
            this.anim.play(this.throwPreAnim);
        }
    },

    playThrowAnim () {
        if(this.anim) {
            this.anim.play(this.throwAnim);
        }
    },

    stopPlayAnim: function() {
        if(this.anim) {
            this.anim.stop();
        }
    },

    playJumpAnim: function(){
        if(this.anim) {
            this.anim.play(this.jumpAnim);
        }
    },

    playIdleAnim: function() {
        if(this.anim) {
            this.anim.play(this.idleAnim);
        }
    },

    playDieAnim: function() {
        if(this.anim) {
            this.anim.play(this.dieAnim);
        }
    }
});
