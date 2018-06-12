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

        buttonRanking: {
            default: null,
            type: cc.Button,
        },

        rankingView: cc.Node,
        rankingScrollView: cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.isShowRankingView = false;
        this.buttonRanking.node.active = false;
        this.rankingView.active = false;
        // var result = null;
        // switch(GAME_RESULT)
        // {
        //     case PIPI_WIN:
        //         result = cc.instantiate(this.pipiWin);
        //         break;
        //     case PIPI_LOSE:
        //         result = cc.instantiate(this.pipiLose);
        //         break;
        //     case POP_WIN:
        //         result = cc.instantiate(this.popWin);
        //         break;
        //     case POP_LOSE:
        //         result = cc.instantiate(this.popLose);
        //         break;
        // }

        // this.player.addChild(result);
        // result.setPosition(0, 0);

        this.labelHitRate.string = HIT_RATE.toFixed(2) * 100 + '%';
        this.labelTotalHarm.string = TOTAL_HARM;
        this.labelTotalTime.string = TOTAL_TIME + 'S';
        this.labelScore.string = SCORE;

        //cc.director.preloadScene("WorldScene");
    },

    start() {
        if (window.wx != undefined) {
            this.buttonRanking.node.active = true;
            this._isShow = false;
            this.tex = new cc.Texture2D();

            sharedCanvas.width = 1136;
            sharedCanvas.height = 640;

            wx.setUserCloudStorage({
                KVDataList: [{ key: 'score', value: "123" }],
                success: function (res) {
                    KBEngine.INFO_MSG('setUserCloudStorage  success' + JSON.stringify(res));
                },
                fail: function (res) {
                    KBEngine.INFO_MSG('setUserCloudStorage  fail' + JSON.stringify(res));
                },
                complete: function (res) {
                    KBEngine.INFO_MSG('setUserCloudStorage  complete' + JSON.stringify(res));
                }
            });
        }
    },

    continueGame: function() {
        // var player = KBEngine.app.player();
        // if(player == undefined || !player.inWorld)
        //     return;

        // cc.director.loadScene("WorldScene", function() {
        //     KBEngine.INFO_MSG("load WorldScene finish");
        //     player.continueGame();
        // });
    },

    onDisplayRankingView() {
        if (window.wx == undefined)  return;
        KBEngine.INFO_MSG("show ranking view");
        this.isShowRankingView = !this.isShowRankingView;
        this.rankingView.active = this.isShowRankingView;
        // 发消息给子域
        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            message: this.isShowRankingView ? 'Show' : 'Hide',
        });
    },

    _updateSubDomainCanvas() {
        if (!this.tex) {
            return;
        }
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
    },

    update() {
        this._updateSubDomainCanvas();
    },

});
