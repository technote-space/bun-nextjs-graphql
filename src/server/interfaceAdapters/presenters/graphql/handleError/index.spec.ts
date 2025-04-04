import { describe, expect, test } from 'bun:test';
import { ValidationException } from '@technote-space/vo-entity-ts';
import {
  BadRequest,
  Forbidden,
  InvalidControl,
  NotFound,
  Unauthorized,
  Unexpected,
} from '#/shared/exceptions';
import { GraphQLHandleErrorPresenter } from '.';

describe('GraphQLHandleErrorPresenter', () => {
  test('UnauthorizedがGraphQL用の出力に変換される', () => {
    // given
    const exception = new Unauthorized();
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('Unauthorized');
  });

  test('ForbiddenがGraphQL用の出力に変換される', () => {
    // given
    const exception = new Forbidden();
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('Forbidden');
  });

  test('BadRequestがGraphQL用の出力に変換される', () => {
    // given
    const exception = new BadRequest('test');
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('Bad Request');
  });

  test('InvalidControlがGraphQL用の出力に変換される', () => {
    // given
    const exception = new InvalidControl('test');
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow(
      'その操作は許可されていません',
    );
  });

  test('NotFoundがGraphQL用の出力に変換される', () => {
    // given
    const exception = new NotFound('法人', 'organization', 'organization-id');
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('法人が見つかりません');
  });

  test('ValidationExceptionがGraphQL用の出力に変換される', () => {
    // given
    const exception = new ValidationException({
      target1: ['error1', 'error2'],
      target2: ['error3'],
    });
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow(
      'バリデーションエラーが発生しました',
    );
  });

  test('UnexpectedがGraphQL用の出力に変換される', () => {
    // given
    const exception = new Unexpected('test');
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('予期していないエラー');
  });

  test('その他のエラーがGraphQL用の出力に変換される', () => {
    // given
    const exception = new Error('test');
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(exception)).toThrow('test');
  });

  test('その他のエラーがGraphQL用の出力に変換される', () => {
    // given
    const presenter = new GraphQLHandleErrorPresenter();

    // when
    // then
    expect(() => presenter.output(123)).toThrow();
  });
});
