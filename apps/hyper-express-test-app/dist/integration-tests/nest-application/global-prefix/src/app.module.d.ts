import { MiddlewareConsumer } from '@nestjs/common';
export declare const MIDDLEWARE_VALUE = "middleware";
export declare const MIDDLEWARE_PARAM_VALUE = "middleware_param";
export declare class AppModule {
    configure(consumer: MiddlewareConsumer): void;
}
