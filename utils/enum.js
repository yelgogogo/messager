const PROP = {
  'S': 'SOR_SKILL',
  'SOR': 'SOR_SKILL',
  '法师': 'SOR_SKILL',
  'SOR_SKILL_TXT': '法师技能',
  'NEC': 'NEC_SKILL',
  '死灵': 'NEC_SKILL',
  'NEC_SKILL_TXT': '死灵法师技能',
  'BO': 'BAR_SKILL',
  'BB': 'BAR_SKILL',
  'BAR': 'BAR_SKILL',
  'BAR_SKILL_TXT': '野蛮人技能',
  'P': 'PAL_SKILL',
  'PAL': 'PAL_SKILL',
  'PAL_SKILL_TXT': '圣骑士技能',
  'AMA': 'AMA_SKILL',
  'AMA_SKILL_TXT': '亚马逊技能',
  'DEX': 'DEX',
  'DEX_TXT': '敏捷',
  'HFD': 'HFD',
  '冰冻减半': 'HFD',
  'HFD_TXT': '冰冻减半',
  'ED': 'ED',
  'ED_TXT': '增强物品属性',
  'STR': 'STR',
  'AR': 'AR',
  'AR_TXT': '准确率加成',
  'STR_TXT': '力量',
  'LIFE': 'LIFE',
  '生命': 'LIFE',
  'LM': 'LM',
  'LM_TXT': '偷取法力',
  'DR': 'DR',
  'DR_TXT': '魔法伤害减免',
  'MDR': 'MDR',
  'MDR_TXT': '魔法伤害减免',
  'FCR': 'FCR',
  'FCR_TXT': '高速施展',
  'LL': 'LL',
  'LL_TXT': '偷取生命',
  'LF': 'LIFE',
  'LIFE_TXT': '生命',
  'MN': 'MANA',
  'MANA': 'MANA',
  '法力': 'MANA',
  'MANA_TXT': '法力',
  'FRW': 'FRW',
  'RUN': 'FRW',
  'FRW_TXT': '高速跑步',
  'FHR': 'FHR',
  'FHR_TXT': '快速打击恢复',
  'PLR': 'PLR',
  'PLR_TXT': '中毒快速恢复',
  '精力': 'STATIMA',
  'STATIMA_TXT': '精力',
  '生命恢复': 'REP',
  'REP': 'REP',
  'REP_TXT': '生命恢复',
  'MIN': 'MIN',
  'MIN_TXT': '最小伤害',
  'MAX': 'MAX',
  'MAX_TXT': '最大伤害',
  'EG': 'EG',
  'EG_TXT': '额外获得金钱',
  'MF': 'MF',
  'MF_TXT': '获得魔法装备',
  'X': 'X',
  'X_TXT': '数量',
  'R': 'R',
  '全抗': 'R',
  'R_TXT': '全部抗性',
  'FR多加': 'FR',
  'FR': 'FR',
  'FR_TXT': '火焰抗性',
  'PR': 'PR',
  'PR_TXT': '毒素抗性',
  'LR': 'LR',
  'LR_TXT': '闪电抗性',
  'CR': 'CR',
  'CR_TXT': '冰霜抗性'
}

const CATEGORY = {
  '项链：': 'AMULET',
  '项链:': 'AMULET',
  'AMULET_TXT': '项链',
  '腰带：': 'BELT',
  '腰带:': 'BELT',
  'BELT_TXT': '腰带',
  '头盔：': 'HELMET',
  '头盔:': 'HELMET',
  'HELMET_TXT': '头盔',
  '衣服：': 'ARMOR',
  '衣服:': 'ARMOR',
  '盔甲:': 'ARMOR',
  '盔甲：': 'ARMOR',
  'ARMOR_TXT': '盔甲',
  '戒指：': 'RING',
  '戒指:': 'RING',
  'RING_TXT': '戒指',
  '鞋子：': 'BOOTS',
  '鞋子:': 'BOOTS',
  'BOOTS_TXT': '靴子',
  '武器：': 'WEAPON',
  '武器:': 'WEAPON',
  'WEAPON_TXT': '武器',
  '盾：': 'SHIELD',
  '盾牌：': 'SHIELD',
  '盾:': 'SHIELD',
  '盾牌:': 'SHIELD',
  'SHIELD_TXT': '盾牌'
}

const TRANS_STATUS = {
  'SALE': '物品出售中',
  'LOCK': '交易锁定',
  'REQUEST': '交易待确认',
  'SUCCESS': '交易完成'
}
module.exports = {
  PROP, CATEGORY, TRANS_STATUS
}
