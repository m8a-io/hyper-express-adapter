/// <reference types="node" />
import { RawBodyRequest } from '@nestjs/common';
import { IncomingMessage } from 'http';
export declare class AppController {
    index(req: RawBodyRequest<IncomingMessage>): {
        raw: string;
    };
}
