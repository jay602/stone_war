/**
 * 自定义动作
 */
var walk = cc.ActionInterval.extend({
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


cc.walk = function(duration,shakeStrengthX,shakeStrengthY){
    return new walk(duration,shakeStrengthX,shakeStrengthY);
};