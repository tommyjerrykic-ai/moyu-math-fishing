/* Pure game rules shared by the browser and the verification script. */
(function (root) {
  'use strict';
  const RARITIES = [
    { id: 'N', weight: 55, label: '普通', color: '#687d73' },
    { id: 'R', weight: 28, label: '少見', color: '#2582b2' },
    { id: 'SR', weight: 12, label: '稀有', color: '#8d55bd' },
    { id: 'SSR', weight: 5, label: '超稀有', color: '#bf811a' },
    { id: 'SP', weight: 0, label: '特別', color: '#d45278' }
  ];
  const FISH = [
    { id: 'bean', rarity: 'N', name: '豆豆鯽', colors: ['#8fbbaf','#dcebc3'], style: 'bean', description: '腦袋小小的，煩惱也是。', min: 8, max: 18 },
    { id: 'worker', rarity: 'N', name: '打工鯉', colors: ['#e7a864','#ffe1aa'], style: 'worker', description: '準時上鈎，準時下班。', min: 15, max: 35 },
    { id: 'puffer', rarity: 'R', name: '蛋黃河豚', colors: ['#edc44b','#fff1b0'], style: 'puffer', description: '氣鼓鼓的，但不是在生你的氣。', min: 10, max: 24 },
    { id: 'slipper', rarity: 'R', name: '拖鞋泥鰍', colors: ['#b591cb','#ead8ea'], style: 'slipper', description: '看起來很好穿。請勿試穿。', min: 18, max: 40 },
    { id: 'melon', rarity: 'SR', name: '西瓜鱸魚', colors: ['#68b77b','#f2aca6'], style: 'melon', description: '夏天限定？不，牠全年都很清甜。', min: 20, max: 48 },
    { id: 'lantern', rarity: 'SR', name: '加班燈籠魚', colors: ['#627baf','#becce7'], style: 'lantern', description: '自備枱燈，拒絕摸黑。', min: 16, max: 32 },
    { id: 'galaxy', rarity: 'SSR', name: '銀河錦鯉', colors: ['#8874c8','#d9c9ff'], style: 'galaxy', description: '身上的星星，比你的鬧鐘還多。', min: 30, max: 65 },
    { id: 'crown', rarity: 'SSR', name: '皇冠鬥魚', colors: ['#de866e','#ffd7b0'], style: 'crown', description: '池塘沒有國王，牠自己選自己。', min: 18, max: 36 },
    { id: 'dragon', rarity: 'SSR', name: '龍王摸魚', colors: ['#55aaa5','#bce7cb'], style: 'dragon', description: '龍宮今日公休，龍王出來透透氣。', min: 50, max: 99 },
    { id: 'cosmic', rarity: 'SSR', name: '宇宙鹹魚', colors: ['#eb9fb4','#f9e3f0'], style: 'cosmic', description: '夢想很遠大，姿勢很平躺。', min: 25, max: 55 }
  ];
  FISH.forEach(f=>f.location='pond');
  FISH.push(
    {id:'sand-sardine',rarity:'N',name:'黑沙沙丁魚',colors:['#77848b','#eef1d8'],style:'bean',description:'出門必戴黑沙帽，風大也不肯脫。',min:9,max:20,location:'beach'},
    {id:'flip-flounder',rarity:'N',name:'人字拖比目魚',colors:['#d7b875','#65b9dc'],style:'slipper',description:'左腳還是右腳？牠說自己是兩用款。',min:12,max:28,location:'beach'},
    {id:'sleepy-mackerel',rarity:'N',name:'發呆竹莢魚',colors:['#7eb5a7','#d9ebba'],style:'bean',description:'本來想游去上學，結果忘了今天星期幾。',min:10,max:26,location:'beach'},
    {id:'tart-puffer',rarity:'R',name:'葡撻雞泡魚',colors:['#efba53','#fff0bd'],style:'puffer',description:'外脆內軟只是外表，咬一口會被牠投訴。',min:12,max:25,location:'beach'},
    {id:'cool-mullet',rarity:'R',name:'墨鏡烏頭',colors:['#839aaa','#d8e6e1'],style:'worker',description:'太陽下山也不摘墨鏡，因為帥不能下班。',min:20,max:45,location:'beach'},
    {id:'lazy-mackerel',rarity:'R',name:'躺平馬鮫魚',colors:['#4c95b7','#c2e6da'],style:'worker',description:'自備枕頭來海灘，釣上來也不願起床。',min:25,max:58,location:'beach'},
    {id:'bun-grouper',rarity:'SR',name:'菠蘿包石斑',colors:['#d9973e','#f4db9e'],style:'puffer',description:'頭頂那塊牛油，是牠的防水髮蠟。',min:22,max:48,location:'beach'},
    {id:'float-flyingfish',rarity:'SR',name:'泳圈飛魚',colors:['#63b5c7','#f2b1c8'],style:'bean',description:'會飛也要戴泳圈，安全意識滿分。',min:18,max:38,location:'beach'},
    {id:'shumai-lionfish',rarity:'SSR',name:'燒賣獅子魚',colors:['#dd855c','#f7cc7d'],style:'crown',description:'點心車還未到，牠已經排好第一位。',min:22,max:42,location:'beach'},
    {id:'surf-ribbonfish',rarity:'SSR',name:'衝浪皇帶魚',colors:['#a69bd1','#e1d8f1'],style:'galaxy',description:'身體太長，只好自己當安全繩。',min:60,max:150,location:'beach'}
  );
  FISH.push(
    {id:'inspiration-doll',rarity:'SP',kind:'doll',name:'郭sir娃娃',colors:['#555968','#b9d6ef'],style:'bean',description:'如果唔識做呢題，捉你入保底班坐三年。',min:22,max:32,location:'classroom'},
    {id:'pen-doll',rarity:'SP',kind:'doll',name:'陳sir娃娃',colors:['#505767','#78a6d9'],style:'bean',description:'等你釣起我，但你釣得起我咩。',min:23,max:34,location:'classroom'},
    {id:'glasses-doll',rarity:'SP',kind:'doll',name:'曾sir娃娃',colors:['#56515d','#9dbfe5'],style:'bean',description:'又嬲，秒！',min:21,max:33,location:'classroom'}
  );
  FISH.push(...[
  {
    "id": "leafcap-carp",
    "name": "荷葉小帽魚",
    "rarity": "N",
    "baseRate": 70,
    "description": "出門不帶傘，因為帽子就是一把小傘。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 8,
    "max": 24
  },
  {
    "id": "riceball-crucian",
    "name": "飯糰小鯽",
    "rarity": "N",
    "baseRate": 68,
    "description": "肚子像飯糰，最怕被當成午餐。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 10,
    "max": 27
  },
  {
    "id": "milktea-carp",
    "name": "奶茶鯉",
    "rarity": "N",
    "baseRate": 66,
    "description": "珍珠不是配料，是牠的天然斑點。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 12,
    "max": 30
  },
  {
    "id": "nap-silvercarp",
    "name": "瞌睡小鰱",
    "rarity": "N",
    "baseRate": 63,
    "description": "眼睛閉著也會游，方向就不一定了。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 14,
    "max": 33
  },
  {
    "id": "backpack-carp",
    "name": "書包青魚",
    "rarity": "N",
    "baseRate": 61,
    "description": "書包裡沒有課本，只有一包魚糧。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 8,
    "max": 24
  },
  {
    "id": "friedegg-bream",
    "name": "煎蛋小鯿",
    "rarity": "N",
    "baseRate": 58,
    "description": "每天都很有精神，可能是半熟的關係。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 10,
    "max": 27
  },
  {
    "id": "rainboot-catfish",
    "name": "雨靴鯰魚",
    "rarity": "N",
    "baseRate": 56,
    "description": "明明住在水裡，卻堅持穿雨靴。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 12,
    "max": 30
  },
  {
    "id": "edamame-carp",
    "name": "毛豆小鯉",
    "rarity": "N",
    "baseRate": 54,
    "description": "全身綠油油，還以為自己是蔬菜。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 14,
    "max": 33
  },
  {
    "id": "lotusroot-bubble",
    "name": "蓮藕泡泡魚",
    "rarity": "R",
    "baseRate": 47,
    "description": "身上的洞洞，是專門用來裝煩惱的。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 16,
    "max": 44
  },
  {
    "id": "pudding-puffer",
    "name": "布丁河豚",
    "rarity": "R",
    "baseRate": 45,
    "description": "一緊張就變圓，焦糖也跟著抖三抖。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 18,
    "max": 47
  },
  {
    "id": "scarf-trout",
    "name": "圍巾鱒魚",
    "rarity": "R",
    "baseRate": 43,
    "description": "水溫二十八度，牠還是怕著涼。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 20,
    "max": 50
  },
  {
    "id": "mochi-carp",
    "name": "麻糬白鯉",
    "rarity": "R",
    "baseRate": 41,
    "description": "看起來軟綿綿，游起來卻很有彈性。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 22,
    "max": 53
  },
  {
    "id": "teapot-catfish",
    "name": "茶壺胖鯰",
    "rarity": "R",
    "baseRate": 39,
    "description": "嘴巴一嘟，彷彿準備請你喝茶。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 16,
    "max": 44
  },
  {
    "id": "detective-bass",
    "name": "偵探鱸魚",
    "rarity": "R",
    "baseRate": 37,
    "description": "池塘的魚糧失蹤案，嫌疑魚就是自己。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 18,
    "max": 47
  },
  {
    "id": "bamboo-eel",
    "name": "竹筒小鱔",
    "rarity": "R",
    "baseRate": 35,
    "description": "假裝是一截竹子，結果還是忍不住打哈欠。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 20,
    "max": 50
  },
  {
    "id": "sakura-koi",
    "name": "櫻花錦鯉",
    "rarity": "SR",
    "baseRate": 29,
    "description": "游過的地方，都像下了一場小小花雨。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 30,
    "max": 73
  },
  {
    "id": "moon-goodnight",
    "name": "月亮晚安魚",
    "rarity": "SR",
    "baseRate": 25,
    "description": "專程來提醒你，做完這題就早點睡。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 24,
    "max": 64
  },
  {
    "id": "wizard-broomfish",
    "name": "魔法掃把魚",
    "rarity": "SR",
    "baseRate": 21,
    "description": "想騎掃把飛走，卻忘了自己在水裡。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 26,
    "max": 67
  },
  {
    "id": "cotton-cloudfish",
    "name": "雲朵棉花魚",
    "rarity": "SR",
    "baseRate": 17,
    "description": "腦袋像棉花糖，連煩惱都是蓬鬆的。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 28,
    "max": 70
  },
  {
    "id": "lucky-ingotfish",
    "name": "如意金元寶",
    "rarity": "SSR",
    "baseRate": 10,
    "description": "不會帶來財富，但會帶來一整天的好心情。",
    "location": "pond",
    "colors": [
      "#79ad92",
      "#e4eab9"
    ],
    "style": "bean",
    "min": 44,
    "max": 107
  },
  {
    "id": "crispy-sardine",
    "name": "鹽酥小沙丁",
    "rarity": "N",
    "baseRate": 69,
    "description": "只是長得酥脆，請不要加辣粉。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 8,
    "max": 24
  },
  {
    "id": "sandcastle-bream",
    "name": "沙堡小鯛",
    "rarity": "N",
    "baseRate": 67,
    "description": "海浪一來就緊張，因為髮型很難重砌。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 10,
    "max": 27
  },
  {
    "id": "sushi-rollfish",
    "name": "海苔飯卷魚",
    "rarity": "N",
    "baseRate": 62,
    "description": "捲得整整齊齊，游泳卻總是歪歪斜斜。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 12,
    "max": 30
  },
  {
    "id": "lemon-sourfish",
    "name": "檸檬酸酸魚",
    "rarity": "N",
    "baseRate": 57,
    "description": "不是不開心，只是天生表情有點酸。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 14,
    "max": 33
  },
  {
    "id": "pajama-stripefish",
    "name": "條紋睡衣魚",
    "rarity": "N",
    "baseRate": 53,
    "description": "從起床到睡覺，都穿著同一套睡衣。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 8,
    "max": 24
  },
  {
    "id": "corn-cod",
    "name": "玉米鬚小鱈",
    "rarity": "N",
    "baseRate": 51,
    "description": "鬍鬚整理得很好，因為每天都在梳粟米。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 10,
    "max": 27
  },
  {
    "id": "goggle-butterflyfish",
    "name": "泳鏡蝴蝶魚",
    "rarity": "R",
    "baseRate": 46,
    "description": "戴上泳鏡後，終於發現自己一直在水裡。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 20,
    "max": 50
  },
  {
    "id": "pizza-stingray",
    "name": "披薩魟魚",
    "rarity": "R",
    "baseRate": 42,
    "description": "芝士拉絲般的尾巴，差點把自己纏住。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 22,
    "max": 53
  },
  {
    "id": "lifeguard-shark",
    "name": "救生員鯊魚",
    "rarity": "R",
    "baseRate": 34,
    "description": "負責救生，卻經常忘記帶自己的泳圈。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 16,
    "max": 44
  },
  {
    "id": "coconut-vacationfish",
    "name": "椰子度假魚",
    "rarity": "R",
    "baseRate": 33,
    "description": "來海灘只做三件事：放空、放空、再放空。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 18,
    "max": 47
  },
  {
    "id": "scallop-clownfish",
    "name": "扇貝小丑魚",
    "rarity": "R",
    "baseRate": 31,
    "description": "尾巴一打開，就像準備上台謝幕。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 20,
    "max": 50
  },
  {
    "id": "firework-lionfish",
    "name": "煙花獅子魚",
    "rarity": "SR",
    "baseRate": 27,
    "description": "身上很熱鬧，性格卻相當安靜。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 30,
    "max": 73
  },
  {
    "id": "pearl-bubblefish",
    "name": "珍珠泡泡魚",
    "rarity": "SR",
    "baseRate": 23,
    "description": "每次吹泡泡，都覺得自己在開珠寶展。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 24,
    "max": 64
  },
  {
    "id": "aurora-flyingfish",
    "name": "極光飛魚",
    "rarity": "SR",
    "baseRate": 22,
    "description": "把整片晚霞穿在身上，出門從不怕撞色。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 26,
    "max": 67
  },
  {
    "id": "neon-electric-eel",
    "name": "霓虹電鰻",
    "rarity": "SR",
    "baseRate": 19,
    "description": "自帶招牌燈光，卻從來不收電費。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 28,
    "max": 70
  },
  {
    "id": "neptune-tridentfish",
    "name": "海王三叉魚",
    "rarity": "SSR",
    "baseRate": 7,
    "description": "三叉戟只是裝飾，真正的武器是可愛。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 44,
    "max": 107
  },
  {
    "id": "wish-sunfish",
    "name": "星願翻車魚",
    "rarity": "SSR",
    "baseRate": 5,
    "description": "每顆星星都是願望，最大的願望是再睡五分鐘。",
    "location": "beach",
    "colors": [
      "#66a9b9",
      "#e7dfbb"
    ],
    "style": "bean",
    "min": 38,
    "max": 98
  }
]);
  FISH.push(...[
  {
    "id": "magikarp",
    "name": "鯉魚王",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "pond",
    "baseRate": 13,
    "min": 30,
    "max": 75,
    "description": "濺起的水花很有氣勢，傷害就交給想像。",
    "colors": [
      "#e79452",
      "#f4e5b0"
    ],
    "style": "bean"
  },
  {
    "id": "gyarados",
    "name": "暴鯉龍",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "pond",
    "baseRate": 3,
    "min": 120,
    "max": 260,
    "description": "看起來很兇，其實只是等不到下課。",
    "colors": [
      "#438bc2",
      "#f0d7a8"
    ],
    "style": "dragon"
  },
  {
    "id": "seaking",
    "name": "金魚王",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "pond",
    "baseRate": 8,
    "min": 50,
    "max": 95,
    "description": "頭頂的角不是筆，請勿拿來寫功課。",
    "colors": [
      "#e78b55",
      "#f1eee5"
    ],
    "style": "bean"
  },
  {
    "id": "psyduck",
    "name": "可達鴨",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "pond",
    "baseRate": 15,
    "min": 35,
    "max": 65,
    "description": "題目還未看完，頭已經開始痛。",
    "colors": [
      "#e8ca54",
      "#f6e2a7"
    ],
    "style": "bean"
  },
  {
    "id": "poliwag",
    "name": "蚊香蝌蚪",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "pond",
    "baseRate": 6,
    "min": 12,
    "max": 28,
    "description": "肚上的螺旋不是答案，只是看起來很有道理。",
    "colors": [
      "#5497cc",
      "#f1eee5"
    ],
    "style": "bean"
  },
  {
    "id": "squirtle",
    "name": "傑尼龜",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "beach",
    "baseRate": 4,
    "min": 20,
    "max": 38,
    "description": "龜殼可以擋水花，擋不住突擊小測。",
    "colors": [
      "#79bfdb",
      "#e8d6a8"
    ],
    "style": "bean"
  },
  {
    "id": "seel",
    "name": "小海獅",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "beach",
    "baseRate": 2,
    "min": 45,
    "max": 85,
    "description": "一邊拍手，一邊假裝自己聽懂了。",
    "colors": [
      "#ebedf7",
      "#cdd4e8"
    ],
    "style": "bean"
  },
  {
    "id": "staryu",
    "name": "海星星",
    "rarity": "SSR",
    "kind": "pokemon",
    "location": "beach",
    "baseRate": 1,
    "min": 20,
    "max": 45,
    "description": "中間的紅寶石很亮，解題時也想靈光一閃。",
    "colors": [
      "#d0a35e",
      "#f1ca72"
    ],
    "style": "bean"
  }
]);
  const LOCATIONS=[
    {id:'pond',name:'發呆池',number:'01',description:'淡水・全年開放',weights:{N:55,R:28,SR:12,SSR:4.4,SP:.6}},
    {id:'beach',name:'黑沙海灘',number:'02',description:'海水・黑沙海岸',weights:{N:45,R:32,SR:18,SSR:4.4,SP:.6}},
    {id:'classroom',name:'氹坊課室',number:'03',description:'隱藏地點',hidden:true,unlockCompletion:.5,fishable:true,pool:'all',weights:{N:55,R:28,SR:12,SSR:3.4,SP:1.6}}
  ];
  const baseRates=[65,60,52,48,40,36,28,24,16,12,64,59,55,49,44,38,32,26,20,14,50,50,50];
  FISH.forEach((fish,index)=>{fish.baseRate=Math.max(20,baseRates[index]??fish.baseRate);});
  FISH.push(...[
  {
    "id": "kwok-coat",
    "name": "郭sir的外套",
    "description": "郭sir穿了多年的外套，有數學之力的加成",
    "min": 55,
    "max": 75,
    "colors": [
      "#62666b",
      "#b4b5b7"
    ],
    "asset": "sp-kwok-coat-v1.png",
    "rarity": "SP",
    "kind": "item",
    "location": "all",
    "baseRate": 50,
    "oneTime": true,
    "catchBonus": 5,
    "encounterRate": 0.2,
    "style": "bean"
  },
  {
    "id": "chan-rummikub",
    "name": "陳sir的魔力橋",
    "description": "陳sir最中意玩的遊戲，睇大家玩時會陰陰嘴笑",
    "min": 22,
    "max": 32,
    "colors": [
      "#224d48",
      "#fff1ca"
    ],
    "asset": "sp-chan-rummikub-v1.png",
    "rarity": "SP",
    "kind": "item",
    "location": "all",
    "baseRate": 50,
    "oneTime": true,
    "catchBonus": 5,
    "encounterRate": 0.2,
    "style": "bean"
  },
  {
    "id": "tsang-glasses",
    "name": "曾sir的眼鏡",
    "description": "曾sir本體，幫助大家又秒一題",
    "min": 13,
    "max": 16,
    "colors": [
      "#24252b",
      "#83d6d5"
    ],
    "asset": "sp-tsang-glasses-v1.png",
    "rarity": "SP",
    "kind": "item",
    "location": "all",
    "baseRate": 50,
    "oneTime": true,
    "catchBonus": 5,
    "encounterRate": 0.2,
    "style": "bean"
  }
]);
  FISH.push(...[
  {
    "id": "calculator-puffer",
    "name": "計數機河豚",
    "location": "pond",
    "baseRate": 44,
    "min": 12,
    "max": 28,
    "description": "一緊張就按錯掣，計完仲要你驗算。",
    "colors": [
      "#55b9b4",
      "#edf2c6"
    ],
    "rarity": "SR",
    "kind": "fish",
    "style": "bean",
    "asset": "sr-calculator-puffer-v1.png",
    "introducedEdition": 4
  },
  {
    "id": "eraser-crucian",
    "name": "橡皮擦小鯽",
    "location": "pond",
    "baseRate": 43,
    "min": 10,
    "max": 22,
    "description": "錯題擦得走，肚腩擦唔走。",
    "colors": [
      "#f4a4b2",
      "#fff0d0"
    ],
    "rarity": "SR",
    "kind": "fish",
    "style": "bean",
    "asset": "sr-eraser-crucian-v1.png",
    "introducedEdition": 4
  },
  {
    "id": "lotus-afrofish",
    "name": "蓮蓬爆炸魚",
    "location": "pond",
    "baseRate": 40,
    "min": 16,
    "max": 34,
    "description": "吹了三小時頭髮，大家卻以為牠剛睡醒。",
    "colors": [
      "#9abc55",
      "#dcefc3"
    ],
    "rarity": "SR",
    "kind": "fish",
    "style": "bean",
    "asset": "sr-lotus-afrofish-v1.png",
    "introducedEdition": 4
  },
  {
    "id": "shell-telephonefish",
    "name": "貝殼電話魚",
    "location": "beach",
    "baseRate": 39,
    "min": 20,
    "max": 42,
    "description": "喂？水底收唔收到？我仲未講完呀！",
    "colors": [
      "#ed91a0",
      "#bce5db"
    ],
    "rarity": "SR",
    "kind": "fish",
    "style": "bean",
    "asset": "sr-shell-telephonefish-v1.png",
    "introducedEdition": 4
  },
  {
    "id": "fries-cod",
    "name": "薯條鱈魚",
    "location": "beach",
    "baseRate": 38,
    "min": 18,
    "max": 38,
    "description": "薯條可以分你，最後一條一定要留畀我。",
    "colors": [
      "#e9b84c",
      "#db655a"
    ],
    "rarity": "SR",
    "kind": "fish",
    "style": "bean",
    "asset": "sr-fries-cod-v1.png",
    "introducedEdition": 4
  }
]);
  const DOLL_IDS=['inspiration-doll','pen-doll','glasses-doll'];
  DOLL_IDS.forEach(id=>Object.assign(FISH.find(f=>f.id===id),{oneTime:true,catchBonus:5}));
  function ownsCollectible(collection,id){return Number.isSafeInteger(collection[id]?.count)&&collection[id].count>0;}
  function dollBonus(collection={}){return DOLL_IDS.filter(id=>ownsCollectible(collection,id)).length*5;}
  function catchBonus(collection={}){return FISH.filter(f=>f.catchBonus&&ownsCollectible(collection,f.id)).reduce((sum,f)=>sum+f.catchBonus,0);}
  function effectiveBaseRate(fish,collection={}){return Math.min(100,Math.max(20,fish?.baseRate??60)+catchBonus(collection));}
  function canCatch(fish,collection={}){return !!fish&&(!fish.oneTime||!ownsCollectible(collection,fish.id));}
  function collectionCompletion(collection={}) {
    return FISH.length?FISH.filter(f=>Number.isSafeInteger(collection[f.id]?.count)&&collection[f.id].count>0).length/FISH.length:0;
  }
  function isLocationUnlocked(id,collection={},unlockedLocations=[]) {
    const location=LOCATIONS.find(l=>l.id===id);
    return !!location&&(!location.hidden||unlockedLocations.includes(id)||collectionCompletion(collection)>location.unlockCompletion);
  }
  function catchRate(correct, elapsedSeconds, fish, collection={}) {
    if (!correct) return 0;
    const base=effectiveBaseRate(fish,collection);
    return Math.min(1,(base + Math.max(0,30-Math.floor(Math.max(0,elapsedSeconds)))) / 100);
  }
  function biteTiming(random = Math.random) {
    const start = 950 + Math.floor(random() * 2051);
    return { start, end: start + 2000 };
  }
  function bitePhase(elapsed, timing) {
    return elapsed < timing.start ? 'waiting' : elapsed < timing.end ? 'bite' : 'missed';
  }
  function duckPose(seconds, compact=false){
    const t=Math.max(0,seconds),angle=t*.07;
    return {x:235+(compact?70:125)*Math.sin(angle),y:172+5*Math.sin(t*.043+.7),heading:Math.cos(angle)>=0?1:-1,rock:Math.sin(t*1.8)*.018};
  }
  function crabPose(seconds, compact=false){
    const t=Math.max(0,seconds),cycle=t%36,wave=(t*.27)%1;
    const ease=n=>{n=Math.max(0,Math.min(1,n));return n*n*(3-2*n);};
    // Three shore wavelets share this rhythm. Scuttle inland before the next crest.
    const retreat=wave<.16?1:wave<.70?1-ease((wave-.16)/.54):ease((wave-.70)/.20);
    const burrow=cycle>=28&&cycle<34?Math.min(ease((cycle-28)/.8),ease((34-cycle)/.8)):0;
    const fleeing=wave>.70||wave<.16,waving=cycle>=14&&cycle<17&&!fleeing;
    return {x:(compact?311:345)+(compact?7:23)*Math.sin(t*.25),y:339+retreat*15,
      frame:waving||fleeing?2:Math.floor(t*3)%2,burrow,
      bounce:burrow?0:Math.sin(t*(fleeing?22:9))*(fleeing?1:.4),
      heading:Math.cos(t*.25)>=0?1:-1,state:burrow>.9?'buried':burrow>0?'digging':fleeing?'fleeing':waving?'waving':'walking'};
  }
  // Shared choreography, in scene coordinates. The cast lands before the bite window opens.
  function rodTip(hand,tip){return [hand[0]+(tip[0]-hand[0])*1.2,hand[1]+(tip[1]-hand[1])*1.2];}
  function fishingTarget(location='pond',compact=false){return location==='classroom'?[compact?280:310,compact?205:210]:[compact?304:342,262];}
  function actionPose(type, progress, compact=false, location='pond') {
    const p=Math.max(0,Math.min(1,progress)),[bobberX,bobberY]=fishingTarget(location,compact);
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
    const mix=(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*ease(t));
    const hand0=[276,296],tip0=[compact?298:332,209];
    let hand=hand0,tip=tip0,lure=[bobberX,bobberY],frame=-1,frame2=-1,blend=0,tilt=0,splash=0;
    if(type==='cast'){
      hand=p<.3?mix(hand0,[268,259],p/.3):p<.62?mix([268,259],[290,280],(p-.3)/.32):mix([290,280],hand0,(p-.62)/.38);
      tip=p<.3?mix([compact?292:316,195],[225,174],p/.3):p<.62?mix([225,174],[compact?322:360,210],(p-.3)/.32):mix([compact?322:360,210],tip0,(p-.62)/.38);
      const fly=Math.max(0,Math.min(1,(p-.3)/.65));lure=[267+(bobberX-267)*fly,211+(bobberY-211)*fly-76*Math.sin(Math.PI*fly)];
      if(p<.14){frame=-1;frame2=0;blend=ease(p/.14);}else if(p<.32)frame=0;else if(p<.45){frame=0;frame2=1;blend=ease((p-.32)/.13);}else if(p<.8)frame=1;else{frame=1;frame2=-1;blend=ease((p-.8)/.2);}
      tilt=-.045*Math.sin(p*Math.PI*2);splash=progress>=.94&&progress<1.45?(progress-.94)/.51:0;
    }else if(type==='hook'){
      const pull=p<.45?p/.45:1-(p-.45)/.55;hand=mix(hand0,[265,272],pull);tip=mix(tip0,[282,164],pull);lure=mix([bobberX,bobberY],[bobberX-7,bobberY-16],pull);
      if(p<.12){frame=-1;frame2=2;blend=ease(p/.12);}else if(p<.6)frame=2;else{frame=2;frame2=-1;blend=ease((p-.6)/.4);}tilt=-.055*Math.sin(p*Math.PI);
    }else if(type==='reel'){
      const pull=ease(Math.min(1,p/.3));hand=p<.38?mix(hand0,[265,272],pull):mix([265,272],[274,289],(p-.38)/.18);tip=p<.38?mix(tip0,[compact?286:303,165],pull):mix([compact?286:303,165],[compact?298:322,187],(p-.38)/.18);lure=mix([bobberX,bobberY],[bobberX-26,bobberY-72],p);
      if(p<.12){frame=-1;frame2=2;blend=ease(p/.12);}else if(p<.38)frame=2;else if(p<.5){frame=2;frame2=3;blend=ease((p-.38)/.12);}else frame=3;
      hand[1]+=Math.sin(p*Math.PI*8)*1.5;tilt=-.025*pull+Math.sin(p*Math.PI*6)*.009;
    }
    if(progress>=1){frame=-1;frame2=-1;blend=0;tilt=0;}
    return {hand,tip,lure,frame,frame2,blend,tilt,splash};
  }
  function fishPool(location='pond') {
    const spot=LOCATIONS.find(l=>l.id===location);
    if(!spot||spot.fishable===false)return [];
    return spot.pool==='all'?FISH.slice():FISH.filter(f=>f.location===spot.id||f.location==='all');
  }
  function encounterPool(location='pond',collection={}){return fishPool(location).filter(f=>canCatch(f,collection));}
  function encounterWeights(location='pond',collection={}){
    const spot=LOCATIONS.find(l=>l.id===location);if(!spot)return {};
    const weights={...spot.weights};
    const pool=encounterPool(location,collection);
    weights.SP=pool.filter(f=>f.kind==='item').reduce((sum,f)=>sum+f.encounterRate,0)+(location==='classroom'&&pool.some(f=>f.kind==='doll')?1:0);
    weights.SSR=Number((100-weights.N-weights.R-weights.SR-weights.SP).toFixed(10));
    return weights;
  }
  function speciesWeight(fish,spot,pool){
    if(fish.kind==='item')return fish.encounterRate;
    if(spot.id==='classroom'&&fish.kind==='doll')return 1/pool.filter(f=>f.kind==='doll').length;
    return 1;
  }
  // Owned dolls leave the encounter pool; the remaining dolls share a fixed 1%.
  function encounterChance(id,location='pond',collection={}){
    const spot=LOCATIONS.find(l=>l.id===location),pool=encounterPool(location,collection),fish=pool.find(f=>f.id===id);
    if(!spot||!fish)return 0;
    const candidates=pool.filter(f=>f.rarity===fish.rarity),total=candidates.reduce((sum,f)=>sum+speciesWeight(f,spot,pool),0);
    return total?(encounterWeights(location,collection)[fish.rarity]||0)*speciesWeight(fish,spot,pool)/total:0;
  }
  function chooseFish(random=Math.random,location='pond',collection={}){
    const spot=LOCATIONS.find(l=>l.id===location)||LOCATIONS[0],pool=encounterPool(spot.id,collection),weights=encounterWeights(spot.id,collection);
    const rarities=RARITIES.filter(r=>weights[r.id]>0&&pool.some(f=>f.rarity===r.id));
    if(!rarities.length)return null;
    let roll=random()*rarities.reduce((sum,r)=>sum+weights[r.id],0);
    const rarity=rarities.find(r=>(roll-=weights[r.id])<0)||rarities.at(-1),candidates=pool.filter(f=>f.rarity===rarity.id);
    let speciesRoll=random()*candidates.reduce((sum,f)=>sum+speciesWeight(f,spot,pool),0);
    return candidates.find(f=>(speciesRoll-=speciesWeight(f,spot,pool))<0)||candidates.at(-1);
  }
  // Small arithmetic parser: accepts decimals, fractions and radicals without executing code.
  function parseAnswer(raw) {
    const source = String(raw).replace(/[！-～]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0)).replace(/[−–]/g, '-').replace(/[×]/g, '*').replace(/[÷]/g, '/').replace(/\s/g, '').replace(/sqrt/gi, '√');
    if (!source || source.length > 64 || /[^\d.+\-*/()√]/.test(source)) return null;
    let p = 0;
    function atom() {
      if (source[p] === '+') { p++; return atom(); }
      if (source[p] === '-') { p++; return -atom(); }
      if (source[p] === '√') { p++; const n = atom(); if (n < 0) throw Error(); return Math.sqrt(n); }
      if (source[p] === '(') { p++; const value = expression(); if (source[p++] !== ')') throw Error(); return value; }
      const match = source.slice(p).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (!match) throw Error();
      p += match[0].length; return Number(match[0]);
    }
    function product() { let n = atom(); while (source[p] === '*' || source[p] === '/') { const op = source[p++], rhs = atom(); n = op === '*' ? n * rhs : n / rhs; } return n; }
    function expression() { let n = product(); while (source[p] === '+' || source[p] === '-') { const op = source[p++], rhs = product(); n = op === '+' ? n + rhs : n - rhs; } return n; }
    try { const value = expression(); return p === source.length && Number.isFinite(value) ? value : null; } catch { return null; }
  }
  const api = { DOLL_IDS, dollBonus, catchBonus, effectiveBaseRate, canCatch, encounterPool, encounterWeights, RARITIES, FISH, LOCATIONS, collectionCompletion, isLocationUnlocked, catchRate, biteTiming, bitePhase, duckPose, crabPose, rodTip, fishingTarget, actionPose, fishPool, encounterChance, chooseFish, parseAnswer };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.FishingCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
