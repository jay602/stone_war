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
TIMER_TYPE_GAME_OVER = 5

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
		self.items = {}
		self.curEid = 0
		self.newTurnTimer = 0
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
			self.items[entity.id] = entity
		
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
		DEBUG_MSG("Room::onTimer: timeID=%i, userArg=%i" % (id, userArg))
		if TIMER_TYPE_GAME_START == userArg:
			self.startGame()
			self.newTurnTimer = self.addTimer(GameConfigs.PLAY_TIME_PER_TURN, 0, TIMER_TYPE_NEXT_PLAYER)
			DEBUG_MSG("Time to Game Start, newTurnTimer=%i" % (self.newTurnTimer))

		if TIMER_TYPE_NEXT_PLAYER == userArg:
			self.nextPlayer()

		if TIMER_TYPE_GAME_OVER == userArg:
			DEBUG_MSG("Game is Over !!!")
			for entity in self.avatars.values():
				win = not entity.isDead()
				result = "lose"
				if win:
					result = "win"
				DEBUG_MSG("entity id=%i is %s" % (entity.id, result))
				entity.client.onGameOver(win)

	def startGame(self):
		self.newTurn(self.curEid)
	
	def newTurn(self, eid):
		for entity in self.avatars.values():
			entity.reset()
			entity.client.onNewTurn(eid, GameConfigs.PLAY_TIME_PER_TURN)

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
		for entity in self.avatars.values():
			if entity.HP <= 0:
				self.gameOver()
				return
				
		
		self.delTimer(self.newTurnTimer)
		self.newTurnTimer = 0

		for eid, entity in self.avatars.items():
			if self.curEid != eid:
				self.curEid = eid
				break
		
		self.newTurn(self.curEid)
		self.newTurnTimer = self.addTimer(GameConfigs.PLAY_TIME_PER_TURN, 0, TIMER_TYPE_NEXT_PLAYER)
		DEBUG_MSG('Room::nextPlayer: eid=%i  newTurnTimer=%i' % (self.curEid, self.newTurnTimer))


	def killNewTurnTimer(self):
		DEBUG_MSG('Room::killNewTurnTimer: newTurnTimer=%i' % (self.newTurnTimer))
		self.delTimer(self.newTurnTimer)
		self.newTurnTimer = 0

	def findItemByID(self, itemID):
		return self.items[itemID]

	def gameOver(self):
		timer = self.addTimer(1, 0, TIMER_TYPE_GAME_OVER)
		DEBUG_MSG("add timer %i: game over" % (timer))
