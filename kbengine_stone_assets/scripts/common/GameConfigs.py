# -*- coding: utf-8 -*-

"""
"""

# ------------------------------------------------------------------------------
# entity state
# ------------------------------------------------------------------------------
ENTITY_STATE_UNKNOW									= -1
ENTITY_STATE_SAFE										= 0
ENTITY_STATE_FREE										= 1
ENTITY_STATE_MAX    									= 4


#  一个房间最大人数
ROOM_MAX_PLAYER = 2

#房间内物品数量的最大数
MAX_ITEM_COUNT = 5

#物品类型
ITEM_UNDEFINED_TYPE = 0   #未定义类型
ITEM_STONE_TYPE = 1       #石头
ITEM_BEEHIVE_TYPE = 2     #蜂窝

PLAYER_NAMES = ["pipi_player", "pop_player"]

ITEM_COUNT_IN_ROOM = 4

PLAYER_STRAT_POINT = { 
        "map1":( (65.7, 0.0, 2.9), (-25.0, 0.0, 5.0) ),
        "map2":((65.7,2.9,0), (44.7, 8.6, 0)),
        "map3":((65.7,2.9,0), (44.7, 8.6, 0))
    }


ITEMS = {
    "map1": {"cd":20, "lyg":25, "pdg":15, "sk2":10},
    "map2": {"cd":20, "lyg":25, "pdg":15, "sk2":10},
    "map3": {"cd":20, "lyg":25, "pdg":15, "sk2":10}
}

ITEMS_POSITION = {
    "map1":( (-20.5, 0.0, 6.4), (84.5, 0.0, 17.9), (-20.5, 0, 6.4), (59.3, 0, 5.4) ),
    "map2":( (-20.5, 0.0, 6.4), (84.5, 0.0, 17.9), (-20.5, 0, 6.4), (59.3, 0, 5.4) ),
    "map2":( (-20.5, 0.0, 6.4), (84.5, 0.0, 17.9), (-20.5, 0, 6.4), (59.3, 0, 5.4) )
}

SCALE = 10








