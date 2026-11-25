'use strict';
// かんたん晩ごはん v2 追加データ＆共通ロジック
// 子供向け時短レシピ20品（構造化された材料）＋ ジャンル・集計・週間献立の純粋関数群。
// 材料は { n: 名前, q: 数量(数値|null), u: 単位 } 形式。q が null のときは u が「少々」「適量」などの表示。

const GENRES = [
  { id: 'don', label: '丼・ご飯' },
  { id: 'niku', label: '肉・豆腐のおかず' },
  { id: 'sakana', label: '魚のおかず' },
  { id: 'men', label: '麺' },
  { id: 'nabe', label: '鍋・スープ' },
];

// 既存22品のジャンル割り当て
const GENRE_OF = {
  oyakodon: 'don', chahan: 'don', soboro: 'don', 'shirasu-chahan': 'don', 'sake-onigiri': 'don',
  shogayaki: 'niku', mabodofu: 'niku', teriyaki: 'niku', 'buta-daikon': 'niku',
  'tofu-champuru': 'niku', 'tofu-tsukune': 'niku', 'mini-hamburg': 'niku', 'kabocha-soboro': 'niku',
  'sake-mushi': 'sakana', 'saba-curry': 'sakana',
  yakisoba: 'men', 'niku-udon': 'men', 'napolitan-udon': 'men', 'yaki-udon': 'men', 'tamago-udon': 'men',
  stew: 'nabe', zosui: 'nabe',
};

// 既存22品のうち「包丁不要」「洗い物少なめ」に当たるもの
const FLAGS_OF = {
  'shirasu-chahan': { noKnife: true },
  'sake-onigiri': { noKnife: true },
  zosui: { fewDishes: true },
  stew: { fewDishes: true },
  'tamago-udon': { fewDishes: true },
};

function genreOf(r) {
  return r.genre || GENRE_OF[r.id] || 'niku';
}
function flagsOf(r) {
  if (typeof r.noKnife === 'boolean' || typeof r.fewDishes === 'boolean') {
    return { noKnife: !!r.noKnife, fewDishes: !!r.fewDishes };
  }
  return FLAGS_OF[r.id] || { noKnife: false, fewDishes: false };
}

// 簡単な副菜・汁物の候補（週間献立の添え物）
const SIDE_DISHES = [
  '冷奴（ポン酢）', 'きゅうりの浅漬け', 'ミニトマトのサラダ', 'もやしナムル',
  '豆腐とわかめの味噌汁', 'たまごスープ', 'ブロッコリーのごま和え', 'コールスローサラダ',
  'ほうれん草のおひたし', 'キャベツの塩昆布和え',
];

// 買い物リストの分類
const ING_CATEGORY = {
  '鶏もも肉': '肉・魚', '鶏ひき肉': '肉・魚', '豚こま肉': '肉・魚', '豚バラ肉': '肉・魚', '豚ひき肉': '肉・魚',
  '生鮭': '肉・魚', '骨なしタラ': '肉・魚', '鮭': '肉・魚', '合いびき肉': '肉・魚', 'ベーコン': '肉・魚', 'ちくわ': '肉・魚',
  '玉ねぎ': '野菜', 'キャベツ': '野菜', '白菜': '野菜', 'カット野菜': '野菜', 'コーン': '野菜',
  '冷凍ほうれん草': '野菜', '冷凍ミックスベジタブル': '野菜', 'にんじん': '野菜', 'じゃがいも': '野菜', 'ほうれん草': '野菜',
  '卵': '卵・乳・豆腐', '牛乳': '卵・乳・豆腐', 'バター': '卵・乳・豆腐', 'ピザ用チーズ': '卵・乳・豆腐', 'チーズ': '卵・乳・豆腐',
  '木綿豆腐': '卵・乳・豆腐', '絹豆腐': '卵・乳・豆腐', '豆腐': '卵・乳・豆腐',
  'ツナ缶': '缶詰・冷凍', 'サバ水煮缶': '缶詰・冷凍', 'カットトマト缶': '缶詰・冷凍', '鮭フレーク': '缶詰・冷凍',
  '冷凍チキンライス': '缶詰・冷凍', '冷凍うどん': '缶詰・冷凍', '冷凍ご飯': '缶詰・冷凍',
  'ご飯': '主食', 'ごはん': '主食', 'パスタ': '主食', '食パン': '主食', 'うどん': '主食', '焼きそば麺': '主食', '米': '主食',
  'ひき肉': '肉・魚', 'ウインナー': '肉・魚', '大根': '野菜', '冷凍野菜': '野菜', 'さば缶': '缶詰・冷凍', '油': '調味料', 'しょうがチューブ': '調味料',
  'めんつゆ': '調味料', 'しょうゆ': '調味料', '砂糖': '調味料', 'みりん': '調味料', '味噌': '調味料',
  'ケチャップ': '調味料', 'ウスターソース': '調味料', 'ポン酢': '調味料', '白だし': '調味料', 'コンソメ': '調味料',
  '片栗粉': '調味料', '小麦粉': '調味料', 'パン粉': '調味料', 'マヨネーズ': '調味料', '塩': '調味料',
  'サラダ油': '調味料', 'ごま油': '調味料', '酒': '調味料', 'カレールー': '調味料', 'シチュールー': '調味料', '水': 'その他',
};
const SHOP_GROUPS = ['肉・魚', '野菜', '卵・乳・豆腐', '缶詰・冷凍', '主食', '調味料', 'その他', '手動追加'];

