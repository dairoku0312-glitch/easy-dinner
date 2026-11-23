'use strict';

// かんたん晩ごはん v1
// 方針: 15分前後・工程は最大5つ・1工程は短い文・タイマーは必要な工程だけ
const RECIPES = [
  {
    id: 'shogayaki', name: '豚こま生姜焼き', minutes: 15, tool: 'フライパン1つ',
    ingredients: ['豚こま肉 300g', '玉ねぎ 1個', 'しょうがチューブ 3cm', 'しょうゆ 大さじ2', 'みりん 大さじ2', '酒 大さじ1', '油 小さじ2'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '玉ねぎを薄切りにする' },
      { text: 'フライパンに油を熱し、豚肉と玉ねぎを炒める', timerSec: 300 },
      { text: 'しょうが・しょうゆ・みりん・酒を入れて絡める', timerSec: 120 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'oyakodon', name: '親子丼', minutes: 15, tool: 'フライパン1つ',
    ingredients: ['鶏もも肉 1枚', '玉ねぎ 1個', '卵 3個', 'めんつゆ（3倍濃縮）大さじ4', '水 150ml', 'ごはん 人数分'],
    steps: [
      { text: '鶏肉は一口大、玉ねぎは薄切りにする' },
      { text: 'フライパンに水とめんつゆを入れて沸かす' },
      { text: '鶏肉と玉ねぎを入れて煮る', timerSec: 300 },
      { text: '溶き卵を回し入れて、ふたをして弱火で待つ', timerSec: 120 },
      { text: 'ごはんにのせて完成！' },
    ],
  },
  {
    id: 'yakisoba', name: 'ソース焼きそば', minutes: 10, tool: 'フライパン1つ',
    ingredients: ['焼きそば麺 3玉', '豚バラ肉 150g', 'カット野菜 1袋', '付属のソース'],
    steps: [
      { text: 'フライパンで豚肉を炒める', timerSec: 180 },
      { text: 'カット野菜を入れて炒める', timerSec: 180 },
      { text: '麺と水大さじ3を入れてほぐす', timerSec: 120 },
      { text: 'ソースを絡めて完成！' },
    ],
  },
  {
    id: 'chahan', name: 'ウインナーチャーハン', minutes: 10, tool: 'フライパン1つ',
    ingredients: ['ごはん 2合分', '卵 2個', 'ウインナー 4本', '冷凍ねぎ ひとつかみ', 'しょうゆ 小さじ2', '鶏ガラスープの素 小さじ2'],
    steps: [
      { text: 'ウインナーを小さく切る' },
      { text: '熱したフライパンに油と溶き卵、すぐごはんを入れて炒める', timerSec: 180 },
      { text: 'ウインナーとねぎ、調味料を入れて炒める', timerSec: 120 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'mabodofu', name: '麻婆豆腐（素つかい）', minutes: 10, tool: 'フライパン1つ',
    ingredients: ['麻婆豆腐の素 1箱', '豆腐 1丁', 'ひき肉 150g（素に入ってる場合は不要）', 'ごはん 人数分'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '豆腐を一口大に切る' },
      { text: 'フライパンでひき肉を炒める', timerSec: 180 },
      { text: '素と豆腐を入れて温める', timerSec: 180 },
      { text: 'ごはんにかけて完成！' },
    ],
  },
  {
    id: 'sake-mushi', name: '鮭と野菜のレンジ蒸し', minutes: 12, tool: '電子レンジ',
    ingredients: ['鮭の切り身 2〜3切れ', 'カット野菜 1袋', 'バター 10g', 'しょうゆ 小さじ2', '酒 大さじ1'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '耐熱皿に野菜→鮭の順にのせ、酒をふる' },
      { text: 'ふんわりラップをしてレンジ600Wで加熱する', timerSec: 360 },
      { text: 'バターとしょうゆをかけて完成！' },
    ],
  },
  {
    id: 'niku-udon', name: '肉うどん', minutes: 10, tool: '鍋1つ',
    ingredients: ['冷凍うどん 人数分', '豚こま肉 150g', 'めんつゆ（3倍濃縮）150ml', '水 600ml', '冷凍ねぎ ひとつかみ'],
    steps: [
      { text: '鍋に水とめんつゆを入れて沸かす' },
      { text: '豚肉を入れて火を通す', timerSec: 180 },
      { text: '冷凍うどんを入れて煮る', timerSec: 180 },
      { text: 'ねぎを散らして完成！' },
    ],
  },
  {
    id: 'teriyaki', name: '鶏の照り焼き', minutes: 15, tool: 'フライパン1つ',
    ingredients: ['鶏もも肉 1〜2枚', 'しょうゆ 大さじ2', 'みりん 大さじ2', '砂糖 大さじ1', '油 小さじ1'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '鶏肉を一口大に切る' },
      { text: '皮目から焼いて、両面に火を通す', timerSec: 360 },
      { text: '調味料を入れて照りが出るまで絡める', timerSec: 120 },
      { text: 'お皿に盛って完成！' },
    ],
  },
];

