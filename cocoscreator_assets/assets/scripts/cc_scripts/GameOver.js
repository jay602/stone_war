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
       player: {
           default: null,
           type: cc.Node,
       },

       pipiWin: {
            default: null,
            type: cc.Prefab,
        },

       pipiLose: {
            default: null,
            type: cc.Prefab,
        },

        popWin: {
            default: null,
            type: cc.Prefab,
        },

        popLose: {
            default: null,
            type: cc.Prefab,
        },

        labelHitRate: {
            default: null,
            type: cc.Label,
        },

        labelTotalTime: {
            default: null,
            type: cc.Label,
        },

        labelTotalHarm: {
            default: null,
            type: cc.Label,
        },

        labelScore: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var result = null;
        switch(GAME_RESULT)
        {
            case PIPI_WIN:
                result = cc.instantiate(this.pipiWin);
                break;
            case PIPI_LOSE:
                result = cc.instantiate(this.pipiLose);
                break;
            case POP_WIN:
                result = cc.instantiate(this.popWin);
                break;
            case POP_LOSE:
                result = cc.instantiate(this.popLose);
                break;
        }

        this.player.addChild(result);
        result.setPosition(0, 0);

        this.labelHitRate.string = HIT_RATE.toFixed(2) * 100 + '%';
        this.labelTotalHarm.string = TOTAL_HARM;
        this.labelTotalTime.string = TOTAL_TIME + 'S';
        this.labelScore.string = SCORE;

        cc.director.preloadScene("WorldScene");
    },

    continueGame: function() {
        var player = KBEngine.app.player();
        if(player == undefined || !player.inWorld)
            return;

       
        cc.director.loadScene("WorldScene", function() {
            KBEngine.INFO_MSG("load WorldScene finish");
            player.continueGame();
        });
    }

});
