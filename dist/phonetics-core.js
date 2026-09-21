(function (root) {
  'use strict';

  const HANGUL_INITIALS = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const HANGUL_VOWELS = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const HANGUL_FINALS = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const KO_ONSETS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
  const KO_VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
  const KO_CODAS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'l', 'l', 'l', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

  const ZH_ONSET = { g: 'ㄍ', kk: 'ㄎ', n: 'ㄋ', d: 'ㄉ', tt: 'ㄊ', r: 'ㄌ', m: 'ㄇ', b: 'ㄅ', pp: 'ㄆ', s: 'ㄙ', ss: 'ㄙ', j: 'ㄐ', jj: 'ㄐ', ch: 'ㄑ', k: 'ㄎ', t: 'ㄊ', p: 'ㄆ', h: 'ㄏ', '': '' };
  const ZH_VOWEL = { a: 'ㄚ', ae: 'ㄟ', ya: 'ㄧㄚ', yae: 'ㄧㄟ', eo: 'ㄜ', e: 'ㄟ', yeo: 'ㄧㄜ', ye: 'ㄧㄝ', o: 'ㄛ', wa: 'ㄨㄚ', wae: 'ㄨㄟ', oe: 'ㄨㄟ', yo: 'ㄧㄛ', u: 'ㄨ', wo: 'ㄨㄛ', we: 'ㄨㄟ', wi: 'ㄨㄧ', yu: 'ㄩ', eu: 'ㄜ', ui: 'ㄨㄧ', i: 'ㄧ' };
  const ZH_CODA = { k: 'ㄎ', n: 'ㄣ', t: 'ㄊ', l: 'ㄌ', m: 'ㄇ', p: 'ㄆ', ng: 'ㄥ' };
  const ZH_CHAR_ONSET = { g: '格', kk: '克', n: '呢', d: '德', tt: '特', r: '勒', m: '姆', b: '伯', pp: '坡', s: '斯', ss: '思', j: '基', jj: '積', ch: '七', k: '科', t: '特', p: '坡', h: '喝', '': '' };
  const ZH_CHAR_VOWEL = { a: '啊', ae: '欸', ya: '呀', yae: '耶', eo: '喔', e: '欸', yeo: '唷', ye: '耶', o: '歐', wa: '哇', wae: '威', oe: '威', yo: '唷', u: '嗚', wo: '窩', we: '威', wi: '威', yu: '優', eu: '呃', ui: '威', i: '伊' };
  const ZH_CHAR_CODA = { k: '克', n: '恩', t: '特', l: '勒', m: '姆', p: '普', ng: '嗯' };
  const JA_ONSET = { g: 'グ', kk: 'ク', n: 'ヌ', d: 'ド', tt: 'ト', r: 'ル', m: 'ム', b: 'ブ', pp: 'プ', s: 'ス', ss: 'ス', j: 'ジ', jj: 'ジ', ch: 'チ', k: 'ク', t: 'ト', p: 'プ', h: 'フ', '': '' };
  const JA_VOWEL = { a: 'ア', ae: 'エ', ya: 'ヤ', yae: 'イェ', eo: 'オ', e: 'エ', yeo: 'ヨ', ye: 'イェ', o: 'オ', wa: 'ワ', wae: 'ウェ', oe: 'ウェ', yo: 'ヨ', u: 'ウ', wo: 'ウォ', we: 'ウェ', wi: 'ウィ', yu: 'ユ', eu: 'ウ', ui: 'ウィ', i: 'イ' };
  const JA_CODA = { k: 'ク', n: 'ン', t: 'ッ', l: 'ル', m: 'ム', p: 'プ', ng: 'ン' };

  const KO_EXACT = {
    ga: ['嘎', 'ガ'], geo: ['勾', 'ゴ'], ge: ['給', 'ゲ'], gi: ['基', 'ギ'], go: ['勾', 'ゴ'], gu: ['咕', 'グ'],
    na: ['那', 'ナ'], neo: ['諾', 'ノ'], ne: ['捏', 'ネ'], ni: ['尼', 'ニ'], no: ['諾', 'ノ'], nu: ['努', 'ヌ'],
    da: ['搭', 'ダ'], deo: ['德', 'ド'], de: ['爹', 'デ'], di: ['迪', 'ディ'], do: ['都', 'ド'], du: ['杜', 'ドゥ'],
    ra: ['拉', 'ラ'], reo: ['羅', 'ロ'], re: ['勒', 'レ'], ri: ['里', 'リ'], ro: ['羅', 'ロ'], ru: ['魯', 'ル'], reu: ['勒', 'ル'],
    ma: ['媽', 'マ'], me: ['美', 'メ'], mi: ['咪', 'ミ'], mo: ['摸', 'モ'], mu: ['姆', 'ム'],
    ba: ['巴', 'バ'], be: ['貝', 'ベ'], bi: ['比', 'ビ'], bo: ['波', 'ボ'], bu: ['布', 'ブ'],
    sa: ['撒', 'サ'], se: ['誰', 'セ'], seo: ['搜', 'ソ'], si: ['西', 'シ'], so: ['搜', 'ソ'], su: ['蘇', 'ス'],
    ja: ['嘉', 'ジャ'], je: ['傑', 'ジェ'], jeo: ['啾', 'ジョ'], ji: ['基', 'ジ'], jo: ['啾', 'ジョ'], ju: ['朱', 'ジュ'],
    cha: ['恰', 'チャ'], che: ['切', 'チェ'], cheo: ['秋', 'チョ'], chi: ['七', 'チ'], cho: ['秋', 'チョ'], chu: ['啾', 'チュ'],
    ka: ['卡', 'カ'], ke: ['開', 'ケ'], keo: ['口', 'コ'], ki: ['基', 'キ'], ko: ['口', 'コ'], ku: ['庫', 'ク'],
    ta: ['他', 'タ'], te: ['特', 'テ'], teo: ['偷', 'ト'], ti: ['替', 'ティ'], to: ['托', 'ト'], tu: ['吐', 'トゥ'],
    pa: ['帕', 'パ'], pe: ['佩', 'ペ'], peo: ['坡', 'ポ'], pi: ['皮', 'ピ'], po: ['波', 'ポ'], pu: ['普', 'プ'],
    ha: ['哈', 'ハ'], hae: ['嘿', 'ヘ'], he: ['嘿', 'ヘ'], heo: ['喝', 'ホ'], hi: ['希', 'ヒ'], ho: ['齁', 'ホ'], hu: ['呼', 'フ']
  };

  function decomposeHangul(character) {
    const code = character.charCodeAt(0) - 0xAC00;
    if (code < 0 || code > 11171) return null;
    return { initial: Math.floor(code / 588), vowel: Math.floor((code % 588) / 28), final: code % 28 };
  }

  function koreanUnits(text) {
    const units = Array.from(String(text)).map((character) => {
      const part = decomposeHangul(character);
      return part ? { character, ...part, onset: KO_ONSETS[part.initial], vowelSound: KO_VOWELS[part.vowel], coda: KO_CODAS[part.final] } : { character };
    });
    for (let i = 0; i < units.length - 1; i += 1) {
      const current = units[i]; const next = units[i + 1];
      if (!current.coda || next.initial === undefined) continue;
      if (next.initial === 11) {
        const simpleLiaison = { 1:'g', 2:'kk', 4:'n', 7:'d', 8:'r', 16:'m', 17:'b', 19:'s', 20:'ss', 22:'j', 23:'ch', 24:'k', 25:'t', 26:'p', 27:'' };
        const clusterLiaison = { 3:['k','s'], 5:['n','j'], 6:['n',''], 9:['l','g'], 10:['l','m'], 11:['l','b'], 12:['l','s'], 13:['l','t'], 14:['l','p'], 15:['l',''], 18:['p','s'] };
        if (Object.prototype.hasOwnProperty.call(simpleLiaison, current.final)) {
          current.coda = ''; next.onset = simpleLiaison[current.final];
        } else if (clusterLiaison[current.final]) {
          current.coda = clusterLiaison[current.final][0]; next.onset = clusterLiaison[current.final][1];
        }
      } else if (['n', 'm'].includes(next.onset)) {
        if (current.coda === 'k') current.coda = 'ng';
        if (current.coda === 't') current.coda = 'n';
        if (current.coda === 'p') current.coda = 'm';
      }
      if (current.coda === 'n' && next.onset === 'r') { current.coda = 'l'; next.onset = 'r'; }
      if (current.coda === 'l' && next.onset === 'n') next.onset = 'r';
    }
    return units;
  }

  function koreanUnitTargets(unit) {
    if (unit.initial === undefined) return { zh: unit.character, ja: unit.character, bopomofo: '' };
    const base = unit.onset + unit.vowelSound;
    const exact = KO_EXACT[base];
    const zhBase = exact ? exact[0] : (ZH_CHAR_ONSET[unit.onset] || '') + (ZH_CHAR_VOWEL[unit.vowelSound] || '啊');
    const jaBase = exact ? exact[1] : (JA_ONSET[unit.onset] || '') + (JA_VOWEL[unit.vowelSound] || 'ア');
    return {
      zh: zhBase + (ZH_CHAR_CODA[unit.coda] || ''),
      ja: jaBase + (JA_CODA[unit.coda] || ''),
      bopomofo: (ZH_ONSET[unit.onset] || '') + (ZH_VOWEL[unit.vowelSound] || '') + (ZH_CODA[unit.coda] || '')
    };
  }

  function fromKorean(text) {
    const units = koreanUnits(text); const converted = units.map(koreanUnitTargets);
    return { zh: converted.map((v) => v.zh).join(' '), ko: String(text), ja: converted.map((v) => v.ja).join(''), bopomofo: converted.map((v) => v.bopomofo).filter(Boolean).join(' ') };
  }

  const PINYIN_INITIAL_BPMF = { b: 'ㄅ', p: 'ㄆ', m: 'ㄇ', f: 'ㄈ', d: 'ㄉ', t: 'ㄊ', n: 'ㄋ', l: 'ㄌ', g: 'ㄍ', k: 'ㄎ', h: 'ㄏ', j: 'ㄐ', q: 'ㄑ', x: 'ㄒ', zh: 'ㄓ', ch: 'ㄔ', sh: 'ㄕ', r: 'ㄖ', z: 'ㄗ', c: 'ㄘ', s: 'ㄙ', '': '' };
  const PINYIN_FINAL_BPMF = {
    a: 'ㄚ', o: 'ㄛ', e: 'ㄜ', ai: 'ㄞ', ei: 'ㄟ', ao: 'ㄠ', ou: 'ㄡ', an: 'ㄢ', en: 'ㄣ', ang: 'ㄤ', eng: 'ㄥ', er: 'ㄦ',
    i: 'ㄧ', ia: 'ㄧㄚ', ie: 'ㄧㄝ', iao: 'ㄧㄠ', iu: 'ㄧㄡ', ian: 'ㄧㄢ', in: 'ㄧㄣ', iang: 'ㄧㄤ', ing: 'ㄧㄥ', iong: 'ㄩㄥ',
    u: 'ㄨ', ua: 'ㄨㄚ', uo: 'ㄨㄛ', uai: 'ㄨㄞ', ui: 'ㄨㄟ', uan: 'ㄨㄢ', un: 'ㄨㄣ', uang: 'ㄨㄤ', ueng: 'ㄨㄥ', ong: 'ㄨㄥ',
    'ü': 'ㄩ', 'üe': 'ㄩㄝ', 'üan': 'ㄩㄢ', 'ün': 'ㄩㄣ'
  };
  const TONE_MARK = { '1': '', '2': 'ˊ', '3': 'ˇ', '4': 'ˋ', '5': '˙', '0': '˙' };

  function parsePinyin(input) {
    let value = String(input || '').toLowerCase().trim().replace(/u:/g, 'ü').replace(/v/g, 'ü');
    const toneMatch = value.match(/([0-5])$/); const tone = toneMatch ? toneMatch[1] : '1';
    if (toneMatch) value = value.slice(0, -1);
    const yMap = { yi: 'i', ya: 'ia', yao: 'iao', ye: 'ie', you: 'iu', yan: 'ian', yin: 'in', yang: 'iang', ying: 'ing', yong: 'iong', yu: 'ü', yue: 'üe', yuan: 'üan', yun: 'ün' };
    const wMap = { wu: 'u', wa: 'ua', wo: 'uo', wai: 'uai', wei: 'ui', wan: 'uan', wen: 'un', wang: 'uang', weng: 'ueng' };
    if (yMap[value]) return { initial: '', final: yMap[value], tone, original: value };
    if (wMap[value]) return { initial: '', final: wMap[value], tone, original: value };
    const initial = Object.keys(PINYIN_INITIAL_BPMF).filter(Boolean).sort((a, b) => b.length - a.length).find((item) => value.startsWith(item)) || '';
    let final = value.slice(initial.length);
    if (['j', 'q', 'x'].includes(initial) && final.startsWith('u')) final = 'ü' + final.slice(1);
    return { initial, final, tone, original: value };
  }

  function pinyinToBopomofo(input) {
    const part = parsePinyin(input);
    const apical = part.final === 'i' && ['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(part.initial);
    const body = (PINYIN_INITIAL_BPMF[part.initial] || '') + (apical ? '' : (PINYIN_FINAL_BPMF[part.final] || ''));
    return part.tone === '5' || part.tone === '0' ? '˙' + body : body + (TONE_MARK[part.tone] || '');
  }

  const PINYIN_KO_EXACT = {
    wo: '워', xiang: '샹', ni: '니', zhi: '즈', chi: '츠', shi: '스', ri: '르', zi: '쯔', ci: '츠', si: '쓰',
    ju: '쥐', qu: '취', xu: '쉬', jue: '쥐에', que: '취에', xue: '쉬에', yu: '위', yue: '위에', yuan: '위엔', yun: '윈',
    yi: '이', wu: '우', you: '요우', wei: '웨이', wen: '원', ying: '잉', yong: '융', er: '얼'
  };
  const PINYIN_JA_EXACT = {
    wo: 'ウォ', xiang: 'シャン', ni: 'ニ', zhi: 'ジー', chi: 'チー', shi: 'シー', ri: 'リー', zi: 'ズー', ci: 'ツー', si: 'スー',
    ju: 'ジュ', qu: 'チュ', xu: 'シュ', jue: 'ジュエ', que: 'チュエ', xue: 'シュエ', yu: 'ユー', yue: 'ユエ', yuan: 'ユエン', yun: 'ユン',
    yi: 'イー', wu: 'ウー', you: 'ヨウ', wei: 'ウェイ', wen: 'ウェン', ying: 'イン', yong: 'ヨン', er: 'アール'
  };
  const PY_KO_ONSET = { b: 'ㅂ', p: 'ㅍ', m: 'ㅁ', f: 'ㅍ', d: 'ㄷ', t: 'ㅌ', n: 'ㄴ', l: 'ㄹ', g: 'ㄱ', k: 'ㅋ', h: 'ㅎ', j: 'ㅈ', q: 'ㅊ', x: 'ㅅ', zh: 'ㅈ', ch: 'ㅊ', sh: 'ㅅ', r: 'ㄹ', z: 'ㅈ', c: 'ㅊ', s: 'ㅅ', '': 'ㅇ' };
  const PY_KO_FINAL = { a: ['ㅏ', ''], o: ['ㅗ', ''], e: ['ㅓ', ''], ai: ['ㅏ', '이'], ei: ['ㅔ', '이'], ao: ['ㅏ', '오'], ou: ['ㅗ', '우'], an: ['ㅏ', 'ㄴ'], en: ['ㅓ', 'ㄴ'], ang: ['ㅏ', 'ㅇ'], eng: ['ㅓ', 'ㅇ'], er: ['ㅓ', 'ㄹ'], i: ['ㅣ', ''], ia: ['ㅑ', ''], ie: ['ㅖ', ''], iao: ['ㅑ', '오'], iu: ['ㅠ', ''], ian: ['ㅕ', 'ㄴ'], in: ['ㅣ', 'ㄴ'], iang: ['ㅑ', 'ㅇ'], ing: ['ㅣ', 'ㅇ'], iong: ['ㅠ', 'ㅇ'], u: ['ㅜ', ''], ua: ['ㅘ', ''], uo: ['ㅝ', ''], uai: ['ㅘ', '이'], ui: ['ㅞ', '이'], uan: ['ㅘ', 'ㄴ'], un: ['ㅝ', 'ㄴ'], uang: ['ㅘ', 'ㅇ'], ueng: ['ㅝ', 'ㅇ'], ong: ['ㅗ', 'ㅇ'], 'ü': ['ㅟ', ''], 'üe': ['ㅞ', ''], 'üan': ['ㅞ', 'ㄴ'], 'ün': ['ㅟ', 'ㄴ'] };
  const KO_INITIAL_INDEX = Object.fromEntries(HANGUL_INITIALS.map((v, i) => [v, i]));
  const KO_VOWEL_INDEX = Object.fromEntries(HANGUL_VOWELS.map((v, i) => [v, i]));
  const KO_FINAL_INDEX = Object.fromEntries(HANGUL_FINALS.map((v, i) => [v, i]));

  function composeHangul(onset, vowel, coda) {
    const oi = KO_INITIAL_INDEX[onset]; const vi = KO_VOWEL_INDEX[vowel]; const ci = KO_FINAL_INDEX[coda] || 0;
    return oi === undefined || vi === undefined ? '' : String.fromCharCode(0xAC00 + (oi * 21 + vi) * 28 + ci);
  }

  function pinyinToHangul(input) {
    const clean = String(input).toLowerCase().replace(/[0-5]$/, '').replace(/v/g, 'ü');
    if (PINYIN_KO_EXACT[clean]) return PINYIN_KO_EXACT[clean];
    const part = parsePinyin(input); const shape = PY_KO_FINAL[part.final];
    if (!shape) return '음';
    if (shape[1] === '이' || shape[1] === '오' || shape[1] === '우') return composeHangul(PY_KO_ONSET[part.initial], shape[0], '') + composeHangul('ㅇ', shape[1] === '이' ? 'ㅣ' : shape[1] === '오' ? 'ㅗ' : 'ㅜ', '');
    return composeHangul(PY_KO_ONSET[part.initial], shape[0], shape[1]);
  }

  const PY_JA_ONSET = { b: 'ブ', p: 'プ', m: 'ム', f: 'フ', d: 'ド', t: 'ト', n: 'ヌ', l: 'ル', g: 'グ', k: 'ク', h: 'フ', j: 'ジ', q: 'チ', x: 'シ', zh: 'ジ', ch: 'チ', sh: 'シ', r: 'ル', z: 'ズ', c: 'ツ', s: 'ス', '': '' };
  const PY_JA_FINAL = { a: 'ア', o: 'オ', e: 'オ', ai: 'アイ', ei: 'エイ', ao: 'アオ', ou: 'オウ', an: 'アン', en: 'エン', ang: 'アン', eng: 'オン', er: 'アール', i: 'イ', ia: 'ヤ', ie: 'イエ', iao: 'ヤオ', iu: 'ヨウ', ian: 'イエン', in: 'イン', iang: 'ヤン', ing: 'イン', iong: 'ヨン', u: 'ウ', ua: 'ワ', uo: 'ウォ', uai: 'ワイ', ui: 'ウェイ', uan: 'ワン', un: 'ウェン', uang: 'ワン', ueng: 'ウォン', ong: 'オン', 'ü': 'ユ', 'üe': 'ユエ', 'üan': 'ユエン', 'ün': 'ユン' };
  function pinyinToKana(input) {
    const clean = String(input).toLowerCase().replace(/[0-5]$/, '').replace(/v/g, 'ü');
    if (PINYIN_JA_EXACT[clean]) return PINYIN_JA_EXACT[clean];
    const part = parsePinyin(input); return (PY_JA_ONSET[part.initial] || '') + (PY_JA_FINAL[part.final] || '');
  }

  function fromPinyinSyllables(syllables, original) {
    const list = syllables.filter(Boolean);
    return { zh: String(original || ''), ko: list.map(pinyinToHangul).join(' '), ja: list.map(pinyinToKana).join(' '), bopomofo: list.map(pinyinToBopomofo).join(' ') };
  }

  const BPMF_INITIAL_PINYIN = Object.fromEntries(Object.entries(PINYIN_INITIAL_BPMF).filter(([key]) => key).map(([key, value]) => [value, key]));
  const BPMF_FINAL_PINYIN = Object.fromEntries(Object.entries(PINYIN_FINAL_BPMF).map(([key, value]) => [value, key]));
  function bopomofoToPinyin(syllable) {
    const clean = String(syllable).replace(/[ˊˇˋ˙]/g, '');
    const tone = String(syllable).includes('ˊ') ? '2' : String(syllable).includes('ˇ') ? '3' : String(syllable).includes('ˋ') ? '4' : String(syllable).includes('˙') ? '5' : '1';
    const initialSymbol = Object.keys(BPMF_INITIAL_PINYIN).sort((a, b) => b.length - a.length).find((item) => clean.startsWith(item)) || '';
    const initial = BPMF_INITIAL_PINYIN[initialSymbol] || ''; const finalSymbol = clean.slice(initialSymbol.length);
    let final = BPMF_FINAL_PINYIN[finalSymbol] || '';
    if (!final && ['zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(initial)) final = 'i';
    return initial + final + tone;
  }
  function fromBopomofo(text) {
    const syllables = String(text).match(/˙?[ㄅ-ㆎ]+[ˊˇˋ]?/g) || [];
    return fromPinyinSyllables(syllables.map(bopomofoToPinyin), text);
  }

  const GOJUON = ['ア','イ','ウ','エ','オ','カ','キ','ク','ケ','コ','サ','シ','ス','セ','ソ','タ','チ','ツ','テ','ト','ナ','ニ','ヌ','ネ','ノ','ハ','ヒ','フ','ヘ','ホ','マ','ミ','ム','メ','モ','ヤ','ユ','ヨ','ラ','リ','ル','レ','ロ','ワ','ヲ','ン'];
  const JA_ROMAJI = {
    ア:'a',イ:'i',ウ:'u',エ:'e',オ:'o',カ:'ka',キ:'ki',ク:'ku',ケ:'ke',コ:'ko',サ:'sa',シ:'shi',ス:'su',セ:'se',ソ:'so',タ:'ta',チ:'chi',ツ:'tsu',テ:'te',ト:'to',ナ:'na',ニ:'ni',ヌ:'nu',ネ:'ne',ノ:'no',ハ:'ha',ヒ:'hi',フ:'fu',ヘ:'he',ホ:'ho',マ:'ma',ミ:'mi',ム:'mu',メ:'me',モ:'mo',ヤ:'ya',ユ:'yu',ヨ:'yo',ラ:'ra',リ:'ri',ル:'ru',レ:'re',ロ:'ro',ワ:'wa',ヲ:'o',ン:'n',
    ガ:'ga',ギ:'gi',グ:'gu',ゲ:'ge',ゴ:'go',ザ:'za',ジ:'ji',ズ:'zu',ゼ:'ze',ゾ:'zo',ダ:'da',ヂ:'ji',ヅ:'zu',デ:'de',ド:'do',バ:'ba',ビ:'bi',ブ:'bu',ベ:'be',ボ:'bo',パ:'pa',ピ:'pi',プ:'pu',ペ:'pe',ポ:'po',ヴ:'vu'
  };
  const JA_DIGRAPH_ROMAJI = { キャ:'kya',キュ:'kyu',キョ:'kyo',シャ:'sha',シュ:'shu',ショ:'sho',チャ:'cha',チュ:'chu',チョ:'cho',ニャ:'nya',ニュ:'nyu',ニョ:'nyo',ヒャ:'hya',ヒュ:'hyu',ヒョ:'hyo',ミャ:'mya',ミュ:'myu',ミョ:'myo',リャ:'rya',リュ:'ryu',リョ:'ryo',ギャ:'gya',ギュ:'gyu',ギョ:'gyo',ジャ:'ja',ジュ:'ju',ジョ:'jo',ビャ:'bya',ビュ:'byu',ビョ:'byo',ピャ:'pya',ピュ:'pyu',ピョ:'pyo' };
  const JA_TARGET = {
    a:['아','啊','ㄚ'],i:['이','伊','ㄧ'],u:['우','嗚','ㄨ'],e:['에','欸','ㄟ'],o:['오','歐','ㄛ'],
    ka:['카','卡','ㄎㄚ'],ki:['키','基','ㄎㄧ'],ku:['쿠','庫','ㄎㄨ'],ke:['케','開','ㄎㄟ'],ko:['코','摳','ㄎㄡ'],
    sa:['사','撒','ㄙㄚ'],shi:['시','西','ㄒㄧ'],su:['스','蘇','ㄙㄨ'],se:['세','誰','ㄙㄟ'],so:['소','搜','ㄙㄡ'],
    ta:['타','他','ㄊㄚ'],chi:['치','七','ㄑㄧ'],tsu:['츠','次','ㄘㄨ'],te:['테','貼','ㄊㄟ'],to:['토','偷','ㄊㄡ'],
    na:['나','那','ㄋㄚ'],ni:['니','尼','ㄋㄧ'],nu:['누','努','ㄋㄨ'],ne:['네','捏','ㄋㄟ'],no:['노','諾','ㄋㄡ'],
    ha:['하','哈','ㄏㄚ'],hi:['히','希','ㄒㄧ'],fu:['후','呼','ㄈㄨ'],he:['헤','嘿','ㄏㄟ'],ho:['호','齁','ㄏㄡ'],
    ma:['마','媽','ㄇㄚ'],mi:['미','咪','ㄇㄧ'],mu:['무','姆','ㄇㄨ'],me:['메','美','ㄇㄟ'],mo:['모','摸','ㄇㄛ'],
    ya:['야','呀','ㄧㄚ'],yu:['유','優','ㄧㄡ'],yo:['요','唷','ㄧㄛ'],ra:['라','拉','ㄌㄚ'],ri:['리','里','ㄌㄧ'],ru:['루','魯','ㄌㄨ'],re:['레','勒','ㄌㄟ'],ro:['로','羅','ㄌㄛ'],wa:['와','哇','ㄨㄚ'],n:['ㄴ','嗯','ㄣ'],
    ga:['가','嘎','ㄍㄚ'],gi:['기','基','ㄍㄧ'],gu:['구','咕','ㄍㄨ'],ge:['게','給','ㄍㄟ'],go:['고','勾','ㄍㄡ'],za:['자','雜','ㄗㄚ'],ji:['지','基','ㄐㄧ'],zu:['즈','祖','ㄗㄨ'],ze:['제','賊','ㄗㄟ'],zo:['조','鄒','ㄗㄡ'],da:['다','搭','ㄉㄚ'],de:['데','爹','ㄉㄟ'],do:['도','都','ㄉㄡ'],ba:['바','巴','ㄅㄚ'],bi:['비','比','ㄅㄧ'],bu:['부','布','ㄅㄨ'],be:['베','貝','ㄅㄟ'],bo:['보','波','ㄅㄛ'],pa:['파','帕','ㄆㄚ'],pi:['피','皮','ㄆㄧ'],pu:['푸','普','ㄆㄨ'],pe:['페','佩','ㄆㄟ'],po:['포','坡','ㄆㄛ'],vu:['부','武','ㄨ'],
    kya:['캬','恰','ㄎㄧㄚ'],kyu:['큐','Q','ㄎㄧㄡ'],kyo:['쿄','丘','ㄎㄧㄛ'],sha:['샤','蝦','ㄒㄧㄚ'],shu:['슈','咻','ㄒㄧㄡ'],sho:['쇼','修','ㄒㄧㄛ'],cha:['차','恰','ㄑㄧㄚ'],chu:['추','啾','ㄑㄧㄡ'],cho:['초','秋','ㄑㄧㄛ'],nya:['냐','娘','ㄋㄧㄚ'],nyu:['뉴','妞','ㄋㄧㄡ'],nyo:['뇨','妞','ㄋㄧㄛ'],hya:['햐','呀','ㄒㄧㄚ'],hyu:['휴','咻','ㄒㄧㄡ'],hyo:['효','唷','ㄒㄧㄛ'],mya:['먀','喵','ㄇㄧㄚ'],myu:['뮤','謬','ㄇㄧㄡ'],myo:['묘','苗','ㄇㄧㄛ'],rya:['랴','俩','ㄌㄧㄚ'],ryu:['류','流','ㄌㄧㄡ'],ryo:['료','料','ㄌㄧㄛ'],gya:['갸','嘎','ㄍㄧㄚ'],gyu:['규','咕','ㄍㄧㄡ'],gyo:['교','唷','ㄍㄧㄛ'],ja:['자','嘉','ㄐㄧㄚ'],ju:['주','朱','ㄐㄧㄡ'],jo:['조','啾','ㄐㄧㄛ'],bya:['뱌','比呀','ㄅㄧㄚ'],byu:['뷰','比優','ㄅㄧㄡ'],byo:['뵤','比唷','ㄅㄧㄛ'],pya:['퍄','皮呀','ㄆㄧㄚ'],pyu:['퓨','皮優','ㄆㄧㄡ'],pyo:['표','皮唷','ㄆㄧㄛ']
  };

  function toKatakana(value) { return String(value).replace(/[ぁ-ゖ]/g, (character) => String.fromCharCode(character.charCodeAt(0) + 0x60)); }
  function attachHangulCoda(value, coda) {
    const characters = Array.from(value); const last = characters.pop();
    if (!last) return value;
    const part = decomposeHangul(last); const finalIndex = KO_FINAL_INDEX[coda];
    if (!part || part.final || finalIndex === undefined) return value;
    characters.push(String.fromCharCode(0xAC00 + (part.initial * 21 + part.vowel) * 28 + finalIndex));
    return characters.join('');
  }
  function finalVowel(romaji) {
    const match = String(romaji || '').match(/[aeiou]$/); return match ? match[0] : '';
  }
  function japaneseMoras(text) {
    const kana = toKatakana(text); const moras = [];
    for (let i = 0; i < kana.length;) {
      const pair = kana.slice(i, i + 2);
      if (JA_DIGRAPH_ROMAJI[pair]) { moras.push({ kana: pair, romaji: JA_DIGRAPH_ROMAJI[pair] }); i += 2; continue; }
      const character = kana[i];
      if (character === 'ッ') { moras.push({ kana: character, sokuon: true }); i += 1; continue; }
      if (character === 'ー') { moras.push({ kana: character, long: true }); i += 1; continue; }
      moras.push({ kana: character, romaji: JA_ROMAJI[character] || '' }); i += 1;
    }
    return moras;
  }
  function fromJapanese(text) {
    const moras = japaneseMoras(text); const zh = []; const ko = []; const bopomofo = [];
    for (let i = 0; i < moras.length; i += 1) {
      const mora = moras[i];
      if (mora.sokuon) {
        const next = moras.slice(i + 1).find((item) => item.romaji); const first = next ? next.romaji[0] : 't';
        const coda = first === 'k' || first === 'g' ? 'ㄱ' : first === 'p' || first === 'b' ? 'ㅂ' : 'ㅅ';
        if (ko.length) ko[ko.length - 1] = attachHangulCoda(ko[ko.length - 1], coda);
        if (zh.length) zh[zh.length - 1] += '（短停）';
        bopomofo.push(coda === 'ㄱ' ? 'ㄎ' : coda === 'ㅂ' ? 'ㄆ' : 'ㄊ');
        continue;
      }
      if (mora.long) {
        const previous = moras.slice(0, i).reverse().find((item) => item.romaji); const vowel = finalVowel(previous && previous.romaji); const target = JA_TARGET[vowel];
        if (target) { ko.push(target[0]); bopomofo.push(target[2]); }
        if (zh.length) zh[zh.length - 1] += '～';
        continue;
      }
      if (mora.romaji === 'n') {
        const next = moras.slice(i + 1).find((item) => item.romaji); const first = next ? next.romaji[0] : '';
        const coda = ['b', 'p', 'm'].includes(first) ? 'ㅁ' : ['k', 'g'].includes(first) ? 'ㅇ' : 'ㄴ';
        if (ko.length) ko[ko.length - 1] = attachHangulCoda(ko[ko.length - 1], coda); else ko.push('은');
        zh.push('嗯'); bopomofo.push(coda === 'ㅁ' ? 'ㄇ' : coda === 'ㅇ' ? 'ㄥ' : 'ㄣ');
        continue;
      }
      const target = JA_TARGET[mora.romaji];
      if (target) { ko.push(target[0]); zh.push(target[1]); bopomofo.push(target[2]); }
    }
    return { zh: zh.join(' '), ko: ko.join(''), ja: String(text), bopomofo: bopomofo.join(' ') };
  }

  root.PhoneticsCore = {
    inventory: { hangulInitials: HANGUL_INITIALS.slice(), hangulVowels: HANGUL_VOWELS.slice(), hangulFinals: HANGUL_FINALS.slice(), japaneseGojuon: GOJUON.slice(), bopomofoInitials: Object.values(PINYIN_INITIAL_BPMF).filter(Boolean), bopomofoFinals: Object.values(PINYIN_FINAL_BPMF) },
    fromKorean, fromJapanese, fromPinyinSyllables, fromBopomofo, pinyinToBopomofo, pinyinToHangul, pinyinToKana, bopomofoToPinyin, toKatakana, japaneseMoras
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
