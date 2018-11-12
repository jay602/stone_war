# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import * 

TIMER_TYPE_ENTITY_DESTROY = 100

class EntityCommon:
	"""
	服务端游戏对象的基础接口类
	"""
	def __init__(self):
		pass

	def initEntity(self):
		"""
		virtual method.
		"""
		pass
	
	def isAvatar(self):
		"""
		virtual method.
		"""
		return False

	def isItem(self):
		"""
		virtual method.
		"""
		return False

	
	def getCurrRoomBase(self):
		"""
		获得当前space的entity baseEntityCall
		Room-cell Avatar-cell在同一space,所以两者的spaceID是一样的。
		"""
		return KBEngine.globalData.get("Room_%i" % self.spaceID)

	def getCurrRoom(self):
		"""
		获得当前space的entity
		"""
		roomBase = self.getCurrRoomBase()
		if roomBase is None:
			return roomBase
		# id是Entity的对象id。这个id是一个整型，在base，cell和client相关联的实体之间是相同的。 
		# 因此，在cellapp上调用KBEngine.entities.get()得到Room-cell,也就是Avatar所在的房间
		return KBEngine.entities.get(roomBase.id, None)
		
	def getHalls(self):
		"""
		获取场景管理器
		"""
		return KBEngine.globalData["Halls"]
	
	def startDestroyTimer(self):
		"""
		virtual method.
		
		启动销毁entitytimer
		"""
		self.addTimer(5, 0, TIMER_TYPE_ENTITY_DESTROY)
		DEBUG_MSG("%s::startDestroyTimer: %i running." % (self.className, self.id))
	
	#--------------------------------------------------------------------------------------------
	#                              Callbacks
	#--------------------------------------------------------------------------------------------
	def onTimer(self, tid, userArg):
		"""
		KBEngine method.
		引擎回调timer触发
		"""
		#DEBUG_MSG("%s::onTimer: %i, tid:%i, arg:%i" % (self.getScriptName(), self.id, tid, userArg))
		if TIMER_TYPE_ENTITY_DESTROY == userArg:
			self.onDestroyEntityTimer()
			
	def onRestore(self):
		"""
		KBEngine method.
		entity的cell部分实体被恢复成功
		"""
		DEBUG_MSG("%s::onRestore: %s" % (self.className, self.base))

	def onDestroyEntityTimer(self):
		"""
		entity的延时销毁timer
		"""
		self.destroy()
