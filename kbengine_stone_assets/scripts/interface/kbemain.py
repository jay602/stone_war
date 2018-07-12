# -*- coding: utf-8 -*-
import os
import KBEngine
from KBEDebug import *
from Poller import Poller
import GameConfigs
import string
import hashlib
import copy
from urllib import request, parse
import tornado.ioloop
import tornado.httpclient 
from LoginPoller import LoginPoller

"""
interfaces进程主要处理KBEngine服务端与第三方平台的接入接出工作。
(注意：由于interfaces是一个单线程服务器，如果需要使用python的http服务器库，建议使用异步的（例如：Tornado），否则会卡主线程造成阻塞)
目前支持几种功能:
1: 注册账号
	当客户端请求注册账号后，请求会由loginapp转发到dbmgr，如果dbmgr挂接了interfaces，则dbmgr将请求转发至这里（KBEngine.onRequestCreateAccount）
	此时脚本收到这个请求之后可以使用各种方式与第三方平台通信，可以使用python的http库也能直接使用socket，当与第三方平台交互完毕之后应该将
	交互的结果返回给引擎层，KBEngine.createAccountResponse。
	
2：账号登陆
	当客户端请求登陆账号后，请求会由loginapp转发到dbmgr，如果dbmgr挂接了interfaces，则dbmgr将请求转发至这里（KBEngine.onRequestAccountLogin）
	此时脚本收到这个请求之后可以使用各种方式与第三方平台通信，可以使用python的http库也能直接使用socket，当与第三方平台交互完毕之后应该将
	交互的结果返回给引擎层，KBEngine.accountLoginResponse。
	
3：充值计费
	当baseapp上请求计费entity.charge()后，请求会由loginapp转发到dbmgr，如果dbmgr挂接了interfaces，则dbmgr将请求转发至这里（KBEngine.onRequestCharge）
	此时脚本收到这个请求之后可以使用各种方式与第三方平台通信，可以使用python的http库也能直接使用socket，当与第三方平台交互完毕之后应该将
	交互的结果返回给引擎层，KBEngine.chargeResponse。
	
	某些平台要求客户端直接与平台请求计费，平台采用回调服务器的方式来完成请求， 参考“平台回调”。
	
4: 平台回调
	要完成此功能应该在脚本层创建一个socket，
	并将socket挂接到KBEngine中（这样可防止阻塞导致主线程卡），然后监听指定的端口。
	使用KBE的KBEngine.registerReadFileDescriptor()和KBEngine.registerWriteFileDescriptor()，具体查看API文档与Poller.py。
"""
g_LoginPoller = LoginPoller()


def onInterfaceAppReady():
	"""
	KBEngine method.
	interfaces已经准备好了
	"""
	INFO_MSG('onInterfaceAppReady: bootstrapGroupIndex=%s, bootstrapGlobalIndex=%s' % \
		(os.getenv("KBE_BOOTIDX_GROUP"), os.getenv("KBE_BOOTIDX_GLOBAL")))
	

def onTick(timerID):
	"""
	"""
	INFO_MSG('onTick()')

def onInterfaceAppShutDown():
	"""
	KBEngine method.
	这个interfaces被关闭前的回调函数
	"""
	INFO_MSG('onInterfaceAppShutDown()')
	g_poller.stop()

def onRequestCreateAccount(registerName, password, datas):
	"""
	KBEngine method.
	请求创建账号回调
	@param registerName: 客户端请求时所提交的名称
	@type  registerName: string
	
	@param password: 密码
	@type  password: string
	
	@param datas: 客户端请求时所附带的数据，可将数据转发第三方平台
	@type  datas: bytes
	"""
	INFO_MSG('onRequestCreateAccount: registerName=%s' % (registerName))
	INFO_MSG('onRequestCreateAccount: datas:')
	INFO_MSG(datas)
	commitName = registerName
	
	# 默认账号名就是提交时的名
	realAccountName = commitName 
	
	# 此处可通过http等手段将请求提交至第三方平台，平台返回的数据也可放入datas
	# datas将会回调至客户端
	# 如果使用http访问，因为interfaces是单线程的，同步http访问容易卡住主线程，建议使用
	# KBEngine.registerReadFileDescriptor()和KBEngine.registerWriteFileDescriptor()结合
	# tornado异步访问。也可以结合socket模拟http的方式与平台交互。
	
	KBEngine.createAccountResponse(commitName, realAccountName, datas, KBEngine.SERVER_SUCCESS)
	
def onRequestAccountLogin(loginName, password, datas):
	commitName = loginName
	realAccountName = copy.deepcopy(commitName)
	wetchat = '%d' % GameConfigs.WECHAT_GAME
	isWeiXinLogin = False
	param = eval(datas.decode('utf8'))
	
	if param["platform"] == wetchat:
		callback = lambda _commitName, _realAccountName, _datas, _result:{
					KBEngine.accountLoginResponse(_commitName, _realAccountName, _datas, _result)
				}
		g_LoginPoller.wxLogin(loginName, callback)
	else:
		KBEngine.accountLoginResponse(commitName, realAccountName, datas, KBEngine.SERVER_ERR_LOCAL_PROCESSING)
		
	"""
	if param["platform"] == wetchat:
			values = {}
			values['appid'] = GameConfigs.APPID
			values['secret'] = GameConfigs.APP_SECRET
			values['js_code'] = loginName
			values['grant_type'] = 'authorization_code'
			query_string = parse.urlencode(values)
			#构建微信接口URL: https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
			url = GameConfigs.WEI_XIN_URL + "?" + query_string
			
			try:
				DEBUG_MSG("visist wei xin server ....")
				#阻塞同步访问，大量用户访问时，会造成性能下降，建议使用异步访问
				#向微信服务器请求session_key和openid
				respone = request.urlopen(url).read().decode("utf8")
				userInfo = eval(respone)
				if respone:
					isWeiXinLogin = True
					realAccountName = userInfo["openid"]
					datas = str(userInfo).encode()
						
			except Exception as err:
				isWeiXinLogin = False
				DEBUG_MSG("weixin Error: " + str(err))
	"""
	#if not isWeiXinLogin:
		#datas = bytes()

	#KBEngine.accountLoginResponse(commitName, realAccountName, datas, KBEngine.SERVER_ERR_LOCAL_PROCESSING)
	
def onRequestCharge(ordersID, entityDBID, datas):
	"""
	KBEngine method.
	请求计费回调
	@param ordersID: 订单的ID
	@type  ordersID: uint64
	
	@param entityDBID: 提交订单的实体DBID
	@type  entityDBID: uint64
	
	@param datas: 客户端请求时所附带的数据，可将数据转发第三方平台
	@type  datas: bytes
	"""
	INFO_MSG('onRequestCharge: entityDBID=%s, entityDBID=%s' % (ordersID, entityDBID))
	
	# 此处可通过http等手段将请求提交至第三方平台，平台返回的数据也可放入datas
	# datas将会回调至baseapp的订单回调中，具体参考API手册charge
	# 如果使用http访问，因为interfaces是单线程的，同步http访问容易卡住主线程，建议使用
	# KBEngine.registerReadFileDescriptor()和KBEngine.registerWriteFileDescriptor()结合
	# tornado异步访问。也可以结合socket模拟http的方式与平台交互。
	
	KBEngine.chargeResponse(ordersID, datas, KBEngine.SERVER_SUCCESS)

# 加密得到3rd_session
def get3rdSession(openid):
    md5 = hashlib.md5()
    md5.update(openid.encode("utf-8"))
    return md5.hexdigest()

