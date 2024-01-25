"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const request_interceptor_1 = require("./request.interceptor");
const rxjs_1 = require("rxjs");
const request_filter_1 = require("./request.filter");
let ApplicationGateway = class ApplicationGateway {
    onPush(data) {
        return {
            event: 'pop',
            data,
        };
    }
    getPathCalled(client, data) {
        return {
            event: 'popClient',
            data: { ...data, path: client.pattern },
        };
    }
    getPathCalledWithError() {
        return (0, rxjs_1.throwError)(() => new websockets_1.WsException('This is an error'));
    }
};
exports.ApplicationGateway = ApplicationGateway;
__decorate([
    (0, websockets_1.SubscribeMessage)('push'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ApplicationGateway.prototype, "onPush", null);
__decorate([
    (0, common_1.UseInterceptors)(request_interceptor_1.RequestInterceptor),
    (0, websockets_1.SubscribeMessage)('getClient'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ApplicationGateway.prototype, "getPathCalled", null);
__decorate([
    (0, common_1.UseFilters)(request_filter_1.RequestFilter),
    (0, websockets_1.SubscribeMessage)('getClientWithError'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApplicationGateway.prototype, "getPathCalledWithError", null);
exports.ApplicationGateway = ApplicationGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(8080)
], ApplicationGateway);
//# sourceMappingURL=app.gateway.js.map