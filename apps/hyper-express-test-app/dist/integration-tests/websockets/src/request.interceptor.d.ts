import { CallHandler, ExecutionContext } from '@nestjs/common';
export declare class RequestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): import("rxjs").Observable<any>;
}