function categoryOf(name) {
  if (ING_CATEGORY[name]) return ING_CATEGORY[name];
  const hit = Object.keys(ING_CATEGORY).find((k) => name.indexOf(k) === 0 || k.indexOf(name) === 0);
  return hit ? ING_CATEGORY[hit] : 'その他';
}

// ---- 数量の表示・換算 ----
function fmtNum(q) {
  if (Math.abs(q - Math.round(q)) < 0.01) return String(Math.round(q));
  const frac = q - Math.floor(q);
  const whole = Math.floor(q);
  const fracStr = Math.abs(frac - 0.5) < 0.01 ? '1/2' : Math.abs(frac - 0.25) < 0.01 ? '1/4' : Math.abs(frac - 0.75) < 0.01 ? '3/4' : null;
  if (fracStr) return whole > 0 ? whole + 'と' + fracStr : fracStr;
  return String(Math.round(q * 10) / 10);
}
function fmtQty(q, u) {
  if (q === null || q === undefined) return u || '';
  if (u === '大さじ' || u === '小さじ') return u + fmtNum(q);
  return fmtNum(q) + (u || '');
}
function fmtIng(ing) {
  return ing.n + ' ' + fmtQty(ing.q, ing.u);
}
// 人数変更：3人分を基準に数量を換算する
function scaleQty(q, u, servings) {
  if (q === null || q === undefined) return q;
  const v = (q * servings) / 3;
  if (u === 'g' || u === 'ml') return Math.max(5, Math.round(v / 5) * 5);
  if (u === '大さじ' || u === '小さじ') return Math.max(0.5, Math.round(v * 2) / 2);
  if (u === '個' || u === '枚' || u === '本' || u === '玉' || u === '缶' || u === '切れ' || u === '膳' || u === '丁') {
    return Math.max(0.5, Math.round(v * 2) / 2);
  }
  return Math.round(v * 10) / 10;
}

// 既存レシピの文字列材料（「鶏もも肉 200g」「しょうゆ 大さじ2」「塩 少々」）を構造化する
function parseIngredient(str) {
  const s = String(str).trim();
  let m = s.match(/^(.+?)\s*(大さじ|小さじ)\s*(\d+(?:\.\d+)?)$/);
  if (m) return { n: m[1].trim(), q: parseFloat(m[3]), u: m[2] };
  m = s.match(/^(.+?)\s+(\d+\/\d+|\d+(?:\.\d+)?)\s*(g|ml|個|枚|本|袋|缶|丁|玉|切れ|かけ|膳|カップ|合|cm)?$/);
  if (m) {
    let q = m[2];
    if (q.indexOf('/') >= 0) { const p = q.split('/'); q = parseFloat(p[0]) / parseFloat(p[1]); }
    else q = parseFloat(q);
    return { n: m[1].trim(), q, u: m[3] || '' };
  }
  m = s.match(/^(.+?)\s+(少々|適量|お好みで.*)$/);
  if (m) return { n: m[1].trim(), q: null, u: m[2] };
  return { n: s, q: null, u: '', raw: s };
}

function recipeIngs(r) {
  if (r.ings) return r.ings;
  return (r.ingredients || []).map(parseIngredient);
}

