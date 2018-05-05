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
       fontSize: 40,
       word: null,

       label: {
            default: null,
            type: cc.Node,
       },

       beginPoint: cc.v2(0, 0),
    },

    onLoad () {
        cc.log("FlyWord Load");
    },

    showHarm: function(word, begin, scaleX) {
        this.word = word;
        this.beginPoint = begin;

        this.label = this.node.addComponent(cc.Label);
        this.label.node.scaleX = scaleX;
        this.label.string = word;
        this.node.setPosition(this.beginPoint);

        this.flying();
    },

    showHP: function(hp, pos, scaleX) {
        this.word = hp;
        this.beginPoint = pos;

        this.label = this.node.addComponent(cc.Label);
        this.label.string = this.word;
        this.label.node.scaleX = scaleX;
        this.node.setPosition(this.beginPoint);

        this.fadeOut();
    },

    fadeOut: function() {
        var finished = cc.callFunc(this.actionEnd, this);

        var fade = cc.fadeOut(1.0);
        var delay = cc.delayTime(0.25);
        var fadeBack = fade.reverse();
        var action = cc.sequence(fade, delay.clone(), fadeBack, finished);
        this.node.runAction(action);
    },

    flying: function() {
        var finished = cc.callFunc(this.actionEnd, this);
        var y = 100;
        var upperValue = 135;
        var lowerValue = 45;
        var angle = Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
        var x = 0;
        var radian = 0;
        var tan = 0;

        if(angle < 90) {
            tan = Math.tan(Math.PI/180*angle);
        }else if (angle > 90) {
            tan = Math.tan(Math.PI/180*(180-angle));
        }
        
        x = y / tan;
        cc.log("9090 word fly: angle=%f x=%f y=%f  tan=%f", angle, x, y, tan);
        var action = cc.sequence(cc.moveBy(1, cc.p(x, y)), cc.fadeOut(1), finished);
        this.node.runAction(action);
    },

    actionEnd: function() {
        this.node.removeAllChildren();
        this.node.removeFromParent();
    },
    
});
