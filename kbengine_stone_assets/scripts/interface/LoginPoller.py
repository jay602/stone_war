# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import tornado.httpclient
from urllib import parse
import GameConfigs
import time

def onTornadoIOLoop(timerID):
	#DEBUG_MSG("tornado io loop ..........")
	tornado.ioloop.IOLoop.current().start()

class LoginPoller:
	def __init__(self):
		DEBUG_MSG("======================= LoginPoller .__init__ =======================")
		self._callback = None
		self._loginName = ""
		self.startTime = None
		self.endTime = None
		self.count = 0
		self.isFirst = True
		self.totalTime = 0.0
		#tornado.ioloop.IOLoop.current().start()
		KBEngine.addTimer(0, 0.01, onTornadoIOLoop)

	def wxLogin(self, loginCode, callBack):
		self._callback = callBack
		self._loginName = loginCode
		#构建微信接口URL: https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
		values = {}
		values['appid'] = GameConfigs.APPID
		values['secret'] = GameConfigs.APP_SECRET
		values['js_code'] = loginCode
		values['grant_type'] = 'authorization_code'
		query_string = parse.urlencode(values)
		url = GameConfigs.WEI_XIN_URL + "?" + query_string

		http_client =  tornado.httpclient.AsyncHTTPClient()

		if self.isFirst:
			self.startTime = time.clock()
			self.isFirst = False

		http_client.fetch(url, self.onWxLoginResult)

	def onWxLoginResult(self, response):
		self.endTime = time.clock()
		self.totalTime = self.endTime - self.startTime
		self.count += 1
		DEBUG_MSG("tonado visit weixin time： count=%d totalTime=%f " % (self.count, self.totalTime))

		if response.error:
		 	DEBUG_MSG("wx Error: %s" % (response.error))

		datas = bytes()
		self._callback(self._loginName, self._loginName, datas, KBEngine.SERVER_ERR_LOCAL_PROCESSING)

		# if response.error:
		# 	ERROR_MSG("wx Error: %s" % (response.error))
		# 	return
		# else:
		# 	INFO_MSG(response.body)
		# 	datas = response.body
		# 	wxLoginResult = datas.decode('utf8')	#utf8解码出来的wxLoginResult变量是byte数据类型
		# 	DEBUG_MSG(wxLoginResult)
		# 	if wxLoginResult:
		# 		userInfo = eval(wxLoginResult)		#将wxLoginResult转成字典
		# 		realAccountName = userInfo["openid"]
		# 		DEBUG_MSG("wx login result, loginname: %s" % (self._loginName))
		# 		#用户的openid作为realAccountName；将opendi和session_key作为附带数据extraDatas传进去，可以通过base实体的getClientDatas接口在脚本读取extraDatas
		# 		self._callback(self._loginName, realAccountName, datas, KBEngine.SERVER_ERR_LOCAL_PROCESSING)
