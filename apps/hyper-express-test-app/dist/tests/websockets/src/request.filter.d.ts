import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
export declare class RequestFilter implements ExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost): void;
}
