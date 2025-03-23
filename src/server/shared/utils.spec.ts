import { describe, expect, mock, test } from 'bun:test';
import { getKeywords, tap, transform } from './utils';

describe('transform', () => {
  test.each([
    [1, (v: number) => v * 10, 10],
    ['a', (v: string) => v.repeat(10), 'aaaaaaaaaa'],
    [{ test: 1 }, (v: { test: number }) => v.test, 1],
  ])('変換されたvalueが返却される', (value, callback, expected) => {
    // given
    // when
    const result = transform(value as never, callback as never);

    // then
    expect(result).toBe(expected);
  });

  test.each([[undefined], [null]])(
    'undefinedとnullの場合はそのままvalueが返却される',
    (value) => {
      // given
      // when
      const result = transform(value, () => 1);

      // then
      expect(result).toBe(value as never);
    },
  );
});

describe('tap', () => {
  test('コールバックが実行されvalueが返却される', async () => {
    // given
    const callback1 = mock((_: string) => undefined);
    const callback2 = mock(async (_: string) => undefined);

    // when
    const result = await tap('test', callback1, callback2);

    // then
    expect(result).toBe('test');
    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });
});

describe('getKeywords', () => {
  test.each([
    [null, []],
    [undefined, []],
    ['', []],
    [' ', []],
    ['a', ['a']],
    ['a b  a', ['a', 'b']],
  ])('キーワード検索用の文字列配列が返却される', (q, expected) => {
    // given
    // when
    const result = getKeywords(q);

    // then
    expect(result).toEqual(expected);
  });
});
