import type { Spell } from "./spells";
// PHB 2024 职业目录与摘要独立于自动获得来源；三级不开放更高环阶。
export const DRUID_SPELL_IDS: string[] = ["druidcraft", "elementalism", "guidance", "mending", "message", "poison-spray", "produce-flame", "resistance", "shillelagh", "spare-the-dying", "starry-wisp", "thorn-whip", "thunderclap", "animal-friendship", "charm-person", "create-or-destroy-water", "cure-wounds", "detect-magic", "detect-poison-and-disease", "entangle", "faerie-fire", "fog-cloud", "goodberry", "healing-word", "ice-knife", "jump", "longstrider", "protection-from-evil-and-good", "purify-food-and-drink", "speak-with-animals", "thunderwave", "aid", "animal-messenger", "augury", "barkskin", "beast-sense", "continual-flame", "darkvision", "enhance-ability", "enlarge/reduce", "find-traps", "flame-blade", "flaming-sphere", "gust-of-wind", "heat-metal", "hold-person", "lesser-restoration", "locate-animals-or-plants", "locate-object", "moonbeam", "pass-without-trace", "protection-from-poison", "spike-growth", "summon-beast"];
export const WARLOCK_SPELL_IDS: string[] = ["blade-ward", "chill-touch", "eldritch-blast", "friends", "mage-hand", "mind-sliver", "minor-illusion", "poison-spray", "prestidigitation", "thunderclap", "toll-the-dead", "true-strike", "armor-of-agathys", "arms-of-hadar", "bane", "charm-person", "comprehend-languages", "detect-magic", "expeditious-retreat", "hellish-rebuke", "hex", "illusory-script", "protection-from-evil-and-good", "speak-with-animals", "tashas-hideous-laughter", "unseen-servant", "witch-bolt", "cloud-of-daggers", "crown-of-madness", "darkness", "enthrall", "hold-person", "invisibility", "mind-spike", "mirror-image", "misty-step", "ray-of-enfeeblement", "spider-climb", "suggestion"];
export const RANGER_SPELL_IDS: string[] = ["alarm", "animal-friendship", "cure-wounds", "detect-magic", "detect-poison-and-disease", "ensnaring-strike", "entangle", "fog-cloud", "goodberry", "hail-of-thorns", "hunters-mark", "jump", "longstrider", "speak-with-animals"];
export const PRIMAL_EXTRA_SPELLS: Spell[] = [
  {
    "id": "arms-of-hadar",
    "name": "哈达之臂",
    "level": 1,
    "school": "咒法",
    "time": "动作",
    "range": "自身",
    "components": "V、S",
    "duration": "立即",
    "text": "你周围 10 尺光环内每名其他生物作力量豁免；失败受 2d6 暗蚀伤害且至其下回合不能反应，成功半伤。会波及盟友；二环伤害 3d6。"
  },
  {
    "id": "dissonant-whispers",
    "name": "不谐低语",
    "level": 1,
    "school": "惑控",
    "time": "动作",
    "range": "60尺",
    "components": "V",
    "duration": "立即",
    "text": "60 尺内可见目标作感知豁免；失败受 3d6 心灵伤害，并立即用可用反应沿安全路线尽量远离你，成功只受半伤。二环伤害 4d6。"
  },
  {
    "id": "hail-of-thorns",
    "name": "荆棘之雨",
    "level": 1,
    "school": "咒法",
    "time": "附赠动作：远程武器命中生物后立即施展",
    "range": "自身",
    "components": "V",
    "duration": "立即",
    "text": "远程武器命中后，目标及其周围 5 尺每名生物作敏捷豁免，失败受 1d10 穿刺伤害，成功半伤。会波及盟友；无需专注，二环伤害 2d10。"
  },
  {
    "id": "aid",
    "name": "援助术",
    "level": 2,
    "school": "防护",
    "time": "动作",
    "range": "30 尺",
    "components": "V、S、M（一小片白布）",
    "duration": "8 小时",
    "text": "选择范围内至多三名生物，持续期间各自当前 HP 与 HP 上限增加 5。不是临时 HP；常驻角色数值不预先计入。"
  },
  {
    "id": "animal-messenger",
    "name": "动物信使",
    "level": 2,
    "school": "惑控",
    "time": "动作",
    "range": "30 尺",
    "components": "V、S、M（一点食物）",
    "duration": "24小时",
    "ritual": true,
    "text": "可见微型野兽魅力豁免失败后替你送信；CR 非零自动成功。说出至多 25 个词，描述你到过的目的地及收件人；一天飞行可走 50 英里，否则 25 英里。到达后模仿声音传话，未及时到达则消息丢失，野兽返回。"
  },
  {
    "id": "barkskin",
    "name": "树肤术",
    "level": 2,
    "school": "变化",
    "time": "附赠动作",
    "range": "触碰",
    "components": "V、S、M（一把树皮）",
    "duration": "1小时",
    "text": "触碰自愿生物；持续期间若其 AC 低于 17，改为 17。不需专注，不与已有 AC 相加，常驻卡不预先计入。"
  },
  {
    "id": "beast-sense",
    "name": "野兽感官",
    "level": 2,
    "school": "预言",
    "time": "动作",
    "range": "触碰",
    "components": "S",
    "duration": "至多一小时",
    "concentration": true,
    "ritual": true,
    "text": "触碰自愿野兽，持续期间可通过其感官感知周围，并受益于它的特殊感官。"
  },
  {
    "id": "calm-emotions",
    "name": "安定心神",
    "level": 2,
    "school": "惑控",
    "time": "动作",
    "range": "60 尺",
    "components": "V、S",
    "duration": "至多 1 分钟",
    "concentration": true,
    "text": "60 尺内选 20 尺半径球，区域内类人生物作魅力豁免。失败后为其选一项：暂时免疫并压制魅惑／恐慌；或对你指定的原敌人态度变冷漠，直到它受伤或看见盟友受伤。法术结束恢复原态度。"
  },
  {
    "id": "enthrall",
    "name": "注目术",
    "level": 2,
    "school": "惑控",
    "time": "动作",
    "range": "60尺",
    "components": "V、S",
    "duration": "至多1分钟",
    "concentration": true,
    "text": "选择范围内可见生物作感知豁免；若你或同伴正在与其战斗则自动成功。失败后持续期间感知（察觉）检定及被动察觉减 10。"
  },
  {
    "id": "find-traps",
    "name": "寻找陷阱",
    "level": 2,
    "school": "预言",
    "time": "动作",
    "range": "120尺",
    "components": "V、S",
    "duration": "立即",
    "text": "感知范围内且在视线范围内的人为陷阱及其危害大类，包括意图造成危害的魔法装置；不揭示具体位置，不侦测自然结构弱点。"
  },
  {
    "id": "flame-blade",
    "name": "火焰刀",
    "level": 2,
    "school": "塑能",
    "time": "附赠动作",
    "range": "自身",
    "components": "V、S、M（一片漆树叶）",
    "duration": "至多10分钟",
    "concentration": true,
    "text": "空手召出火焰刀，以魔法动作作一次近战法术攻击，命中受 3d6 + 施法属性调整值火焰伤害。放手消失，可附赠动作重唤；发出 10 尺明亮与额外 10 尺微光。不是攻击动作，不能套用武器精通。"
  },
  {
    "id": "heat-metal",
    "name": "灼热金属",
    "level": 2,
    "school": "变化",
    "time": "动作",
    "range": "60尺",
    "components": "V、S、M（一片铁片和一团火焰）",
    "duration": "至多1分钟",
    "concentration": true,
    "text": "使可见人造金属物件炽热，与其接触的生物受 2d8 火焰伤害。后续回合物件仍在 60 尺内时，可附赠动作再次造成伤害。持握／穿戴者受伤须体质豁免，失败且能丢下则必须丢下；未丢下者至你的下回合开始，攻击与属性检定有劣势。"
  },
  {
    "id": "locate-animals-or-plants",
    "name": "动植物定位术",
    "level": 2,
    "school": "预言",
    "time": "动作",
    "range": "自身",
    "components": "V、S、M（一块寻血猎犬的皮毛）",
    "duration": "立即",
    "ritual": true,
    "text": "描述一种野兽、植物生物或非魔法植物，得知 5 英里内最近个体的方向与距离。"
  },
  {
    "id": "pass-without-trace",
    "name": "行动无踪",
    "level": 2,
    "school": "防护",
    "time": "动作",
    "range": "自身",
    "components": "V、S、M（槲寄生烧成的灰烬）",
    "duration": "至多1小时",
    "concentration": true,
    "text": "持续期间，你和你选择的生物在你周围 30 尺光环内时，敏捷（隐匿）检定 +10，且不留下踪迹；不会自动隐形。"
  },
  {
    "id": "protection-from-poison",
    "name": "防护毒素",
    "level": 2,
    "school": "防护",
    "time": "动作",
    "range": "触碰",
    "components": "V、S",
    "duration": "1小时",
    "text": "触碰生物，结束其中毒状态；持续期间获得毒素伤害抗性，对避免或结束中毒状态的豁免有优势。"
  },
  {
    "id": "summon-beast",
    "name": "野兽召唤术",
    "level": 2,
    "school": "咒法",
    "time": "动作",
    "range": "90 尺",
    "components": "V, S, M（一根羽毛、一簇毛皮和一条装在镀金橡果内的鱼尾、价值至少200GP）",
    "duration": "至多1小时",
    "concentration": true,
    "text": "召出天空、大地或海洋野兽灵魄，出现在 90 尺内可见空位；使用附页数据。与你同先攻，在你回合后立即行动；口头指令不耗动作，未指挥则回避并远离危险。0 HP 或法术结束时消失。200 GP 材料不可用法器替代，起始包不提供。"
  }
];