// 複数レシピの材料を合算して買い物リスト項目を作る
function aggregateForRecipes(recipes) {
  const map = new Map();
  recipes.forEach((r) => {
    recipeIngs(r).forEach((ing) => {
      if (ing.q !== null && ing.q !== undefined && ing.u !== undefined) {
        const key = ing.n + '|' + ing.u;
        if (map.has(key)) map.get(key).q += ing.q;
        else map.set(key, { n: ing.n, q: ing.q, u: ing.u });
      } else {
        const key = ing.n + '|raw:' + (ing.raw || ing.u || '');
        if (!map.has(key)) map.set(key, { n: ing.n, q: null, u: ing.u || '', raw: ing.raw });
      }
    });
  });
  const items = [...map.values()].map((e) => ({
    name: e.raw ? e.raw : fmtIng(e),
    group: categoryOf(e.n),
  }));
  items.sort((a, b) => SHOP_GROUPS.indexOf(a.group) - SHOP_GROUPS.indexOf(b.group));
  return items;
}

// 1週間の献立：重複なし、同じ食材の使い回しを優先、ジャンルの連続を避ける
function planWeek(pool, rand) {
  rand = rand || Math.random;
  const chosen = [];
  for (let d = 0; d < 7; d++) {
    const rest = pool.filter((r) => !chosen.includes(r));
    if (rest.length === 0) break;
    let best = null;
    let bestScore = -Infinity;
    rest.forEach((r) => {
      const mains = r.main || [];
      const overlap = mains.filter((m) => chosen.some((c) => (c.main || []).includes(m))).length;
      let score = overlap * 2 + rand() * 2;
      if (d > 0 && genreOf(r) === genreOf(chosen[d - 1])) score -= 1.5;
      if (score > bestScore) { bestScore = score; best = r; }
    });
    chosen.push(best);
  }
  const sides = [];
  let lastSide = -1;
  for (let d = 0; d < 7; d++) {
    let i = Math.floor(rand() * SIDE_DISHES.length);
    if (SIDE_DISHES.length > 1 && i === lastSide) i = (i + 1) % SIDE_DISHES.length;
    lastSide = i;
    sides.push(SIDE_DISHES[i]);
  }
  return { days: chosen.map((r) => r.id), sides };
}

// 献立の1日だけ差し替える候補を選ぶ（使用中・当日以外から）
function pickReplacement(pool, usedIds, rand) {
  rand = rand || Math.random;
  const rest = pool.filter((r) => !usedIds.includes(r.id));
  if (rest.length === 0) return null;
  return rest[Math.floor(rand() * rest.length)];
}

