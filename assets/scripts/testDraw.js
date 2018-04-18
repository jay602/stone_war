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
        point1 : {
            default: null,
            type: cc.Node,
        },

        point2 : {
            default: null,
            type: cc.Node,
        },

        draw: {
            default: null,
            type: cc.Graphics,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.draw = this.getComponent(cc.Graphics);
    },

    start () {

    },

    update (dt) {
        // var center = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        // var p1 = this.point1.getPosition();
        // var p2 = this.point2.getPosition();
        // cc.log("8989 testDrae: p1(%f, %f) p2(%f, %f)", p1.x, p1.y,  p2.x, p2.y);
        // this.draw.clear();
        // this.draw.moveTo(p1.x, p1.y);
        // this.draw.lineTo(p2.x, p2.y);
        // this.draw.stroke();
        
    },
});
