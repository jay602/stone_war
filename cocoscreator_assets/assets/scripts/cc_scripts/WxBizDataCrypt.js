var crypto = require('crypto')

function WxBizDataCrypt(appId, sessionKey) {
    this.appId = appId;
    this.sessionKey = sessionKey;
}

WxBizDataCrypt.prototype.descrytData = function(encrypteData, iv) {
    var sessionKey = new Buffer(this.sessionKey, 'base64');
    encrypteData = new Buffer(encrypteData, 'base64');
    iv = new Buffer(iv, 'base64');

    try {
        var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
        decipher.setAutoPadding(true);
        var decoded = decipher.update(encrypteData, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        decoded = JSON.parse(decoded);
    } catch (err) {
        throw new Error(err.toString());
    }
    if(decoded.watermark.appid !== this.appId) {
        throw new Error('appid not equal');
    }

    return decoded;
}


module.exports = WxBizDataCrypt