const RECIPES2 = [
  {
    id: 'n-oyakodon', name: '親子丼（やさしい味）', minutes: 15, cat: 'kids', genre: 'don', tool: 'フライパン',
    main: ['鶏もも肉', '玉ねぎ', '卵'], noKnife: false, fewDishes: false,
    ings: [
      { n: '鶏もも肉', q: 200, u: 'g' }, { n: '玉ねぎ', q: 0.5, u: '個' }, { n: '卵', q: 3, u: '個' },
      { n: 'めんつゆ', q: 3, u: '大さじ' }, { n: '水', q: 150, u: 'ml' }, { n: 'ご飯', q: 3, u: '膳' },
    ],
    steps: [
      { text: '鶏肉は小さめの一口大、玉ねぎは薄切りにする。めんつゆと水を合わせておく。' },
      { text: 'フライパンに合わせ調味料と玉ねぎを入れて火にかけ、沸いたら鶏肉を入れて煮る。', timerSec: 240 },
      { text: '溶き卵の2/3を回し入れ、半熟になったら残りを加える。' },
      { text: '蓋をして火を止め、卵がしっかり固まるまで蒸らす。ご飯に乗せる。', timerSec: 60 },
    ],
    kidNote: '2歳児は卵に完全に火を通し、鶏肉は小さく切る。味が濃ければ取り分けてから大人の分にめんつゆを足す。',
    point: 'めんつゆで味付け一発。だし取り不要。',
    keep: '作り置き・冷凍は不向き（卵が固くなる）。その日のうちに。',
  },
  {
    id: 'n-soborodon', name: '二色そぼろ丼', minutes: 15, cat: 'kids', genre: 'don', tool: 'フライパン',
    main: ['鶏ひき肉', '卵'], noKnife: true, fewDishes: false,
    ings: [
      { n: '鶏ひき肉', q: 200, u: 'g' }, { n: '卵', q: 3, u: '個' }, { n: 'しょうゆ', q: 2, u: '大さじ' },
      { n: '砂糖', q: 1.5, u: '大さじ' }, { n: 'みりん', q: 1, u: '大さじ' }, { n: 'ご飯', q: 3, u: '膳' },
    ],
    steps: [
      { text: 'フライパンにひき肉と調味料を入れて火にかけ、ほぐしながら炒める。水分が飛ぶまでしっかり炒める。', timerSec: 300 },
      { text: '別のフライパン（または洗って）で溶き卵を炒り卵にする。完全に火を通す。' },
      { text: 'ご飯にそぼろと炒り卵を半分ずつ盛り付ける。' },
    ],
    kidNote: 'そぼろは細かくほぐすと2歳児も食べやすい。味は薄めが基本。',
    point: '包丁いらず。そぼろは多めに作ると冷凍できて便利。',
    keep: 'そぼろのみ冷凍可（2週間）。炒り卵はその日に。',
  },
  {
    id: 'n-butadon', name: '甘辛豚丼', minutes: 10, cat: 'kids', genre: 'don', tool: 'フライパン',
    main: ['豚こま肉', '玉ねぎ'], noKnife: false, fewDishes: true,
    ings: [
      { n: '豚こま肉', q: 250, u: 'g' }, { n: '玉ねぎ', q: 0.5, u: '個' }, { n: 'しょうゆ', q: 2, u: '大さじ' },
      { n: '砂糖', q: 1, u: '大さじ' }, { n: 'みりん', q: 1, u: '大さじ' }, { n: 'ご飯', q: 3, u: '膳' },
    ],
    steps: [
      { text: '玉ねぎは薄切り、豚肉は大きいものだけ切る。' },
      { text: 'フライパンで豚肉と玉ねぎを炒め、火が通ったら調味料を加えて絡める。', timerSec: 240 },
      { text: 'ご飯に乗せる。' },
    ],
    kidNote: '豚肉は小さく切ってから盛る。タレはご飯にかけすぎない。',
    point: '10分で完成。玉ねぎの甘みで砂糖控えめでも満足。',
    keep: '作り置き可（冷蔵2日）。冷凍は食感が落ちるので不向き。',
  },
  {
    id: 'n-tuna-chahan', name: 'ツナコーンチャーハン', minutes: 10, cat: 'kids', genre: 'don', tool: 'フライパン',
    main: ['ツナ缶', '卵', 'コーン'], noKnife: true, fewDishes: true,
    ings: [
      { n: 'ツナ缶', q: 1, u: '缶' }, { n: 'コーン', q: 80, u: 'g' }, { n: '卵', q: 2, u: '個' },
      { n: 'ご飯', q: 3, u: '膳' }, { n: 'しょうゆ', q: 1, u: '大さじ' },
    ],
    steps: [
      { text: '溶き卵をフライパンで半熟に炒めて取り出す。' },
      { text: '同じフライパンにご飯、油を切ったツナ、コーンを入れて炒める。' },
      { text: '卵を戻し、しょうゆを鍋肌から回し入れて全体を炒め合わせる。卵に完全に火を通す。', timerSec: 120 },
    ],
    kidNote: 'コーンは喉に詰まらせないよう、2歳児分は軽くつぶすか小さめを選ぶ。',
    point: '包丁不要・フライパン1つ。冷やご飯でもパラッと仕上がる。',
    keep: '冷凍可（1週間）。食べる日にレンジでしっかり再加熱。',
  },
  {
    id: 'n-omurice', name: '簡単オムライス', minutes: 15, cat: 'kids', genre: 'don', tool: 'フライパン＋レンジ',
    main: ['冷凍チキンライス', '卵'], noKnife: true, fewDishes: false,
    ings: [
      { n: '冷凍チキンライス', q: 450, u: 'g' }, { n: '卵', q: 3, u: '個' }, { n: 'ケチャップ', q: null, u: '適量' },
    ],
    steps: [
      { text: '冷凍チキンライスを袋の表示どおり電子レンジで温める。', timerSec: 300 },
      { text: 'フライパンで卵を薄焼きにし、完全に火を通す（包まなくてよい）。' },
      { text: 'チキンライスの上に卵を乗せ、ケチャップをかける。' },
    ],
    kidNote: '卵は半熟にしない。ケチャップは2歳児分は少なめに。',
    point: '冷凍チキンライス活用で包丁・下味いらず。',
    keep: '作り置き不向き。その日のうちに。',
  },
  {
    id: 'n-sake-corn', name: '鮭とコーンのバターご飯', minutes: 5, cat: 'kids', genre: 'don', tool: 'ボウル',
    main: ['鮭フレーク', 'コーン'], noKnife: true, fewDishes: true,
    ings: [
      { n: '鮭フレーク', q: 40, u: 'g' }, { n: 'コーン', q: 80, u: 'g' }, { n: 'バター', q: 10, u: 'g' }, { n: 'ご飯', q: 3, u: '膳' },
    ],
    steps: [
      { text: '温かいご飯に鮭フレーク、コーン、バターを入れて混ぜるだけ。' },
    ],
    kidNote: '鮭フレークは骨が混じることがあるので、2歳児分は混ぜる前に目視で確認。コーンは軽くつぶす。',
    point: '5分・混ぜるだけ。疲れた日の最終兵器。',
    keep: 'おにぎりにして冷凍可（1週間）。',
  },
  {
    id: 'n-teriyaki-chicken', name: '照り焼きチキン', minutes: 15, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['鶏もも肉'], noKnife: false, fewDishes: true,
    ings: [
      { n: '鶏もも肉', q: 350, u: 'g' }, { n: 'しょうゆ', q: 2, u: '大さじ' }, { n: '砂糖', q: 1, u: '大さじ' }, { n: 'みりん', q: 2, u: '大さじ' },
    ],
    steps: [
      { text: '鶏肉を一口大に切り、皮目から焼く。' },
      { text: '両面焼いて中まで火を通す。', timerSec: 300 },
      { text: '調味料を加えて煮絡める。照りが出たら完成。' },
    ],
    kidNote: '2歳児分はタレを絡める前に取り分け、小さく切る。皮は取り除くと食べやすい。',
    point: '調味料は焼いてから入れるので焦げにくい。',
    keep: '焼く前の下味冷凍可（2週間）。焼いた後は冷蔵2日。',
  },
  {
    id: 'n-nugget', name: '揚げないチキンナゲット', minutes: 20, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['鶏ひき肉', '卵'], noKnife: true, fewDishes: false,
    ings: [
      { n: '鶏ひき肉', q: 300, u: 'g' }, { n: '卵', q: 1, u: '個' }, { n: '片栗粉', q: 3, u: '大さじ' },
      { n: 'マヨネーズ', q: 2, u: '大さじ' }, { n: '塩', q: null, u: '少々' },
    ],
    steps: [
      { text: '材料を全部ボウルでよく混ぜる。' },
      { text: 'スプーンで一口大にすくって、油を薄く熱したフライパンに落とす。' },
      { text: '両面を焼き、蓋をして中まで火を通す。', timerSec: 360 },
    ],
    kidNote: '中心まで火が通ったか、1つ割って確認。小さめに作ると2歳児も持ちやすい。',
    point: '包丁不要・揚げないから油の処理なし。',
    keep: '冷凍可（2週間）。レンジで再加熱。',
  },
  {
    id: 'n-pork-chap', name: 'ポークチャップ', minutes: 15, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['豚こま肉', '玉ねぎ'], noKnife: false, fewDishes: true,
    ings: [
      { n: '豚こま肉', q: 250, u: 'g' }, { n: '玉ねぎ', q: 0.5, u: '個' }, { n: 'ケチャップ', q: 3, u: '大さじ' }, { n: 'ウスターソース', q: 1, u: '小さじ' },
    ],
    steps: [
      { text: '玉ねぎは薄切り、豚肉は大きいものだけ切る。' },
      { text: 'フライパンで豚肉と玉ねぎを炒め、完全に火を通す。', timerSec: 300 },
      { text: 'ケチャップとウスターソースを加えて炒め合わせる。' },
    ],
    kidNote: 'ケチャップ味で食べやすい。2歳児分はソース少なめに絡める。',
    point: '子供の好きな味付け。野菜は玉ねぎ以外でも可。',
    keep: '冷蔵2日。冷凍は不向き。',
  },
  {
    id: 'n-tofu-hamburg', name: '豆腐ハンバーグ', minutes: 20, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['鶏ひき肉', '木綿豆腐'], noKnife: true, fewDishes: false,
    ings: [
      { n: '鶏ひき肉', q: 200, u: 'g' }, { n: '木綿豆腐', q: 150, u: 'g' }, { n: 'パン粉', q: 4, u: '大さじ' }, { n: '塩', q: null, u: '少々' },
    ],
    steps: [
      { text: '豆腐はキッチンペーパーに包んでレンジで水切りする（600W・2分）。', timerSec: 120 },
      { text: '材料を混ぜて小さめに丸く成形する。' },
      { text: 'フライパンで両面焼き、蓋をして蒸し焼きで中まで火を通す。', timerSec: 420 },
    ],
    kidNote: 'ふわふわで2歳児も食べやすい。中心の加熱を必ず確認。',
    point: '豆腐でかさ増し＆ふわふわ。包丁不要。',
    keep: '冷凍可（2週間）。焼いてから冷凍。',
  },
  {
    id: 'n-mushiyaki', name: '豚肉とキャベツの蒸し焼き', minutes: 15, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['豚バラ肉', 'キャベツ'], noKnife: true, fewDishes: true,
    ings: [
      { n: '豚バラ肉', q: 250, u: 'g' }, { n: 'キャベツ', q: 0.25, u: '玉' }, { n: '水', q: 100, u: 'ml' }, { n: 'ポン酢', q: null, u: '適量' },
    ],
    steps: [
      { text: 'キャベツは手でちぎってフライパンに敷く。' },
      { text: '豚肉を広げて重ね、水を入れて蓋をし、蒸し焼きにする。', timerSec: 600 },
      { text: '豚肉に完全に火が通ったら、食べる際にポン酢をかける。' },
    ],
    kidNote: '2歳児分はポン酢なしで取り分け、肉とキャベツを小さく切る。キャベツは芯を避ける。',
    point: 'キャベツは手でちぎるので包丁不要。フライパン1つ。',
    keep: '作り置き不向き。その日のうちに。',
  },
  {
    id: 'n-mapo-mild', name: '辛くない麻婆豆腐', minutes: 15, cat: 'kids', genre: 'niku', tool: 'フライパン',
    main: ['豚ひき肉', '絹豆腐'], noKnife: true, fewDishes: true,
    ings: [
      { n: '豚ひき肉', q: 150, u: 'g' }, { n: '絹豆腐', q: 300, u: 'g' }, { n: '味噌', q: 1, u: '大さじ' },
      { n: '砂糖', q: 1, u: '小さじ' }, { n: 'しょうゆ', q: 1, u: '大さじ' }, { n: '片栗粉', q: 2, u: '小さじ' }, { n: '水', q: 200, u: 'ml' },
    ],
    steps: [
      { text: 'フライパンでひき肉を炒め、完全に火を通す。' },
      { text: '水と調味料、さいの目に切った豆腐を加えて煮る。', timerSec: 240 },
      { text: '水溶き片栗粉でとろみをつける。' },
    ],
    kidNote: '豆板醤なしの甘め味噌味。大人は食べる時にラー油を足すとよい。豆腐は崩れやすいので小さくしすぎない。',
    point: '豆板醤を使わない子供仕様。大人用は後がけで調整。',
    keep: '冷蔵1日（豆腐の水が出るため）。冷凍不向き。',
  },
  {
    id: 'n-salmon-butter', name: '鮭のバター醤油焼き', minutes: 15, cat: 'kids', genre: 'sakana', tool: 'フライパン',
    main: ['生鮭'], noKnife: false, fewDishes: true,
    ings: [
      { n: '生鮭', q: 3, u: '切れ' }, { n: 'バター', q: 10, u: 'g' }, { n: 'しょうゆ', q: 2, u: '小さじ' }, { n: '小麦粉', q: 1, u: '大さじ' },
    ],
    steps: [
      { text: '鮭に小麦粉を薄くまぶす。' },
      { text: 'フライパンで両面焼き、中まで火を通す。', timerSec: 360 },
      { text: 'バターとしょうゆを加えて絡める。' },
    ],
    kidNote: '2歳児分は骨を丁寧に確認してほぐす。皮は取り除く。',
    point: '小麦粉をまぶすと香ばしく、タレが絡む。',
    keep: '冷蔵1日。冷凍は焼く前のみ可。',
  },
  {
    id: 'n-saba-tomato', name: 'サバ缶のトマト煮', minutes: 10, cat: 'kids', genre: 'sakana', tool: '鍋',
    main: ['サバ水煮缶', 'カットトマト缶'], noKnife: true, fewDishes: true,
    ings: [
      { n: 'サバ水煮缶', q: 1, u: '缶' }, { n: 'カットトマト缶', q: 1, u: '缶' }, { n: 'コンソメ', q: 1, u: '小さじ' }, { n: '砂糖', q: null, u: '少々' },
    ],
    steps: [
      { text: '鍋にトマト缶とサバ缶（汁ごと）を入れる。' },
      { text: 'サバをほぐしながら煮込む。コンソメと砂糖で味を整える。', timerSec: 420 },
    ],
    kidNote: 'サバの骨は柔らかいが、2歳児分は大きな骨を取り除いてほぐす。',
    point: '缶詰2つで完成・包丁不要。鍋1つで洗い物最小。',
    keep: '冷蔵2日。冷凍可（1週間）。',
  },
  {
    id: 'n-whitefish-mayo', name: '白身魚のマヨチーズ焼き', minutes: 20, cat: 'kids', genre: 'sakana', tool: 'トースター',
    main: ['骨なしタラ'], noKnife: true, fewDishes: true,
    ings: [
      { n: '骨なしタラ', q: 3, u: '切れ' }, { n: 'マヨネーズ', q: 2, u: '大さじ' }, { n: 'ピザ用チーズ', q: 30, u: 'g' },
    ],
    steps: [
      { text: 'タラの水気を拭き、アルミホイルを敷いた天板に並べる。' },
      { text: 'マヨネーズとチーズを乗せる。' },
      { text: 'トースターで焼き目がつき、中まで火が通るまで焼く（目安10〜12分）。', timerSec: 720 },
    ],
    kidNote: '骨なし魚でも念のため確認。チーズは熱いので少し冷ましてから出す。',
    point: '乗せて焼くだけ。フライパンを使わない。',
    keep: '作り置き不向き。その日のうちに。',
  },
  {
    id: 'n-yakiudon', name: '焼きうどん', minutes: 15, cat: 'kids', genre: 'men', tool: 'フライパン',
    main: ['冷凍うどん', '豚こま肉', 'カット野菜'], noKnife: true, fewDishes: true,
    ings: [
      { n: '冷凍うどん', q: 3, u: '玉' }, { n: '豚こま肉', q: 150, u: 'g' }, { n: 'カット野菜', q: 200, u: 'g' }, { n: 'めんつゆ', q: 3, u: '大さじ' },
    ],
    steps: [
      { text: '冷凍うどんは袋の表示どおりレンジで解凍する。' },
      { text: 'フライパンで豚肉とカット野菜を炒め、完全に火を通す。', timerSec: 300 },
      { text: 'うどんとめんつゆを加えて炒め合わせる。' },
    ],
    kidNote: 'うどんは2歳児分は短く切る（窒息防止）。野菜の大きいものは避ける。',
    point: 'カット野菜＋冷凍うどんで包丁不要。',
    keep: '作り置き不向き。その日のうちに。',
  },
  {
    id: 'n-tuna-pasta', name: 'ツナクリームパスタ', minutes: 15, cat: 'kids', genre: 'men', tool: '鍋＋フライパン',
    main: ['パスタ', 'ツナ缶', '牛乳'], noKnife: true, fewDishes: false,
    ings: [
      { n: 'パスタ', q: 200, u: 'g' }, { n: 'ツナ缶', q: 1, u: '缶' }, { n: '牛乳', q: 250, u: 'ml' },
      { n: 'コーン', q: 50, u: 'g' }, { n: 'コンソメ', q: 1, u: '小さじ' }, { n: '小麦粉', q: 1, u: '大さじ' },
    ],
    steps: [
      { text: 'パスタを袋の表示どおり茹でる。', timerSec: 480 },
      { text: 'フライパンでツナと小麦粉を軽く炒め、牛乳を少しずつ加えてのばす。コーンとコンソメを入れる。' },
      { text: '茹でたパスタを加えて絡める。' },
    ],
    kidNote: 'パスタは2歳児分は短く折って茹でるか、茹でた後に切る。コーンは軽くつぶす。',
    point: '生クリーム不要、牛乳で軽いクリームソース。',
    keep: '作り置き不向き（麺がのびる）。',
  },
  {
    id: 'n-tamago-udon', name: '卵とじうどん', minutes: 10, cat: 'kids', genre: 'men', tool: '鍋',
    main: ['冷凍うどん', '卵', '冷凍ほうれん草'], noKnife: true, fewDishes: true,
    ings: [
      { n: '冷凍うどん', q: 3, u: '玉' }, { n: '卵', q: 2, u: '個' }, { n: 'めんつゆ', q: 3, u: '大さじ' },
      { n: '水', q: 600, u: 'ml' }, { n: '冷凍ほうれん草', q: 80, u: 'g' },
    ],
    steps: [
      { text: '鍋に水とめんつゆを沸かし、冷凍うどんとほうれん草を入れて煮る。', timerSec: 240 },
      { text: '溶き卵を回し入れ、しっかり火を通す。' },
    ],
    kidNote: 'うどんは2歳児分は短く切る。卵は半熟にしない。熱々なので冷ましてから。',
    point: '鍋1つ・10分。体調がイマイチな日にも。',
    keep: '作り置き不向き。その日のうちに。',
  },
  {
    id: 'n-hakusai-nabe', name: '白菜と豚肉の簡単鍋', minutes: 20, cat: 'kids', genre: 'nabe', tool: '鍋',
    main: ['白菜', '豚バラ肉', '豆腐'], noKnife: false, fewDishes: true,
    ings: [
      { n: '白菜', q: 0.25, u: '玉' }, { n: '豚バラ肉', q: 250, u: 'g' }, { n: '豆腐', q: 150, u: 'g' },
      { n: '白だし', q: 4, u: '大さじ' }, { n: '水', q: 600, u: 'ml' },
    ],
    steps: [
      { text: '白菜はざく切り、豆腐は一口大、豚肉は食べやすい大きさに切る。' },
      { text: '鍋に材料と水、白だしを入れて煮る。豚肉に完全に火を通す。', timerSec: 600 },
      { text: '足りなければうどんを追加してもよい。' },
    ],
    kidNote: '2歳児分は白だしを薄めた汁で取り分け、白菜は柔らかい葉の部分を小さく切る。',
    point: '白だしで味が決まる。鍋ごと食卓へ。',
    keep: '冷蔵1日。翌日はうどんを入れて煮込み直すとよい。',
  },
  {
    id: 'n-chicken-soup', name: '鶏肉と野菜のコンソメスープ', minutes: 20, cat: 'kids', genre: 'nabe', tool: '鍋',
    main: ['鶏もも肉', 'キャベツ', '冷凍ミックスベジタブル'], noKnife: false, fewDishes: true,
    ings: [
      { n: '鶏もも肉', q: 200, u: 'g' }, { n: 'キャベツ', q: 150, u: 'g' }, { n: '玉ねぎ', q: 0.5, u: '個' },
      { n: '冷凍ミックスベジタブル', q: 100, u: 'g' }, { n: 'コンソメ', q: 1, u: '大さじ' }, { n: '水', q: 700, u: 'ml' },
    ],
    steps: [
      { text: '鶏肉、キャベツ、玉ねぎを食べやすい大きさに切る。' },
      { text: '鍋に水とコンソメ、材料を全部入れて煮込む。鶏肉に完全に火を通す。', timerSec: 720 },
      { text: 'パンやご飯を添える。' },
    ],
    kidNote: '野菜は柔らかくなるまで煮る。2歳児分は具を小さく切り、汁は薄めに。',
    point: '冷凍ミックスベジタブルで彩りと手間を省略。鍋1つ。',
    keep: '冷蔵2日。冷凍可（1週間）。',
  },
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RECIPES2, GENRES, GENRE_OF, FLAGS_OF, SIDE_DISHES, ING_CATEGORY, SHOP_GROUPS,
    genreOf, flagsOf, categoryOf, fmtNum, fmtQty, fmtIng, scaleQty,
    parseIngredient, recipeIngs, aggregateForRecipes, planWeek, pickReplacement,
  };
}
