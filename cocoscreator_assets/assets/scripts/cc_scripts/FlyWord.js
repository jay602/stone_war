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

    create: function(word, begin) {
        this.word = word;
        this.beginPoint = begin;

        this.label = this.node.addComponent(cc.Label);
        this.label.string = word;
        this.node.setPosition(this.beginPoint);

        this.flying();
    },

    flying: function() {
        var finished = cc.callFunc(this.flyEnd, this);
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

    flyEnd: function() {
        this.node.removeAllChildren();
        this.node.removeFromParent();
    },
    
});