const SHOPPING_KEY = 'easy-dinner.shopping.v1';
const COOKING_KEY = 'easy-dinner.cooking.v1';

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function getRecipe(id) {
  return RECIPES.find((r) => r.id === id) || null;
}

// ---- 追加レシピ8品（合計16品） ----
const MORE_RECIPES = [
  {
    id: 'soboro', name: '鶏そぼろ丼', minutes: 12, tool: 'フライパン1つ',
    main: ['ひき肉', '卵'],
    kidNote: 'しょうゆを入れる前にそぼろを取り分けると薄味になります。',
    ingredients: ['鶏ひき肉 250g', '卵 2個', 'しょうゆ 大さじ2', '砂糖 大さじ1.5', 'みりん 大さじ1', 'ごはん 人数分'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: 'フライパンでひき肉と調味料を炒め煮する', timerSec: 300 },
      { text: '別の小鍋かフライパンの端で炒り卵を作る', timerSec: 120 },
      { text: 'ごはんにそぼろと卵をのせて完成！' },
    ],
  },
  {
    id: 'napolitan-udon', name: 'ナポリタン風うどん', minutes: 10, tool: 'フライパン1つ',
    main: ['うどん', 'ウインナー', '玉ねぎ'],
    kidNote: 'ケチャップを入れる前にうどんと具を取り分けると薄味になります。',
    ingredients: ['冷凍うどん 2玉', 'ウインナー 4本', '玉ねぎ 半分', 'ケチャップ 大さじ4', 'バター 10g'],
    steps: [
      { text: 'ウインナーと玉ねぎを切る' },
      { text: 'フライパンでウインナーと玉ねぎを炒める', timerSec: 180 },
      { text: '冷凍うどんと水大さじ3を入れてほぐす', timerSec: 180 },
      { text: 'ケチャップとバターを絡めて完成！' },
    ],
  },
  {
    id: 'buta-daikon', name: '豚バラ大根のレンジ煮', minutes: 15, tool: '電子レンジ',
    main: ['豚肉', '大根'],
    kidNote: '味が濃いので、2歳児分は煮汁をかけずに具だけ取り分けてください。',
    ingredients: ['豚バラ薄切り 200g', '大根 1/4本', 'めんつゆ（3倍濃縮）大さじ3', '水 大さじ3', 'しょうがチューブ 2cm'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '大根を薄い半月切りにし、豚肉は一口大に切る' },
      { text: '耐熱皿に大根→豚肉の順に重ね、調味料をかける' },
      { text: 'ラップをしてレンジ600Wで加熱し、混ぜてもう一度加熱する', timerSec: 480 },
      { text: '少し置いて味をなじませたら完成！' },
    ],
  },
  {
    id: 'tofu-champuru', name: 'ツナ豆腐チャンプルー', minutes: 10, tool: 'フライパン1つ',
    main: ['豆腐', 'ツナ缶', '卵'],
    kidNote: '味付け前に取り分ければ、豆腐と卵だけでも栄養がとれます。',
    ingredients: ['木綿豆腐 1丁', 'ツナ缶 1缶', '卵 2個', '冷凍ねぎ ひとつかみ', 'めんつゆ 大さじ1.5'],
    steps: [
      { text: '豆腐を一口大にちぎる' },
      { text: 'フライパンで豆腐を焼き付ける', timerSec: 180 },
      { text: 'ツナとめんつゆを入れて炒める', timerSec: 120 },
      { text: '溶き卵とねぎを入れてさっと炒めて完成！' },
    ],
  },
  {
    id: 'stew', name: 'クリームシチュー（ルウ）', minutes: 20, tool: '鍋1つ',
    main: ['鶏肉', '玉ねぎ', '冷凍野菜'],
    kidNote: 'ルウを入れる前の具とスープを取り分けると、2歳児の薄味シチューになります。',
    ingredients: ['シチューのルウ 半箱', '鶏もも肉 1枚', '玉ねぎ 1個', '冷凍ミックスベジタブル 1袋', '牛乳 100ml', '水 500ml'],
    steps: [
      { text: '鶏肉と玉ねぎを一口大に切る' },
      { text: '鍋で鶏肉と玉ねぎを炒める', timerSec: 180 },
      { text: '水と冷凍野菜を入れて煮る', timerSec: 480 },
      { text: '火を止めてルウを溶かし、牛乳を入れて温める', timerSec: 180 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'yaki-udon', name: '焼きうどん', minutes: 10, tool: 'フライパン1つ',
    main: ['うどん', '豚肉', 'カット野菜'],
    kidNote: 'ソースを入れる前に取り分けると薄味になります。うどんは短く切ってあげてください。',
    ingredients: ['冷凍うどん 2玉', '豚こま肉 150g', 'カット野菜 1袋', '焼きそばソース 大さじ3'],
    steps: [
      { text: 'フライパンで豚肉を炒める', timerSec: 180 },
      { text: 'カット野菜を入れて炒める', timerSec: 120 },
      { text: '冷凍うどんと水大さじ3を入れてほぐす', timerSec: 180 },
      { text: 'ソースを絡めて完成！' },
    ],
  },
  {
    id: 'saba-curry', name: 'さば缶カレー', minutes: 12, tool: '鍋1つ',
    main: ['さば缶', '玉ねぎ'],
    kidNote: 'カレーは辛いので2歳児分は別に。さばと玉ねぎを取り分けてごはんにのせるだけでもOKです。',
    ingredients: ['さば水煮缶 1缶', '玉ねぎ 1個', 'カレールウ 2かけ', '水 200ml', 'ごはん 人数分'],
    steps: [
      { text: 'お米を炊飯器にセットする' },
      { text: '玉ねぎを薄切りにして鍋で炒める', timerSec: 180 },
      { text: 'さば缶（汁ごと）と水を入れて煮る', timerSec: 240 },
      { text: 'ルウを溶かしてごはんにかけて完成！' },
    ],
  },
  {
    id: 'zosui', name: '卵雑炊', minutes: 8, tool: '鍋1つ',
    main: ['ごはん', '卵'],
    kidNote: 'もともと薄味で作れるので、そのまま子どもと一緒に食べられます。',
    ingredients: ['ごはん 1合分', '卵 2個', '水 500ml', 'めんつゆ 大さじ2', '冷凍ねぎ ひとつかみ'],
    steps: [
      { text: '鍋に水とめんつゆを入れて沸かす' },
      { text: 'ごはんをほぐしながら入れて煮る', timerSec: 180 },
      { text: '溶き卵とねぎを入れてふたをする', timerSec: 60 },
      { text: '器に盛って完成！' },
    ],
  },
];
RECIPES.push(...MORE_RECIPES);

// ---- 既存8品の検索用材料と取り分けメモ ----
const MAIN_MAP = {
  shogayaki: ['豚肉', '玉ねぎ'],
  oyakodon: ['鶏肉', '卵', '玉ねぎ'],
  yakisoba: ['麺', '豚肉', 'カット野菜'],
  chahan: ['ごはん', '卵', 'ウインナー'],
  mabodofu: ['豆腐', 'ひき肉'],
  'sake-mushi': ['鮭', 'カット野菜'],
  'niku-udon': ['うどん', '豚肉'],
  teriyaki: ['鶏肉'],
};
const KID_NOTE_MAP = {
  shogayaki: '調味料を入れる前に豚肉と玉ねぎを取り分けると、2歳児の薄味分になります。',
  oyakodon: '卵を入れる前に鶏肉と玉ねぎを取り分けると薄味にできます。',
  yakisoba: 'ソースを入れる前に麺と具を取り分けると薄味になります。麺は短く切ってあげてください。',
  chahan: '味付け前に取り分けると薄味チャーハンになります。',
  mabodofu: '麻婆の素は辛いので、2歳児分は豆腐とひき肉を味付け前に取り分けてください。',
  'sake-mushi': 'しょうゆをかける前に鮭と野菜を取り分けると薄味になります。骨に注意してください。',
  'niku-udon': 'うどんと具だけ取り分けて、つゆは薄めてかけてください。うどんは短く切ると食べやすいです。',
  teriyaki: 'タレを絡める前に鶏肉を取り分けると薄味になります。',
};
RECIPES.forEach((r) => {
  if (!r.main) r.main = MAIN_MAP[r.id] || [];
  if (!r.kidNote) r.kidNote = KID_NOTE_MAP[r.id] || '';
});

// 材料フィルター候補
const INGREDIENT_FILTERS = ['豚肉', '鶏肉', 'ひき肉', '卵', '豆腐', '鮭', 'さば缶', 'ツナ缶', 'ウインナー', 'ごはん', 'うどん', '麺', '玉ねぎ', 'カット野菜', '大根', '冷凍野菜'];

// ---- カテゴリ追加：子ども向け6品 ----
const KID_RECIPES = [
  {
    id: 'shirasu-chahan', name: 'しらす卵チャーハン', minutes: 10, tool: 'フライパン1つ', cat: 'kids',
    main: ['ごはん', '卵'],
    kidNote: 'そのまま子ども向けの薄味です。しらすの塩気だけで十分です。',
    ingredients: ['ごはん 2合分', 'しらす 50g', '卵 2個', '冷凍ねぎ ひとつかみ', 'ごま油 小さじ1'],
    steps: [
      { text: '熱したフライパンにごま油と溶き卵、すぐごはんを入れて炒める', timerSec: 180 },
      { text: 'しらすとねぎを入れて炒める', timerSec: 120 },
      { text: '小さく盛って完成！（子ども分は短くほぐして）' },
    ],
  },
  {
    id: 'tofu-tsukune', name: '豆腐つくね', minutes: 15, tool: 'フライパン1つ', cat: 'kids',
    main: ['ひき肉', '豆腐'],
    kidNote: 'そのまま子ども向けです。タレなしでも食べられます。',
    ingredients: ['鶏ひき肉 200g', '木綿豆腐 半丁', '片栗粉 大さじ2', 'しょうゆ 小さじ1'],
    steps: [
      { text: '豆腐の水気を軽く切る' },
      { text: '材料を全部混ぜて小さく丸める' },
      { text: 'フライパンで両面を焼く', timerSec: 360 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'kabocha-soboro', name: 'かぼちゃのそぼろ煮（レンジ）', minutes: 12, tool: '電子レンジ', cat: 'kids',
    main: ['ひき肉', '冷凍野菜'],
    kidNote: 'そのまま子ども向けの甘い味付けです。かぼちゃは小さく切ってください。',
    ingredients: ['冷凍かぼちゃ 300g', '鶏ひき肉 100g', 'しょうゆ 小さじ2', '砂糖 小さじ2', '水 大さじ3'],
    steps: [
      { text: '耐熱皿に材料を全部入れて混ぜる' },
      { text: 'ラップをしてレンジ600Wで加熱する', timerSec: 300 },
      { text: '混ぜてもう一度加熱する', timerSec: 180 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'mini-hamburg', name: 'ミニハンバーグ', minutes: 15, tool: 'フライパン1つ', cat: 'kids',
    main: ['ひき肉', '豆腐', '玉ねぎ'],
    kidNote: 'そのまま子ども向けです。ソースなしでも豆腐のうま味で食べられます。',
    ingredients: ['合いびき肉 250g', '木綿豆腐 半丁', '玉ねぎ 半分（みじん切り）', 'パン粉 大さじ3', '塩 少々'],
    steps: [
      { text: '材料を全部混ぜて小さく丸める' },
      { text: 'フライパンで片面を焼く', timerSec: 240 },
      { text: '裏返してふたをして蒸し焼きにする', timerSec: 300 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'tamago-udon', name: 'たまごうどん', minutes: 8, tool: '鍋1つ', cat: 'kids',
    main: ['うどん', '卵'],
    kidNote: 'そのまま子ども向けです。うどんは短く切ってあげてください。',
    ingredients: ['冷凍うどん 2玉', '卵 2個', '水 600ml', 'めんつゆ（3倍濃縮）大さじ3', '冷凍ねぎ ひとつかみ'],
    steps: [
      { text: '鍋に水とめんつゆを入れて沸かす' },
      { text: '冷凍うどんを入れて煮る', timerSec: 180 },
      { text: '溶き卵とねぎを入れて完成！' },
    ],
  },
  {
    id: 'sake-onigiri', name: '鮭おにぎり＆味噌汁セット', minutes: 10, tool: '鍋1つ', cat: 'kids',
    main: ['ごはん', '鮭'],
    kidNote: 'そのまま子ども向けです。鮭の骨は大人が取り除いてください。',
    ingredients: ['ごはん 2合分', '鮭フレーク 適量', '乾燥わかめ ひとつかみ', '味噌 大さじ2', '水 600ml'],
    steps: [
      { text: 'ごはんに鮭フレークを混ぜておにぎりを作る' },
      { text: '鍋にお湯を沸かしてわかめを入れる', timerSec: 120 },
      { text: '火を止めて味噌を溶いて完成！' },
    ],
  },
];
RECIPES.push(...KID_RECIPES);

// ---- カテゴリ追加：PFCを考えた6品（数値は1人分の目安） ----
const PFC_RECIPES = [
  {
    id: 'salad-chicken', name: 'サラダチキン（レンジ）', minutes: 12, tool: '電子レンジ', cat: 'pfc',
    main: ['鶏肉'], pfc: 'P38g / F3g / C2g',
    kidNote: '塩分控えめにすれば子どもも食べられます。小さく裂いてあげてください。',
    ingredients: ['鶏むね肉（皮なし）1枚', '酒 大さじ1', '塩 小さじ半分', '砂糖 小さじ半分'],
    steps: [
      { text: '鶏肉にフォークで穴を開け、調味料をすり込む' },
      { text: '耐熱皿に入れてラップをし、レンジ600Wで加熱する', timerSec: 240 },
      { text: '裏返してもう一度加熱し、そのまま置いて余熱で火を通す', timerSec: 180 },
      { text: '切って盛って完成！' },
    ],
  },
  {
    id: 'hire-shogayaki', name: '豚ヒレ生姜焼き', minutes: 12, tool: 'フライパン1つ', cat: 'pfc',
    main: ['豚肉', '玉ねぎ'], pfc: 'P30g / F6g / C10g',
    kidNote: '味付け前に取り分けると子どもの薄味分になります。',
    ingredients: ['豚ヒレ肉 300g', '玉ねぎ 1個', 'しょうがチューブ 3cm', 'しょうゆ 大さじ2', 'みりん 大さじ1'],
    steps: [
      { text: '豚ヒレを薄切りにし、玉ねぎは薄切りにする' },
      { text: 'フライパンで豚肉と玉ねぎを炒める', timerSec: 300 },
      { text: '調味料を入れて絡めて完成！', timerSec: 120 },
    ],
  },
  {
    id: 'mune-oyakodon', name: '鶏むね親子丼（高たんぱく）', minutes: 15, tool: 'フライパン1つ', cat: 'pfc',
    main: ['鶏肉', '卵', '玉ねぎ'], pfc: 'P35g / F9g / C70g（ごはん込み）',
    kidNote: '卵を入れる前に取り分けると子どもの薄味分になります。',
    ingredients: ['鶏むね肉 1枚', '玉ねぎ 1個', '卵 3個', 'めんつゆ（3倍濃縮）大さじ4', '水 150ml', 'ごはん 人数分'],
    steps: [
      { text: '鶏むねを薄いそぎ切りにし、玉ねぎは薄切りにする' },
      { text: 'フライパンに水とめんつゆを入れて沸かす' },
      { text: '鶏肉と玉ねぎを入れて煮る', timerSec: 300 },
      { text: '溶き卵を回し入れてふたをして待つ', timerSec: 120 },
      { text: 'ごはんにのせて完成！' },
    ],
  },
  {
    id: 'ebi-broccoli', name: 'エビとブロッコリーの炒め物', minutes: 10, tool: 'フライパン1つ', cat: 'pfc',
    main: ['冷凍野菜'], pfc: 'P24g / F8g / C8g',
    kidNote: 'エビは小さく切れば子どもも食べられます。味付け前に取り分けてください。',
    ingredients: ['冷凍むきエビ 200g', '冷凍ブロッコリー 1袋', 'にんにくチューブ 2cm', '鶏ガラスープの素 小さじ2', '油 小さじ2'],
    steps: [
      { text: 'フライパンに油とにんにくを入れて熱する' },
      { text: 'エビとブロッコリーを入れて炒める', timerSec: 300 },
      { text: '鶏ガラスープの素で味付けして完成！' },
    ],
  },
  {
    id: 'tuna-omelette', name: 'ツナオムレツ', minutes: 8, tool: 'フライパン1つ', cat: 'pfc',
    main: ['ツナ缶', '卵'], pfc: 'P26g / F14g / C3g',
    kidNote: 'そのまま子どもも食べられます。ケチャップは大人の分だけに。',
    ingredients: ['卵 3個', 'ツナ缶（水煮）1缶', '冷凍ねぎ ひとつかみ', '塩こしょう 少々'],
    steps: [
      { text: '卵を溶いて、ツナとねぎを混ぜる' },
      { text: 'フライパンで焼いて半熟で巻く', timerSec: 180 },
      { text: 'お皿に盛って完成！' },
    ],
  },
  {
    id: 'tofu-soboro-an', name: '豆腐の鶏そぼろあんかけ', minutes: 12, tool: 'フライパン1つ', cat: 'pfc',
    main: ['豆腐', 'ひき肉'], pfc: 'P24g / F10g / C12g',
    kidNote: 'あんを薄味にすれば子どもも一緒に食べられます。',
    ingredients: ['絹豆腐 1丁', '鶏ひき肉 150g', 'しょうゆ 大さじ1.5', 'みりん 大さじ1', '片栗粉 小さじ2', '水 150ml'],
    steps: [
      { text: 'フライパンでひき肉を炒める', timerSec: 180 },
      { text: '水と調味料を入れて沸かす' },
      { text: '豆腐を大きく崩し入れて温める', timerSec: 180 },
      { text: '水溶き片栗粉でとろみをつけて完成！' },
    ],
  },
];
RECIPES.push(...PFC_RECIPES);
RECIPES.forEach((r) => { if (!r.cat) r.cat = 'normal'; });

const CATEGORIES = [
  { id: 'all', label: '全部' },
  { id: 'normal', label: 'ふつう' },
  { id: 'kids', label: '子ども向け' },
  { id: 'pfc', label: 'PFC（筋トレ向け）' },
];

const RABBIT_SVG = '<svg viewBox="0 0 120 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
  + '<g transform="rotate(-12 38 30)"><ellipse cx="38" cy="30" rx="12" ry="27" fill="#fffdf9" stroke="#e8b48f" stroke-width="3"/><ellipse cx="38" cy="33" rx="6" ry="18" fill="#ffc7d1"/></g>'
  + '<g transform="rotate(12 82 30)"><ellipse cx="82" cy="30" rx="12" ry="27" fill="#fffdf9" stroke="#e8b48f" stroke-width="3"/><ellipse cx="82" cy="33" rx="6" ry="18" fill="#ffc7d1"/></g>'
  + '<ellipse cx="60" cy="76" rx="39" ry="31" fill="#fffdf9" stroke="#e8b48f" stroke-width="3"/>'
  + '<circle cx="46" cy="72" r="4" fill="#4a3428"/><circle cx="74" cy="72" r="4" fill="#4a3428"/>'
  + '<circle cx="47.5" cy="70.5" r="1.3" fill="#ffffff"/><circle cx="75.5" cy="70.5" r="1.3" fill="#ffffff"/>'
  + '<ellipse cx="60" cy="80" rx="3.6" ry="2.6" fill="#f28ba8"/>'
  + '<path d="M60 82.5 Q56 87 52 84.5 M60 82.5 Q64 87 68 84.5" stroke="#4a3428" stroke-width="2" fill="none" stroke-linecap="round"/>'
  + '<ellipse cx="37" cy="82" rx="7" ry="4" fill="#ffb3c1" opacity="0.75"/>'
  + '<ellipse cx="83" cy="82" rx="7" ry="4" fill="#ffb3c1" opacity="0.75"/>'
  + '</svg>';

const CHEERS = ['がんばれー！', 'いい調子！', 'その調子、その調子', 'あと少しだよ', 'もうすぐ完成！'];

if (typeof document !== 'undefined') {
  const $ = (id) => document.getElementById(id);
  document.querySelectorAll('[data-rabbit]').forEach((el) => { el.innerHTML = RABBIT_SVG; });
  const views = ['view-home', 'view-recipe', 'view-cook', 'view-shopping'];
  let currentRecipeId = null;
  let timerId = null;
  let timerLeft = 0;

  function show(viewId) {
    views.forEach((v) => { $(v).hidden = v !== viewId; });
    stopTimer();
  }

  // ---- ホーム ----
  const selectedFilters = new Set();
  let selectedCat = 'all';
  function renderCatChips() {
    const box = $('catChips');
    box.innerHTML = '';
    CATEGORIES.forEach((c) => {
      const chip = document.createElement('button');
      chip.className = 'chip' + (selectedCat === c.id ? ' on' : '');
      chip.textContent = c.label;
      chip.addEventListener('click', () => { selectedCat = c.id; renderHome(); });
      box.appendChild(chip);
    });
  }
  function renderChips() {
    const box = $('filterChips');
    box.innerHTML = '';
    INGREDIENT_FILTERS.forEach((name) => {
      const chip = document.createElement('button');
      chip.className = 'chip' + (selectedFilters.has(name) ? ' on' : '');
      chip.textContent = name;
      chip.addEventListener('click', () => {
        if (selectedFilters.has(name)) selectedFilters.delete(name);
        else selectedFilters.add(name);
        renderHome();
      });
      box.appendChild(chip);
    });
  }
  function filteredRecipes() {
    let pool = RECIPES;
    if (selectedCat !== 'all') pool = pool.filter((r) => r.cat === selectedCat);
    if (selectedFilters.size === 0) return pool;
    return pool
      .map((r) => ({ r, hit: r.main.filter((m) => selectedFilters.has(m)).length }))
      .filter((x) => x.hit > 0)
      .sort((a, b) => b.hit - a.hit)
      .map((x) => x.r);
  }
  function renderHome() {
    renderCatChips();
    renderChips();
    const targets = filteredRecipes();
    $('filterNote').textContent = selectedFilters.size === 0
      ? ''
      : targets.length + '品が作れます（材料が多く合う順）';
    const list = $('menuList');
    list.innerHTML = '';
    targets.forEach((r) => {
      const btn = document.createElement('button');
      btn.className = 'menu-card';
      btn.innerHTML = '<span class="name"></span><span class="sub"></span>';
      btn.querySelector('.name').textContent = r.name;
      btn.querySelector('.sub').textContent = '約' + r.minutes + '分 ・ ' + r.tool + ' ・ 工程' + r.steps.length + 'つ' + (r.pfc ? ' ・ ' + r.pfc : '');
      btn.addEventListener('click', () => openRecipe(r.id));
      list.appendChild(btn);
    });
    const shopping = loadJSON(SHOPPING_KEY, []);
    $('shoppingCount').textContent = String(shopping.filter((i) => !i.done).length);
    const cooking = loadJSON(COOKING_KEY, null);
    if (cooking && getRecipe(cooking.recipeId)) {
      $('resumeBox').hidden = false;
      $('resumeText').textContent = getRecipe(cooking.recipeId).name + ' の途中です（手順' + (cooking.step + 1) + '）';
    } else {
      $('resumeBox').hidden = true;
    }
    show('view-home');
  }

  // ---- レシピ詳細 ----
  function openRecipe(id) {
    currentRecipeId = id;
    const r = getRecipe(id);
    $('recipeName').textContent = r.name;
    $('recipeMeta').textContent = '約' + r.minutes + '分 ・ ' + r.tool + ' ・ 工程' + r.steps.length + 'つ';
    if (r.kidNote) {
      $('kidNote').hidden = false;
      $('kidNote').textContent = r.kidNote;
    } else {
      $('kidNote').hidden = true;
    }
    if (r.pfc) {
      $('recipePfc').hidden = false;
      $('recipePfc').textContent = r.pfc;
    } else {
      $('recipePfc').hidden = true;
    }
    const ul = $('ingredientList');
    ul.innerHTML = '';
    r.ingredients.forEach((ing) => {
      const li = document.createElement('li');
      li.textContent = ing;
      ul.appendChild(li);
    });
    show('view-recipe');
  }

  // ---- 調理モード ----
  function startCooking(recipeId, step) {
    currentRecipeId = recipeId;
    saveJSON(COOKING_KEY, { recipeId, step });
    renderStep();
    show('view-cook');
  }
  function renderStep() {
    const cooking = loadJSON(COOKING_KEY, null);
    if (!cooking) return;
    const r = getRecipe(cooking.recipeId);
    const s = r.steps[cooking.step];
    $('stepCard').hidden = false;
    $('finishBox').hidden = true;
    $('cookNav').hidden = false;
    $('quitCookBtn').hidden = false;
    $('cookCheer').textContent = CHEERS[Math.min(cooking.step, CHEERS.length - 1)];
    $('cookRecipeName').textContent = r.name;
    $('stepLabel').textContent = '手順 ' + (cooking.step + 1) + ' / ' + r.steps.length;
    $('stepText').textContent = s.text;
    $('nextStepBtn').textContent = cooking.step === r.steps.length - 1 ? '完成！' : 'できた！つぎへ';
    if (s.timerSec) {
      $('timerBox').hidden = false;
      timerLeft = s.timerSec;
      renderTimer();
      $('timerBtn').textContent = 'タイマー開始';
    } else {
      $('timerBox').hidden = true;
    }
  }
  function renderTimer() {
    const m = Math.floor(timerLeft / 60);
    const sec = String(timerLeft % 60).padStart(2, '0');
    $('timerDisplay').textContent = m + ':' + sec;
  }
  function stopTimer() {
    if (timerId) { clearInterval(timerId); timerId = null; }
  }
  function toggleTimer() {
    if (timerId) { stopTimer(); $('timerBtn').textContent = 'タイマー開始'; return; }
    $('timerBtn').textContent = 'とめる';
    timerId = setInterval(() => {
      timerLeft -= 1;
      if (timerLeft <= 0) {
        timerLeft = 0;
        stopTimer();
        $('timerBtn').textContent = 'タイマー開始';
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        alert('タイマー終了！次の手順に進んで大丈夫です');
      }
      renderTimer();
    }, 1000);
  }

  // ---- 買い物リスト ----
  function renderShopping() {
    const items = loadJSON(SHOPPING_KEY, []);
    const ul = $('shoppingList');
    ul.innerHTML = '';
    items.forEach((item, idx) => {
      const li = document.createElement('li');
      if (item.done) li.className = 'done';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = !!item.done;
      cb.addEventListener('change', () => {
        const cur = loadJSON(SHOPPING_KEY, []);
        cur[idx].done = cb.checked;
        saveJSON(SHOPPING_KEY, cur);
        renderShopping();
      });
      const span = document.createElement('span');
      span.textContent = item.name;
      li.appendChild(cb);
      li.appendChild(span);
      ul.appendChild(li);
    });
    show('view-shopping');
  }
  function addShoppingItems(names) {
    const items = loadJSON(SHOPPING_KEY, []);
    names.forEach((name) => {
      if (!items.some((i) => i.name === name)) items.push({ name, done: false });
    });
    saveJSON(SHOPPING_KEY, items);
  }

  // ---- イベント ----
  document.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', renderHome));
  $('gachaBtn').addEventListener('click', () => {
    const pool = filteredRecipes();
    if (pool.length === 0) return;
    const r = pool[Math.floor(Math.random() * pool.length)];
    openRecipe(r.id);
  });
  $('goShoppingBtn').addEventListener('click', renderShopping);
  $('resumeBtn').addEventListener('click', () => {
    const cooking = loadJSON(COOKING_KEY, null);
    if (cooking) startCooking(cooking.recipeId, cooking.step);
  });
  $('addShoppingBtn').addEventListener('click', () => {
    addShoppingItems(getRecipe(currentRecipeId).ingredients);
    renderShopping();
  });
  $('startCookBtn').addEventListener('click', () => startCooking(currentRecipeId, 0));
  $('nextStepBtn').addEventListener('click', () => {
    const cooking = loadJSON(COOKING_KEY, null);
    const r = getRecipe(cooking.recipeId);
    if (cooking.step >= r.steps.length - 1) {
      localStorage.removeItem(COOKING_KEY);
      stopTimer();
      $('stepCard').hidden = true;
      $('cookNav').hidden = true;
      $('quitCookBtn').hidden = true;
      $('finishBox').hidden = false;
    } else {
      cooking.step += 1;
      saveJSON(COOKING_KEY, cooking);
      stopTimer();
      renderStep();
    }
  });
  $('prevStepBtn').addEventListener('click', () => {
    const cooking = loadJSON(COOKING_KEY, null);
    if (!cooking) return;
    if (cooking.step > 0) {
      cooking.step -= 1;
      saveJSON(COOKING_KEY, cooking);
      stopTimer();
      renderStep();
    } else {
      // 最初の手順ではレシピ詳細に戻る
      openRecipe(cooking.recipeId);
    }
  });
  $('quitCookBtn').addEventListener('click', renderHome);
  $('finishHomeBtn').addEventListener('click', renderHome);
  $('cookBackBtn').addEventListener('click', renderHome);
  $('timerBtn').addEventListener('click', toggleTimer);
  $('addItemBtn').addEventListener('click', () => {
    const v = $('newItemInput').value.trim();
    if (!v) return;
    addShoppingItems([v]);
    $('newItemInput').value = '';
    renderShopping();
  });
  $('clearCheckedBtn').addEventListener('click', () => {
    saveJSON(SHOPPING_KEY, loadJSON(SHOPPING_KEY, []).filter((i) => !i.done));
    renderShopping();
  });

  renderHome();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RECIPES, getRecipe };
}
