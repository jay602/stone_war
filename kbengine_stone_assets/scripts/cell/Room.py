# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import GameConfigs
import random
import GameUtils

TIMER_TYPE_DESTROY = 1
TIMER_TYPE_BALANCE_MASS = 2

class Room(KBEngine.Entity):
	"""
	游戏场景
	"""
	def __init__(self):
		KBEngine.Entity.__init__(self)
		
		# 把自己移动到一个不可能触碰陷阱的地方
		self.position = (999999.0, 0.0, 0.0)

		# 这个房间中所有的玩家
		self.avatars = {}	
		self.items = []
		DEBUG_MSG('created space[%d] entityID = %i.' % (self.roomKeyC, self.id))
		KBEngine.globalData["Room_%i" % self.spaceID] = self.base
		self.createItems()
		
	def createItems(self):
		"""
		生成房间内的物品
		"""
		index = 0
		for name, harm in GameConfigs.ITEMS["map1"].items():
			pos = GameConfigs.ITEMS_POSITION["map1"][index]
			index += 1
			DEBUG_MSG("create item: name=%s harm=%i." % (name, harm))
			DEBUG_MSG("item positin")
			DEBUG_MSG(pos)
			dir = (0.0, 0.0, 0.0)
			entity = KBEngine.createEntity("Item", self.spaceID, pos, dir, {"name" : name, "harm" : harm})
			self.items.append(entity.id)
		
	def onDestroy(self):
		"""
		KBEngine method.
		"""
		DEBUG_MSG("Room::onDestroy: %i" % (self.id))
		del KBEngine.globalData["Room_%i" % self.spaceID]

		
	def onEnter(self, entityCall):
		"""
		defined method.
		进入场景
		"""
		DEBUG_MSG('Room::onEnter space[%d] entityID = %i.' % (self.spaceID, entityCall.id))
		self.avatars[entityCall.id] = entityCall

	def onLeave(self, entityID):
		"""
		defined method.
		离开场景
		"""
		DEBUG_MSG('Room::onLeave space[%d] entityID = %i.' % (self.spaceID, entityID))
		
		if entityID in self.avatars:
			del self.avatars[entityID]

		if len(self.avatars) == 0 :
			self.destroy()

		

