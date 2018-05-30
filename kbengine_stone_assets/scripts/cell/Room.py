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
TIMER_TYPE_SECOND = 6

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
		self.secondTimer = 0
		self.totalTime = 0
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
		if TIMER_TYPE_GAME_START == userArg:
			self.startGame()
			self.newTurnTimer = self.addTimer(GameConfigs.PLAY_TIME_PER_TURN, 0, TIMER_TYPE_NEXT_PLAYER)
			DEBUG_MSG("Time to Game Start, newTurnTimer=%i" % (self.newTurnTimer))

		if TIMER_TYPE_NEXT_PLAYER == userArg:
			self.nextPlayer()

		if TIMER_TYPE_GAME_OVER == userArg:
			DEBUG_MSG("Game is Over !!!")
			self.settleAccount()

		if TIMER_TYPE_SECOND == userArg:
			self.totalTime += 1

	def getTotalTime(self):
		return self.totalTime

	def settleAccount(self):
		for entity in self.avatars.values():
				win = not entity.isDead()
				result = "lose"
				if win:
					result = "win"
				DEBUG_MSG("entity id=%i is %s" % (entity.id, result))

				entity.hitRate = round(entity.hitCount/entity.throwCount, 3)
				entity.totalTime = self.totalTime
				entity.score = int(100000 * entity.hitRate * entity.totalHarm / entity.totalTime)
				entity.client.onGameOver(win, entity.hitRate, entity.totalTime, entity.totalHarm, entity.score)

				DEBUG_MSG("entity id=%i,  hitCount=%i, throwCount=%i" % (entity.id, entity.hitCount, entity.throwCount))
				DEBUG_MSG("entity id=%i, game result(%f, %i, %i, %i)" % (entity.id, 
					entity.hitRate, entity.totalTime, entity.totalHarm, entity.score))

	def startGame(self):
		self.secondTimer = self.addTimer(1, 1, TIMER_TYPE_SECOND)
		self.newTurn(self.curEid)
	
	def newTurn(self, eid):
		DEBUG_MSG("Room Key=%i" % (self.roomKeyC))
		for item in self.items.values():
			item.throwPlayerID = 0
			
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
				
		self.killNewTurnTimer()

		for eid, entity in self.avatars.items():
			if self.curEid != eid:
				self.curEid = eid
				break
		
		self.newTurn(self.curEid)
		self.newTurnTimer = self.addTimer(GameConfigs.PLAY_TIME_PER_TURN, 0, TIMER_TYPE_NEXT_PLAYER)
		DEBUG_MSG('Room::nextPlayer: eid=%i  newTurnTimer=%i' % (self.curEid, self.newTurnTimer))


	def killNewTurnTimer(self):
		DEBUG_MSG('Room::killNewTurnTimer: newTurnTimer=%i' % (self.newTurnTimer))
		if self.newTurnTimer > 0:
			self.delTimer(self.newTurnTimer)
			self.newTurnTimer = 0

	def findItemByID(self, itemID):
		return self.items[itemID]

	def gameOver(self):
		if self.secondTimer > 0:
			self.delTimer(self.secondTimer)
			self.secondTimer = 0

		self.addTimer(1, 0, TIMER_TYPE_GAME_OVER)

	def resetItem(self, itemID):
		item = self.items[itemID]
		pos = item.position
		DEBUG_MSG("reset item position(%f, %f, %f)" % (pos.x, pos.y, pos.z))
		if item:
			for entity in self.avatars.values():
				entity.client.onResetItem(itemID, pos)

	def addItem(self, left):
		item = GameConfigs.ITEMS["map1"]
		itemPos = None
		if left==0:
			itemPos = GameConfigs.ITEMS_POS["map1"]["left"]
		else:
			itemPos = GameConfigs.ITEMS_POS["map1"]["right"]

		count = 3
		index = 0
		for name, prop in GameConfigs.ITEMS["map1"].items():
			if index >= 3:
				break
				
			pos = itemPos[index]
			index += 1
			harm = prop['harm']
			dir = (0.0, 0.0, 0.0)
			entity = KBEngine.createEntity("Item", self.spaceID, pos, dir, {"name" : name, "harm" : harm})
			self.items[entity.id] = entity

	def findAvatarByID(self, avatarID):
		return self.avatars[avatarID]
