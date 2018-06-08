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
//var WxBizDataCrypt = require("WxBizDataCrypt")
var WxBizDataCrypt = require("WxBizDataCrypt");

cc.Class({
    extends: cc.Component,

    properties: {
        btn_start: {
            default: null,
            type: cc.Button,
        },
        textinput_name:{
            default: null,
            type: cc.EditBox,
        },

        label_hint: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.initKbengine();
        this.installEvents();
        this.loadItemPrefab();
        
        this.userName = cc.sys.platform != cc.sys.WECHAT_GAME ? this.randomstring(4): '';
        this.btn_start.node.on('click', this.startGame, this);
        this.code = null;
        
        cc.director.preloadScene("WorldScene");

        if(cc.sys.platform == cc.sys.WECHAT_GAME) {
            KBEngine.INFO_MSG("wx login ........");
            this.wxLoginNative2();
        } else {
            this.textinput_name.string = this.userName;
        }

        KBEngine.INFO_MSG("host: " + window.location.host);
        KBEngine.INFO_MSG("port: " + window.location.port);
     },

     wxLoginNative3: function(){
        KBEngine.INFO_MSG("wx getUserInfo ........");
        var self = this;
        wx.getUserInfo({
            success: function(res) {
                var userInfo = res.userInfo;
                self.userName = userInfo.nickName;
                self.textinput_name.string = self.userName;

                KBEngine.INFO_MSG("wx get user info success : data= " + JSON.stringify(res));
                KBEngine.INFO_MSG("wx get user info success : userInfo= " + JSON.stringify(userInfo));
                KBEngine.INFO_MSG("wx get user info success : nickName= " + userInfo.nickName);
                KBEngine.INFO_MSG("wx get user info success : avatarUrl= " + userInfo.avatarUrl);
            }
        });
     },

    wxLoginNative2: function(){
        var self = this;
        wx.login({
            success: function(res) {
                KBEngine.INFO_MSG("wx.login success ...");
                KBEngine.INFO_MSG("res ：" + JSON.stringify(res));
                if(res.code) {
                    self.code = res.code;
                    KBEngine.INFO_MSG('code: ' + self.code);
                   
                    wx.getUserInfo({
                        success: function(res) {
                            var userInfo = res.userInfo;
                            self.userName = userInfo.nickName;
                            self.textinput_name.string = self.userName;
                           
                            cc.sys.localStorage.setItem("encryptedData", res.encryptedData)
                            cc.sys.localStorage.setItem("iv", res.iv)

                            KBEngine.INFO_MSG("wx.getUserInfo success : data= " + JSON.stringify(res));
                            KBEngine.INFO_MSG("wx.getUserInfo success : userInfo= " + JSON.stringify(userInfo));
                            KBEngine.INFO_MSG("wx.getUserInfo success : nickName= " + userInfo.nickName);
                            KBEngine.INFO_MSG("wx.getUserInfo success : avatarUrl= " + userInfo.avatarUrl);
                            KBEngine.INFO_MSG("wx.getUserInfo success : encryptedData= " + res.encryptedData);
                            KBEngine.INFO_MSG("wx.getUserInfo success : iv= " + res.iv);
                        }
                    });
                }
                
            }
        }
        );
      },

      wxLoginNative4:function() {
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '获取用户信息',
            style: {
                left: 10,
                top: 76,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: '#ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });

        button.onTap(function(res){
            console.log(res);
        });
      },


     //微信登录
     wxLoginNative: function(){
       var self = this;
       wx.login({
            success:function(res) {
                KBEngine.INFO_MSG("res == " + JSON.stringify(res));
                if(res.code) {
                    self.code = res.code;
                    KBEngine.INFO_MSG('code: ' + self.code);
                   
                    KBEngine.INFO_MSG("-------申请openid--------");
                    wx.request({
                        url: WEI_XIN_API_URL,
                        data: {
                            appid: APPID,
                            secret: APP_SECRET,
                            js_code: self.code,
                            grant_type: 'authorization_code'
                        },
                        header: {
                            "Content_Type": "application/x-www-form-urlencoded"
                        },
                        method: 'GET',
                        success: function(res) {
                            KBEngine.INFO_MSG("login quest res == " +  JSON.stringify(res));
                            var pc = new WxBizDataCrypt(APPID, res.data.session_key);
                            
                            wx.getUserInfo({
                                success: function(res) {
                                    KBEngine.INFO_MSG("wx get user info success : data= " + JSON.stringify(res));
                                    var userInfo = res.userInfo;
                                    
                                    cc.sys.localStorage.setItem("encryptedData", res.encryptedData);
                                    cc.sys.localStorage.setItem("iv", res.iv);
                                    KBEngine.INFO_MSG("wx get user info success : userInfo= " + JSON.stringify(userInfo));
                                    KBEngine.INFO_MSG("wx get user info success : nickName= " + userInfo.nickName);
                                    KBEngine.INFO_MSG("wx get user info success : avatarUrl= " + userInfo.avatarUrl);

                                    var data = pc.descrytData(res.encryptedData , res.iv);
                                    console.log('解密后 data: ', data);
                                }
                            });
                        },
                        fail: function(res) {
                            KBEngine.INFO_MSG("wx login fail : " + JSON.stringify(res));
                        },
                        complete: function(res) {
                        }
                    });
                } else {
                    KBEngine.INFO_MSG("登录失败: " + res.errMsg)
                }
            }
       }
       );
     },

     randomstring: function(L){
        var s= '';
        var randomchar=function(){
         var n= Math.floor(Math.random()*62);
         if(n<10) return n; //0-9
         if(n<36) return String.fromCharCode(n+55); //A-Z
         return String.fromCharCode(n+61); //a-z
        }
        while(s.length< L) s+= randomchar();
        return s;
    },

    loadItemPrefab: function() {
        cc.loader.loadResArray(ItemPrefabUrl['map1'], cc.Prefab, function (err, prefabArray) {
            if (err) {
                cc.error("load item prefab error: " + err);
                return;
            }
            for(var prefab of prefabArray) {
                ItemPrefabMap[prefab.name] = prefab;
            }
           
        });
     },

     initKbengine: function() {
        var args = new KBEngine.KBEngineArgs();
	
	    // 设置登录ip地址
	    args.ip = NGINX_IP;
	    args.port = NGINX_PORT;
	    KBEngine.create(args);
     },

     installEvents:function() {
        KBEngine.Event.register("onConnectionState", this, "onConnectionState");
        KBEngine.Event.register("onLoginFailed", this, "onLoginFailed");
        KBEngine.Event.register("onLoginBaseappFailed", this, "onLoginBaseappFailed");
		KBEngine.Event.register("enterScene", this, "enterScene");
        KBEngine.Event.register("onReloginBaseappFailed", this, "onReloginBaseappFailed");
        KBEngine.Event.register("onReloginBaseappSuccessfully", this, "onReloginBaseappSuccessfully");
		KBEngine.Event.register("onLoginBaseapp", this, "onLoginBaseapp");
	
     },

     onConnectionState : function(success) {
        var logStr = '';
		if(!success) {
            logStr = " Connect(" + KBEngine.app.ip + ":" + KBEngine.app.port + ") is error! (连接错误)";
        }
		else {
            logStr = "Connect successfully, please wait...(连接成功，请等候...)";
        }
        this.label_hint.string = logStr;
        KBEngine.INFO_MSG(logStr);
	},

     onLoginFailed : function(failedcode) {
        var logStr = '';
        if(failedcode == 20)
        {
           logStr = "Login is failed(登陆失败), err=" + KBEngine.app.serverErr(failedcode) + ", " + KBEngine.app.serverdatas;
        }
        else
        {
           logStr = "Login is failed(登陆失败), err=" + KBEngine.app.serverErr(failedcode);
        }    
        
        this.label_hint.string = logStr;
        KBEngine.INFO_MSG(logStr);	
     },

     onReloginBaseappFailed: function(failedcode){
        cc.log("reogin is failed(断线重连失败), err=" + KBEngine.app.serverErr(failedcode))
     },

     onReloginBaseappSuccessfully : function() {
       cc.log("reogin is successfully!(断线重连成功!)")
    },

     onLoginBaseappFailed : function(failedcode) {
         cc.log("LoginBaseapp is failed(登陆网关失败), err=" + KBEngine.app.serverErr(failedcode));
     },

     decodeEncryptedData:function() {
        var encryptedData = cc.sys.localStorage.getItem("encryptedData");
        var sessionKey = cc.sys.localStorage.getItem("sessionKey");
        var iv = cc.sys.localStorage.getItem("iv");
        KBEngine.INFO_MSG("decodeEncryptedData: encryptedData=" + encryptedData + " ,iv=" + iv + " ,sessionKey=" + sessionKey);
        if(sessionKey && encryptedData && iv) {
            var pc = new WxBizDataCrypt(APPID, sessionKey);
            var data = pc.descrytData(encryptedData , iv);
            console.log('解密后 data: ', data)
        }
     },
         
     enterScene : function(rndUUID, eid, accountEntity) {
        var player = KBEngine.app.player();
        //debugger;
        if(player) {
            KBEngine.INFO_MSG("begin decodeEncryptedData ......");
            player.decodeEncryptedData();
        }

        cc.log("Login is successfully!(登陆成功!)");
        this.label_hint.string = "Login is successfully!(登陆成功!)";
        cc.director.loadScene("WorldScene");
     },
 
     onLoginBaseapp : function() {
         cc.log("Connect to loginBaseapp, please wait...(连接到网关， 请稍后...)");
     },
 
     Loginapp_importClientMessages : function() {
         cc.log("Loginapp_importClientMessages ...");
     },
 
     Baseapp_importClientMessages : function() {
         cc.log("Baseapp_importClientMessages ..");
     },
         
     Baseapp_importClientEntityDef : function() {
         cc.log("Baseapp_importClientEntityDef ..")
     },
 
 
    startGame: function (event) {
        KBEngine.INFO_MSG("user name : " + this.userName);
        KBEngine.INFO_MSG("user name length: " + this.userName.length);
        if(this.userName.length == 0)
        {
            this.label_hint.string = "用户名不能为空";
            return;
        }
        PLAYER_NAME = this.userName;
        var datas = "";
        datas += "platform=" + cc.sys.platform + "&";
        datas += "code=" + this.code;
        KBEngine.INFO_MSG("datas: " + datas);

        KBEngine.Event.fire("login", this.userName, "123456", datas);  
     },

});
