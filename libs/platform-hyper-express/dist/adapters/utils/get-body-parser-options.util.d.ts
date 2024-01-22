import type { NestHyperExpressBodyParserOptions } from '../../interfaces';
export declare function getBodyParserOptions<Options = NestHyperExpressBodyParserOptions>(rawBody: boolean, options?: Omit<Options, 'verify'> | undefined): Options;
