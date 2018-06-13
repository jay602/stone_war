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
        rankingScrollView: cc.ScrollView,
        scrollViewContent: cc.Node,
        prefabRankItem: cc.Prefab,
        myScore: cc.Label,
    },


    start () {
        if (window.wx != undefined) {
            wx.onMessage(data => {
                console.log('收到主域发来的消息: ', data);
                switch (data.message) {
                    case 'Show':
                        this.show();
                        break;
                    case 'Hide':
                        this.hide();
                        break;
                }
            });
        }
    },

    show () {
        if (window.wx == undefined) return;

        this.fetchFriendData();
    },

    hide () {
        this.removeChild();
    },

    removeChild() {
        this.scrollViewContent.removeAllChildren();
    },

    fetchFriendData() {
        if (window.wx != undefined) {
            this.removeChild();
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('getUserInfo success  ', userRes.data);
                    let userData = userRes.data[0];
                    
                    wx.getFriendCloudStorage({
                        keyList: ['score'],
                        success: res => {
                            console.log("wx.getFriendCloudStorage success",  res);
                            let data = res.data;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });

                            for (let i = 0; i < data.length; i++) {
                                var playerInfo = data[i];
                                var item = cc.instantiate(this.prefabRankItem);
                                item.getComponent('RankItem').init(i, playerInfo);
                                this.scrollViewContent.addChild(item);

                                if (data[i].avatarUrl == userData.avatarUrl) {
                                    this.myScore.string = "我的分数: " + data[i].KVDataList[0].value + ", 排名: " +  (i+1);
                                }
                            }

                            this.rankingScrollView.scrollToTop(0.1);
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        }
                    });
                },

                fail: res => {
                    console.log("wx.getUserInfo fail", res);
                },
            });
        }
    },
});
