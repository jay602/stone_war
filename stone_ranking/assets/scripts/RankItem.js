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
        backSprite: cc.Node,
        rankLabel: cc.Label,
        avatarImgSprite: cc.Sprite,
        nickLabel: cc.Label,
        topScoreLabel: cc.Label,
    },

    init: function (rank, data) {
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;

        if (rank % 2 == 0) {
            this.backSprite.color = new cc.Color(55, 55, 55, 255);
        }

        if (rank == 0) {
            this.rankLabel.node.color = new cc.Color(255, 0, 0, 255);
        } else if (rank == 1) {
            this.rankLabel.node.color = new cc.Color(255, 255, 0, 255);
        } else if (rank == 2) {
            this.rankLabel.node.color = new cc.Color(100, 255, 0, 255);
        }
        this.rankLabel.string = (rank + 1).toString();
        this.createImage(avatarUrl);
        this.nickLabel.string = nick;
        this.topScoreLabel.string = grade.toString() + "分";
    },

    createImage(avatarUrl) {
        if (window.wx != undefined) {
            try {
                let image = wx.createImage();
                image.src = avatarUrl;
                image.onload = () => {
                    try {
                        console.log("wx load image success");
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
                        this.avatarImgSprite.node.setScale(1);
                    } catch (e) {
                        console.log("wx init image error: ", e);
                        this.avatarImgSprite.node.active = false;
                    }
                };
               
            }catch (e) {
                console.log("wx create image error: ", e);
                this.avatarImgSprite.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                console.log("load image : ", e);
                this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    }
    
});
