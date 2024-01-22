import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
export declare class ExpressController {
    getRawBody(req: RawBodyRequest<Request>): {
        parsed: any;
        raw: string;
    };
}
