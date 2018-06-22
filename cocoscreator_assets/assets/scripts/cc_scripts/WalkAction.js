/**
 * 自定义抖动动作
 */
var walk = cc.ActionInterval.extend({
    //抖动时间
    duration: 0,
    anim: null,

    ctor: function(duration, anim) {
        cc.ActionInterval.prototype.ctor.call(this);
        this.duration = duration;
        this.initWithDuration(duration, anim);
    },


    initWithDuration: function(duration, anim) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this.anim = anim;
            return true;
        }
        return false;
    },

    startWithTarget: function(target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this.nodeInitialPos = target.getPosition();
        this.anim.playWalkAnim();
    },

    stop: function() {
        this.anim.stopPlayAnim();
    }
});

/**
 * 自定义抖动动作
 * @param {float}duration 抖动时间
 * @param {number}shakeStrengthX X轴抖动幅度
 * @param {number}shakeStrengthY Y轴抖动幅度
 * @returns {Shake}
 */
cc.walk = function(duration,shakeStrengthX,shakeStrengthY){
    return new walk(duration,shakeStrengthX,shakeStrengthY);
};