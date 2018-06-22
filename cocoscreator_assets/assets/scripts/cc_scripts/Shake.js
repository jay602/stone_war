/**
 * 自定义抖动动作
 */
var Shake = cc.ActionInterval.extend({
    //节点初始位置
    nodeInitialPos: null,
    //X轴抖动幅度
    nodeShakeStrengthX: 0,
    //Y轴抖动幅度
    nodeShakeStrengthY: 0,
    //抖动时间
    duration: 0,

    ctor: function(duration, shakeStrengthX, shakeStrengthY) {
        cc.ActionInterval.prototype.ctor.call(this);
        this.duration = duration;
        this.initWithDuration(duration, shakeStrengthX, shakeStrengthY);
    },

    //获取两个数间的随机值
    getRandomStrength: function(min, max) {
        return Math.random() * (max-min+1) + min;
    },

    update: function(dt) {
        var randX = this.getRandomStrength(-this.nodeShakeStrengthX, this.nodeShakeStrengthX) * dt;
        var randY = this.getRandomStrength(-this.nodeShakeStrengthY, this.nodeShakeStrengthY) * dt;
        this.target.setPosition(cc.pAdd(this.nodeInitialPos, cc.p(randX, randY)));
    },

    initWithDuration: function(duration, shakeStrengthX, shakeStrengthY) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this.nodeShakeStrengthX = shakeStrengthX;
            this.nodeShakeStrengthY = shakeStrengthY == 'undefined' ? shakeStrengthX : shakeStrengthY;
            return true;
        }
        return false;
    },

    startWithTarget: function(target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this.nodeInitialPos = target.getPosition();
    },

    stop: function() {
        this.target.setPosition(this.nodeInitialPos);
    }
});

/**
 * 自定义抖动动作
 * @param {float}duration 抖动时间
 * @param {number}shakeStrengthX X轴抖动幅度
 * @param {number}shakeStrengthY Y轴抖动幅度
 * @returns {Shake}
 */
cc.shake = function(duration,shakeStrengthX,shakeStrengthY){
    return new Shake(duration,shakeStrengthX,shakeStrengthY);
};