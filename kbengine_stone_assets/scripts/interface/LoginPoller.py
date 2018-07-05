# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import tornado.httpclient
from urllib import parse
import GameConfigs

def onTornadoIOLoop(timerID):
	KBEngine.delTimer(timerID)
	tornado.ioloop.IOLoop.current().start()
	KBEngine.addTimer(0.3, 0, onTornadoIOLoop)

class LoginPoller:
	def __init__(self):
		DEBUG_MSG("======================= LoginPoller .__init__ =======================")
		self._callback = None
		self._loginName = ""
		KBEngine.addTimer(0.3, 0, onTornadoIOLoop)

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
		http_client.fetch(url, self.onWxLoginResult)

	def onWxLoginResult(self, response):
		DEBUG_MSG("onWxLoginResult .....")
		if response.error:
			ERROR_MSG("wx Error: %s" % (response.error))
		else:
			INFO_MSG(response.body)
			wxLoginResult = response.body.decode('utf8')
			DEBUG_MSG(wxLoginResult)
			if wxLoginResult:
				userInfo = eval(wxLoginResult)
				realAccountName = userInfo["openid"]
				DEBUG_MSG("wx login result, loginname: %s" % (self._loginName))
				self._callback(self._loginName, realAccountName, response.body, KBEngine.SERVER_ERR_LOCAL_PROCESSING)
