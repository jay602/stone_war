# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import GameUtils
import GameConfigs
import random
import copy
from interfaces.EntityCommon import EntityCommon


class Avatar(KBEngine.Entity, EntityCommon):
	def __init__(self):
		KBEngine.Entity.__init__(self)
		EntityCommon.__init__(self)
		DEBUG_MSG("Avatar %i cell new" % (self.id))
		DEBUG_MSG(self.position)
		self.startPosition = copy.deepcopy(self.position)
		self.getCurrRoom().onEnter(self)
		
	def isAvatar(self):
		"""
		virtual method.
		"""
		return True
	#--------------------------------------------------------------------------------------------
	#                              Callbacks
	#--------------------------------------------------------------------------------------------
	def onTimer(self, tid, userArg):
		pass

	def onGetWitness(self):
		"""
		KBEngine method.
		绑定了一个观察者(客户端)
		"""
		DEBUG_MSG("Avatar::onGetWitness: %i." % self.id)

	def onLoseWitness(self):
		"""
		KBEngine method.
		解绑定了一个观察者(客户端)
		"""
		DEBUG_MSG("Avatar::onLoseWitness: %i." % self.id)
	
	def onDestroy(self):
		"""
		KBEngine method.
		entity销毁
		"""
		DEBUG_MSG("Avatar::onDestroy: %i." % self.id)
		room = self.getCurrRoom()
		
		if room:
			room.onLeave(self.id)

	def rightJump(self, exposed):
		DEBUG_MSG("avavtar %i right jump, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return
		DEBUG_MSG("avatar %i start right jump" % (self.id))
		self.otherClients.onRightJump()

	def leftJump(self, exposed):
		DEBUG_MSG("avavtar %i left jump, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return
		DEBUG_MSG("avatar %i start left jump" % (self.id))
		self.otherClients.onLeftJump()

	def jump(self, exposed):
		"""
		defined.
		玩家跳跃 我们广播这个行为
		"""
		DEBUG_MSG("receive avavtar %i jump, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return
		DEBUG_MSG("avatar %i start jump" % (self.id))
		self.otherClients.onJump()

	def pickUpItem(self, exposed, itemID, position):
		"""
		defined.
		玩家捡石头 我们广播这个行为
		"""
		DEBUG_MSG("avavtar %i pickUpItem, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return
		DEBUG_MSG("avatar %i pick up item=%i" % (self.id, itemID))
		DEBUG_MSG(position)
		self.otherClients.onPickUpItem(itemID, position)


	def throwItem(self, exposed, itemID, force):
		DEBUG_MSG("avavtar %i throw item=%d, force, selfID=%i" % (exposed, itemID, self.id))
		if exposed != self.id:
			return

		item = None
		room = self.getCurrRoom()
		if room:
			room.killNewTurnTimer()
			item = room.findItemByID(itemID)
			item.throwPlayerID = self.id

		self.throwCount += 1
			
		DEBUG_MSG("avatar %i pick up item=%i" % (self.id, itemID))
		self.otherClients.onThrowItem(itemID, force)

	def newTurn(self, exposed):
		DEBUG_MSG("avavtar %i newTurn, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return

		room = self.getCurrRoom()
		
		if room:
			room.nextPlayer()

	def stopWalk(self, exposed, pos):
		DEBUG_MSG("avavtar %i stopWalk, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return

		self.otherClients.onStopWalk(pos)


	def startWalk(self, exposed, moveFlag):
		DEBUG_MSG("avavtar %i start walk, selfID=%i moveflag=%i" % (exposed, self.id, moveFlag))
		if exposed != self.id:
			return

		self.otherClients.onStartWalk(moveFlag)

	def recoverItem(self, exposed, itemID):
		DEBUG_MSG("avavtar %i recover item:%i, selfID=%i" % (exposed, itemID, self.id))
		if exposed != self.id:
			return

		self.otherClients.onRecoverItem(itemID)

	def reset(self):
		self.harmCount = 0
		DEBUG_MSG("avatar %i reset: harmCount=%i" % (self.id, self.harmCount))

	def recvDamage(self, exposed, itemID):
		DEBUG_MSG("avavtar %i recvDamage: itemID=%i, selfID=%i, harmCount=%i" % (exposed, itemID, self.id, self.harmCount))
		if exposed != self.id:
			return

		self.harmCount += 1
		if self.harmCount > 1:
			return

		room = self.getCurrRoom()
		otherPlayer = None
		item = None
		harm = 0
		if room:
			item = room.findItemByID(itemID)

		if item:
			harm = item.harm
			if item.throwPlayerID > 0:
				otherPlayer = room.findAvatarByID(item.throwPlayerID)

		if otherPlayer and otherPlayer.id != self.id:
			otherPlayer.hitCount += 1
			otherPlayer.totalHarm += harm

		self.HP = self.HP - harm
		if self.HP <= 0:
			self.HP = 0

		DEBUG_MSG("avatar %i recv harm=%i hp=%i harmCount=%i from player %i " % (exposed, harm, self.HP, self.harmCount, otherPlayer.id))

		self.client.onRecvDamage(self.id, harm, self.HP)
		self.otherClients.onRecvDamage(self.id, harm, self.HP)

		#HP小于等于0，则通知播放死亡动画，然后结束当局游戏
		if self.HP <= 0:
			DEBUG_MSG("avatar id=%i name=%s is defeated !!!" % (self.id, self.name))
			self.client.onDie(self.id)
			self.otherClients.onDie(self.id)
			room.gameOver()


	def isDead(self):
		return self.HP <= 0

	def leaveRoom(self, exposed):
		pass

	def resetItem(self, exposed, itemID):
		DEBUG_MSG("reset item %i" % (itemID))
		room = self.getCurrRoom()
		if room:
			item = room.resetItem(itemID)

	def addItem(self, exposed, left):
		DEBUG_MSG("add item ......")

		room = self.getCurrRoom()
		if room:
			room.addItem(left)

	def resetGameData(self):
		self.hitRate = 0.0
		self.totalTime = 0
		self.totalHarm = 0
		self.score = 0
		self.hitCount = 0
		self.throwCount = 0
		self.HP = 100

	def continueGame(self, exposed):
		DEBUG_MSG("Avatar %i continueGame" % (self.id))
		if self.id != exposed:
			return
		DEBUG_MSG(self.position)
		self.position = copy.deepcopy(self.startPosition)
		DEBUG_MSG(self.startPosition)
		self.client.onContinueGame(self.id)
		#self.otherClients.onContinueGame(self.id)

		room = self.getCurrRoom()
		if room:
			room.addReadyPlayerCount(1, self)
			