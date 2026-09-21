import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../dist/phonetics-core.js', import.meta.url), 'utf8');
const context = {};
vm.runInNewContext(source, context);
const core = context.PhoneticsCore;

test('covers the complete modern Hangul inventory', () => {
  assert.equal(core.inventory.hangulInitials.length, 19);
  assert.equal(core.inventory.hangulVowels.length, 21);
  assert.equal(core.inventory.hangulFinals.length, 28);
  for (const jamo of [...core.inventory.hangulInitials, ...core.inventory.hangulVowels]) {
    const result = core.fromKorean(jamo);
    assert.ok(result.zh.length > 0, jamo);
    assert.ok(result.ja.length > 0, jamo);
  }
  for (let initial = 0; initial < 19; initial += 1) {
    for (let vowel = 0; vowel < 21; vowel += 1) {
      const syllable = String.fromCharCode(0xAC00 + (initial * 21 + vowel) * 28);
      const result = core.fromKorean(syllable);
      assert.match(result.ja, /[ァ-ヶ]/);
      assert.match(result.bopomofo, /[ㄅ-ㆎ]/);
      assert.doesNotMatch(result.zh, /[가-힣]/);
    }
  }
});

test('normalizes Korean batchim and liaison instead of spelling clusters aloud', () => {
  assert.match(core.fromKorean('국물').bopomofo, /ㄥ/);
  assert.match(core.fromKorean('읽어').bopomofo, /ㄌ .*ㄍ/);
  assert.doesNotMatch(core.fromKorean('읽어').bopomofo, /ㄌㄎ/);
  assert.equal(core.fromKorean('사랑해').ko, '사랑해');
});

test('covers all 46 modern basic Japanese kana and extended rows', () => {
  assert.equal(core.inventory.japaneseGojuon.length, 46);
  for (const kana of core.inventory.japaneseGojuon) {
    const result = core.fromJapanese(kana);
    assert.ok(result.ko.length > 0, kana);
    assert.ok(result.zh.length > 0, kana);
  }
  for (const sample of ['がぎぐげご', 'ぱぴぷぺぽ', 'きゃしゅちょ', 'がっこう', 'スーパー', 'ほん']) {
    const result = core.fromJapanese(sample);
    assert.match(result.ko, /[가-힣ㄱ-ㅎ]/);
    assert.match(result.bopomofo, /[ㄅ-ㆎ]/);
    assert.doesNotMatch(result.zh, /[ぁ-ヺ]/);
    assert.doesNotMatch(result.ko, /[ㄱ-ㅎァ-ヶ]/);
  }
  assert.equal(core.fromJapanese('ほん').ko, '혼');
  assert.equal(core.fromJapanese('がっこう').ko, '각코우');
});

test('maps complete representative Mandarin finals and preserves tones in Bopomofo', () => {
  assert.equal(core.inventory.bopomofoSymbols.length, 37);
  const cases = {
    wo3: 'ㄨㄛˇ', xiang3: 'ㄒㄧㄤˇ', ni3: 'ㄋㄧˇ', zhi4: 'ㄓˋ', ju4: 'ㄐㄩˋ', 'lü4': 'ㄌㄩˋ',
    you3: 'ㄧㄡˇ', wei4: 'ㄨㄟˋ', yun2: 'ㄩㄣˊ', qiong2: 'ㄑㄩㄥˊ', r5: '˙ㄖ'
  };
  for (const [pinyin, expected] of Object.entries(cases)) assert.equal(core.pinyinToBopomofo(pinyin), expected, pinyin);
});

test('converts literal Bopomofo into Hangul and Katakana without copying it', () => {
  const result = core.fromBopomofo('ㄨㄛˇ ㄒㄧㄤˇ ㄋㄧˇ');
  assert.equal(result.ko, '워 샹 니');
  assert.equal(result.ja, 'ウォ シャン ニ');
  assert.doesNotMatch(result.ko, /[ㄅ-ㆎ]/);
});
