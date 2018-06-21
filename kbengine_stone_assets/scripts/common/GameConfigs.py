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
        "map1":( (64.0, 0.0, 6.5), (-28.6, 0.0, 2.2) ),
        "map2":((65.7,2.9,0), (44.7, 8.6, 0)),
        "map3":((65.7,2.9,0), (44.7, 8.6, 0))
    }

PLAYER_POSITON = [(0.0, 0.0, 9999999.0), (0.0, 0.0, -9999999.0)]



ITEMS = {
    "map1" : {
       "cd" : { "harm": 40, "pos": (-53.11, 0.0, -0.18846) }, 
       "pdg" : { "harm": 30, "pos": (-15.36, 0.0, 4.637) }, 
       "sl" : { "harm": 20, "pos": (112.22, 0.0, 1.634) },
       "sk" : { "harm": 20, "pos": (85.4, 0.0, 0.81) },
       "sk2" : { "harm": 20, "pos": (47.363, 0.0, 3.38) },  
       "sk3" : { "harm": 20, "pos": (1.879, 0.0, 6.207) },
       "sld" : { "harm": 10, "pos": (-20, 0.0, 2) }
    }
}

ITEMS_POS = {
    "map1" : {
        "left" : [(85.4, 0.0, 0.81), (47.363, 0.0, 3.38), (110.09, 0.0, 3.38), (150, 0.0, 0.0)],
        "right" :[(-53.11, 0.0, -0.18846),  (-15.36, 0.0, 4.637), (1.879, 0.0, 6.207), (-86, 0, 0.1)]
    }
}

SCALE = 10

#每轮的时间
PLAY_TIME_PER_TURN = 30

#人物HP的初始值
PLAYER_HP = 100

DESKTOP_BROWSER = 101
WECHAT_GAME = 104

APPID = "****************"
APP_SECRET = "**********************"
WEI_XIN_URL = 'https://api.weixin.qq.com/sns/jscode2session'









