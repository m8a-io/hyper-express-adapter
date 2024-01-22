import { RawBodyRequest } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
export declare class FastifyController {
    getRawBody(req: RawBodyRequest<FastifyRequest>): {
        parsed: any;
        raw: any;
    };
}
