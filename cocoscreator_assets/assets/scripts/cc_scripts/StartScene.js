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
       
        this.btn_start.node.on('click', this.startGame, this);
        this.textinput_name.string = this.randomstring(4);
        cc.director.preloadScene("WorldScene", function () {
            KBEngine.INFO_MSG("Next scene preloaded");
        });
     },

     start: function() {
        if(cc.sys.isMobile) {
            wx.login({
                success: function () {
                  console.log("wxlogin");
                  wx.getUserInfo();
                }
              })
        }
       
      
     },

    //  wxLoginNative() {
    //     var self = this;
    //     wx.login({
            
    //     }

    //     ),
    //  },

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
	    args.ip = "192.168.0.106";
	    args.port = 20013;
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
        cc.log(logStr);
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
        cc.log(logStr); 	
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
         
    
     enterScene : function(rndUUID, eid, accountEntity) {
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
        if(this.textinput_name.string.length < 3)
        {
            this.label_hint.string = "长度必须大于等于3!";
            return;
        }
 
        KBEngine.Event.fire("login", this.textinput_name.string, "123456", "kbengine_cocos2d_js_demo");  
     },

    start () {

    },

    // update (dt) {},
});
