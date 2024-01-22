/// <reference types="node" />
/// <reference types="node" />
import { INestApplication } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { URL } from 'url';
export declare const getHttpBaseOptions: (app: INestApplication) => Promise<URL>;
export declare const sendCanceledHttpRequest: (url: URL) => Promise<unknown>;
export declare const sendHttpRequest: (url: URL) => Promise<IncomingMessage>;
