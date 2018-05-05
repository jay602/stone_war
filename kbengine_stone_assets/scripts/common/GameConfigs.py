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
ITEM_STONE_TYPE = 1       
ITEM_BEEHIVE_TYPE = 2     

PLAYER_NAMES = ["pipi_player", "pop_player"]

ITEM_COUNT_IN_ROOM = 4

PLAYER_STRAT_POINT = { 
        "map1":( (78.6, 0.0, 8.4), (-39.8, 0.0, 2.6) ),
        "map2":((65.7,2.9,0), (44.7, 8.6, 0)),
        "map3":((65.7,2.9,0), (44.7, 8.6, 0))
    }


ITEMS = {
    "map1" : {
       "cd" : { "harm": 100, "pos": (-53.11, 0.0, -0.18846) }, 
       "pdg" : { "harm": 100, "pos": (-15.4, 0.0, 5.77) }, 
       #"sk" : { "harm": 20, "pos": (102.5, 0.0, 2.3) },
       "sk" : { "harm": 100, "pos": (87.22, 0.0, 16.1) },
       "sk2" : { "harm": 100, "pos": (58.67, 0.0, 3.95) },  
       "sk3" : { "harm": 100, "pos": (-0.2, 0.0, 7) }
       #"sk3" : { "harm": 10, "pos": (-0.2, 0.0, 7) }
    }
}

SCALE = 10

#每轮的时间
PLAY_TIME_PER_TURN = 30

#人物HP的初始值
PLAYER_HP = 100








