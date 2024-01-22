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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsPathGateway2 = void 0;
const websockets_1 = require("@nestjs/websockets");
let WsPathGateway2 = class WsPathGateway2 {
    onPush(client, data) {
        return {
            event: 'pop',
            data,
        };
    }
};
exports.WsPathGateway2 = WsPathGateway2;
__decorate([
    (0, websockets_1.SubscribeMessage)('push'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WsPathGateway2.prototype, "onPush", null);
exports.WsPathGateway2 = WsPathGateway2 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        path: '/ws-path',
    })
], WsPathGateway2);
//# sourceMappingURL=ws-path2.gateway.js.map