"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let RequestFilter = class RequestFilter {
    catch(exception, host) {
        const wsCtx = host.switchToWs();
        const pattern = wsCtx.getPattern();
        const client = wsCtx.getClient();
        client.emit('exception', { pattern, message: exception.message });
    }
};
exports.RequestFilter = RequestFilter;
exports.RequestFilter = RequestFilter = __decorate([
    (0, common_1.Catch)(websockets_1.WsException)
], RequestFilter);
//# sourceMappingURL=request.filter.js.map