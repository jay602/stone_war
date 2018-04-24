# -*- coding: utf-8 -*-
import KBEngine
from KBEDebug import *
import GameUtils
import GameConfigs
from interfaces.EntityCommon import EntityCommon

TIMER_TYPE_ADD_TRAP = 1

class Avatar(KBEngine.Entity, EntityCommon):
	def __init__(self):
		KBEngine.Entity.__init__(self)
		EntityCommon.__init__(self)
		DEBUG_MSG("Avatar cell ctor position")
		DEBUG_MSG(self.position)
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


	def onUpgrade(self):
		pass
		
	def onEnterTrap(self, entityEntering, range_xz, range_y, controllerID, userarg):
		pass

	def onLeaveTrap(self, entityLeaving, range_xz, range_y, controllerID, userarg):
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

	def pickUpItem(self, exposed, itemID):
		"""
		defined.
		玩家跳跃 我们广播这个行为
		"""
		DEBUG_MSG("receive avavtar %i pickUpItem, selfID=%i" % (exposed, self.id))
		if exposed != self.id:
			return
		DEBUG_MSG("avatar %i pick up item=%i" % (self.id, itemID))
		self.otherClients.onPickUpItem(itemID)
