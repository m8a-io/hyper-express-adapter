import type { RawBodyRequest } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NestHyperExpressBodyParserOptions } from '../../interfaces';

const rawBodyParser = (
  req: RawBodyRequest<IncomingMessage>,
  _res: ServerResponse,
  buffer: Buffer,
) => {
  if (Buffer.isBuffer(buffer)) {
    req.rawBody = buffer;
  }
  return true;
};

export function getBodyParserOptions<Options = NestHyperExpressBodyParserOptions>(
  rawBody: boolean,
  options?: Omit<Options, 'verify'> | undefined,
): Options {
  let parserOptions: Options = (options || {}) as Options;

  if (rawBody === true) {
    parserOptions = {
      ...parserOptions,
      verify: rawBodyParser,
    };
  }

  return parserOptions;
}
