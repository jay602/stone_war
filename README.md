## 投石对战微信小游戏

cocos creator 1.9.1 + KBEngine1.1.x

## 本项目作为KBEngine服务端引擎的微信小游戏演示而写


## 官方论坛

	https://bbs.comblockengine.com/


## QQ交流群

	461368412 

## Releases
    sourrce : https://github.com/jay602/stone_war

## 文档
    https://github.com/jay602/stone_war/tree/master/kbengine_stone_assets/docs


## 开始:
    1. 确保已经下载过KBEngine服务端引擎，如果没有下载请先下载
		下载服务端源码(KBEngine)：
			https://github.com/kbengine/kbengine/releases/latest

		编译和安装(KBEngine)：
			https://www.comblockengine.com/docs/1.0/install/index/

    2. 拷贝服务端资产库"kbengine_stone_assets"到服务端引擎根目录"kbengine/"之下，如下图：
![demo_configure](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710153206.png)

## 配置Demo(可选):
    改变登录IP地址与端口
        cocoscreator_assets/assets/scripts/cc_scripts/Common.js
                window.SERVER_URL = "xxx.com";     //登录服务器的域名
                window.SERVER_IP = "192.168.0.106";
                window.SERVER_PORT = "20013";

        cocoscreator_assets/assets/scripts/cc_scripts/StartScene.js
                 initKbengine: function() {
                    var args = new KBEngine.KBEngineArgs();
	                args.ip = SERVER_IP;
                    args.port = SERVER_PORT;
                    args.isWss = true;              //是否是有wss协议， true:wss  false:ws
                    args.isByIP = true;             //用ip还是用域名登录服务器   修改了官方的kbengine.js
                    args.serverURL = SERVER_URL;
	                KBEngine.create(args);
                },

## 启动服务器:

	先开启服务端
		Windows:
			kbengine_stone_assets\start_server.bat

		Linux:
			kbengine_stone_assets\start_server.sh

	检查启动状态:
		如果启动成功将会在日志中找到"Components::process(): Found all the components!"。
		任何其他情况请在日志中搜索"ERROR"关键字，根据错误描述尝试解决。

## 构建发布微信小游戏

    用cocos creator打开"cocoscreator_assets"客户端项目
![demo_configure](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710155655.png)

    构建项目, 在cocos creator的菜单栏里选择"项目" ---> "构建发布",  然后点击"构建"
![demo_configure](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/picture2.png)

    构建完成后，点”运行”，启动微信开发者工具,点微信开发者工具的”预览”按钮，生成小游戏的二维码，用手机微信扫描，即可在微信上测试小游戏
![demo_configure](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/picture3.png)



## 演示截图:

![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/picture1.png)
![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710094903.png)
![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710094921.png)
![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710094955.png)
![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710095013.png)
![screenshots1](https://github.com/jay602/stone_war/blob/master/kbengine_stone_assets/docs/img/20180710095057.png)

