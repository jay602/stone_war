# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import GameConfigs
import random
import GameUtils

TIMER_TYPE_DESTROY = 1
TIMER_TYPE_BALANCE_MASS = 2
TIMER_TYPE_GAME_START = 3
TIMER_TYPE_NEXT_PLAYER = 4

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
		self.curEid = 0
		DEBUG_MSG('created space[%d] entityID = %i.' % (self.roomKeyC, self.id))
		KBEngine.globalData["Room_%i" % self.spaceID] = self.base
		self.createItems()
		
	def createItems(self):
		"""
		生成房间内的物品
		"""
		for name, prop in GameConfigs.ITEMS["map1"].items():
			harm = prop['harm']
			pos = prop['pos']
			DEBUG_MSG("create item: name=%s harm=%i." % (name, harm))
			DEBUG_MSG("prop: ")
			DEBUG_MSG(prop)
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

		if len(self.avatars) == 1:
			self.curEid = entityCall.id

		#够两人了，就游戏开始
		if len(self.avatars) == GameConfigs.ROOM_MAX_PLAYER:
			self.addTimer(1, 0, TIMER_TYPE_GAME_START)

	def onTimer(self, id, userArg):
		"""
		KBEngine method.
		使用addTimer后， 当时间到达则该接口被调用
		@param id		: addTimer 的返回值ID
		@param userArg	: addTimer 最后一个参数所给入的数据
		"""
		if TIMER_TYPE_GAME_START == userArg:
			DEBUG_MSG("Time to Game Start")
			self.startGame()
			self.addTimer(GameConfigs.PLAY_TIME_PER_TURN, 0, TIMER_TYPE_NEXT_PLAYER)

		if TIMER_TYPE_NEXT_PLAYER == userArg:
			self.nextPlayer()

	def startGame(self):
		self.newTurn(self.curEid)
	
	def newTurn(self, eid):
		for entity in self.avatars.values():
			entity.client.newTurn(eid)

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


	def nextPlayer(self):
		for eid, entity in self.avatars.items():
			if self.curEid != eid:
				self.curEid = eid
				break

		DEBUG_MSG('Room::nextPlayer: eid=%i' % (self.curEid))

