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
exports.HostArrayController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const host_array_service_1 = require("./host-array.service");
const user_by_id_pipe_1 = require("./users/user-by-id.pipe");
let HostArrayController = class HostArrayController {
    constructor(hostService) {
        this.hostService = hostService;
    }
    greeting(tenant) {
        return `${this.hostService.greeting()} tenant=${tenant}`;
    }
    async asyncGreeting(tenant) {
        return `${await this.hostService.greeting()} tenant=${tenant}`;
    }
    streamGreeting(tenant) {
        return (0, rxjs_1.of)(`${this.hostService.greeting()} tenant=${tenant}`);
    }
    localPipe(user, tenant) {
        return { ...user, tenant };
    }
};
exports.HostArrayController = HostArrayController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Header)('Authorization', 'Bearer'),
    __param(0, (0, common_1.HostParam)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", String)
], HostArrayController.prototype, "greeting", null);
__decorate([
    (0, common_1.Get)('async'),
    __param(0, (0, common_1.HostParam)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HostArrayController.prototype, "asyncGreeting", null);
__decorate([
    (0, common_1.Get)('stream'),
    __param(0, (0, common_1.HostParam)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", rxjs_1.Observable)
], HostArrayController.prototype, "streamGreeting", null);
__decorate([
    (0, common_1.Get)('local-pipe/:id'),
    __param(0, (0, common_1.Param)('id', user_by_id_pipe_1.UserByIdPipe)),
    __param(1, (0, common_1.HostParam)('tenant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Object)
], HostArrayController.prototype, "localPipe", null);
exports.HostArrayController = HostArrayController = __decorate([
    (0, common_1.Controller)({
        path: 'host-array',
        host: [':tenant.example1.com', ':tenant.example2.com'],
    }),
    __metadata("design:paramtypes", [host_array_service_1.HostArrayService])
], HostArrayController);
//# sourceMappingURL=host-array.controller.js.map