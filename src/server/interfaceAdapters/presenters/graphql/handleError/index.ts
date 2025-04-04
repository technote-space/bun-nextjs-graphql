import { ErrorCode } from '$/types';
import {
  Exception as DomainException,
  ValidationException,
} from '@technote-space/vo-entity-ts';
import { GraphQLError } from 'graphql';
import { singleton } from 'tsyringe';
import {
  BadRequest,
  Forbidden,
  InvalidControl,
  NotFound,
  Unauthorized,
} from '#/shared/exceptions';
import type { HandleErrorPresenter } from '#/usecases/handleError/presenter';

@singleton()
export class GraphQLHandleErrorPresenter
  implements HandleErrorPresenter<never>
{
  public output(error: unknown): never {
    if (error instanceof Unauthorized) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.Unauthorized,
        },
      });
    }

    if (error instanceof Forbidden) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.Forbidden,
        },
      });
    }

    if (error instanceof BadRequest) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.BadRequest,
          reason: error.context?.reason,
        },
      });
    }

    if (error instanceof InvalidControl) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.InvalidControl,
          reason: error.context?.reason,
        },
      });
    }

    if (error instanceof NotFound) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.NotFound,
          table: error.context?.table,
          id: error.context?.id,
        },
      });
    }

    if (error instanceof ValidationException) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.ValidationError,
          errors: Object.entries(error.errors ?? {}).map(
            ([target, errors]) => ({
              target,
              errors,
            }),
          ),
        },
      });
    }

    if (error instanceof DomainException) {
      throw new GraphQLError(error.message, {
        extensions: {
          status: error.status,
          code: ErrorCode.UnexpectedError,
          reason: error.context?.reason,
        },
      });
    }

    if (error instanceof Error) {
      throw new GraphQLError(error.message, {
        extensions: { status: 500 },
      });
    }

    throw new GraphQLError('予期せぬエラーが発生しました', {
      extensions: { status: 500 },
    });
  }
}
